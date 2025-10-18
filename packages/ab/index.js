/**
 * Lightweight A/B testing helpers that provide deterministic traffic splits,
 * optional holdouts, and convenient override/exposure hooks for experiments
 * that live entirely inside the monorepo. The module is intentionally
 * framework-agnostic so it can be reused both in Node services and browser
 * bundles.
 */

const BUCKET_COUNT = 10_000;
const FNV_OFFSET = 0x811c9dc5;
const FNV_PRIME = 0x01000193;

/**
 * Creates an isolated runtime for deterministic experiment assignments.
 *
 * @template [TContext=unknown]
 * @param {import('./index.ts').AbRuntimeOptions<TContext>} [options]
 * @returns {import('./index.ts').AbRuntime<TContext>}
 */
export function createAbRuntime(options = {}) {
  const overrideStore = new Map();
  preloadOverrides(overrideStore, options.overrides);
  const onExposure = options.onExposure;

  return {
    assign(definition, uid) {
      return assignVariant(definition, uid, overrideStore);
    },
    expose(definition, uid, context) {
      const assignment = assignVariant(definition, uid, overrideStore);
      if (assignment.included && typeof onExposure === "function") {
        onExposure({
          key: assignment.key,
          uid: assignment.uid,
          bucket: assignment.bucket,
          variant: assignment.variant,
          context,
        });
      }
      return assignment;
    },
    setOverride(key, variant, uid) {
      const scoped = ensureOverrideScope(overrideStore, key);
      scoped.set(uid ?? "*", variant);
    },
    clearOverride(key, uid) {
      const scoped = overrideStore.get(key);
      if (!scoped) {
        return;
      }
      const token = uid ?? "*";
      scoped.delete(token);
      if (scoped.size === 0) {
        overrideStore.delete(key);
      }
    },
  };
}

function preloadOverrides(store, seed) {
  if (!seed) {
    return;
  }

  if (seed instanceof Map) {
    for (const [experimentKey, value] of seed) {
      const scoped = ensureOverrideScope(store, experimentKey);
      if (value instanceof Map) {
        for (const [uid, variant] of value) {
          scoped.set(uid, variant);
        }
      } else {
        scoped.set("*", value);
      }
    }
    return;
  }

  for (const experimentKey of Object.keys(seed)) {
    const scoped = ensureOverrideScope(store, experimentKey);
    const value = seed[experimentKey];
    if (value && typeof value === "object") {
      for (const uid of Object.keys(value)) {
        scoped.set(uid, value[uid]);
      }
    } else if (typeof value === "string") {
      scoped.set("*", value);
    }
  }
}

function ensureOverrideScope(store, key) {
  let scoped = store.get(key);
  if (!scoped) {
    scoped = new Map();
    store.set(key, scoped);
  }
  return scoped;
}

function assignVariant(definition, uid, overrides) {
  validateDefinition(definition);
  const bucket = computeBucket(definition, uid);
  const override = resolveOverride(overrides, definition.key, uid);

  if (override) {
    const variant = findVariant(definition, override);
    return {
      key: definition.key,
      uid,
      bucket,
      variant,
      included: true,
      reason: "override",
    };
  }

  const coverage = definition.coverage ?? 1;
  if (coverage < 0 || coverage > 1) {
    throw new RangeError(`ab.invalid_coverage:${coverage}`);
  }
  const coverageThreshold = Math.floor(coverage * BUCKET_COUNT);

  if (coverageThreshold === 0 || bucket >= coverageThreshold) {
    const variant = resolveControlVariant(definition);
    return {
      key: definition.key,
      uid,
      bucket,
      variant,
      included: false,
      reason: "holdout",
    };
  }

  const variant = pickWeightedVariant(definition, bucket / coverageThreshold);
  return {
    key: definition.key,
    uid,
    bucket,
    variant,
    included: true,
    reason: "bucket",
  };
}

function validateDefinition(definition) {
  if (!definition || typeof definition !== "object") {
    throw new TypeError("ab.invalid_definition");
  }
  if (!definition.key || typeof definition.key !== "string") {
    throw new TypeError("ab.invalid_key");
  }
  if (!Array.isArray(definition.variants) || definition.variants.length === 0) {
    throw new RangeError("ab.missing_variants");
  }

  const seen = new Set();
  for (const variant of definition.variants) {
    if (!variant || typeof variant !== "object") {
      throw new TypeError("ab.invalid_variant");
    }
    if (!variant.name || typeof variant.name !== "string") {
      throw new TypeError("ab.invalid_variant_name");
    }
    if (seen.has(variant.name)) {
      throw new RangeError(`ab.duplicate_variant:${variant.name}`);
    }
    seen.add(variant.name);
    if (variant.weight !== undefined) {
      if (typeof variant.weight !== "number" || !Number.isFinite(variant.weight)) {
        throw new TypeError("ab.invalid_variant_weight");
      }
      if (variant.weight <= 0) {
        throw new RangeError("ab.non_positive_weight");
      }
    }
  }

  if (definition.controlVariant) {
    findVariant(definition, definition.controlVariant);
  }
}

function findVariant(definition, name) {
  const variant = definition.variants.find((entry) => entry.name === name);
  if (!variant) {
    throw new RangeError(`ab.unknown_variant:${name}`);
  }
  return variant;
}

function resolveControlVariant(definition) {
  if (definition.controlVariant) {
    return findVariant(definition, definition.controlVariant);
  }
  return definition.variants[0];
}

function resolveOverride(overrides, key, uid) {
  const scoped = overrides.get(key);
  if (!scoped) {
    return undefined;
  }
  return scoped.get(uid) ?? scoped.get("*");
}

function computeBucket(definition, uid) {
  const seed = `${definition.seed ?? ""}:${definition.key}:${uid}`;
  let hash = FNV_OFFSET;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, FNV_PRIME) >>> 0;
  }
  return hash % BUCKET_COUNT;
}

function pickWeightedVariant(definition, ratio) {
  const totalWeight = definition.variants.reduce((accumulator, entry) => {
    const weight = entry.weight ?? 1;
    return accumulator + weight;
  }, 0);
  if (totalWeight <= 0) {
    throw new RangeError("ab.invalid_weight_total");
  }

  let cumulative = 0;
  for (let index = 0; index < definition.variants.length; index += 1) {
    const entry = definition.variants[index];
    cumulative += (entry.weight ?? 1) / totalWeight;
    if (ratio < cumulative || index === definition.variants.length - 1) {
      return entry;
    }
  }

  return definition.variants[definition.variants.length - 1];
}
