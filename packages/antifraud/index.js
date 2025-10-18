/**
 * Opinionated anti-fraud helpers that model the heuristics we rely on during the
 * early stages of the marketplace. The module exposes documented flag
 * definitions together with a deterministic evaluator so services can attach
 * consistent signals to enquiries, bookings, or payments.
 */

/**
 * Enum-like object that describes how severe a fraud flag is. The values are
 * intentionally lowercase to remain serialisable without additional
 * transformations in JSON payloads.
 */
export const FLAG_SEVERITY = Object.freeze({
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
});

/**
 * Mapping used by the scoring helpers to translate a severity into a numeric
 * weight. Higher weights contribute more to the cumulative risk score.
 */
const SEVERITY_WEIGHTS = Object.freeze({
  none: 0,
  [FLAG_SEVERITY.LOW]: 1,
  [FLAG_SEVERITY.MEDIUM]: 3,
  [FLAG_SEVERITY.HIGH]: 5,
});

/** Default heuristics that can be overridden when calling the evaluator. */
const DEFAULT_THRESHOLDS = Object.freeze({
  duplicateContact: 1,
  enquiryVelocity: 5,
  failedPaymentAttempts: 3,
});

/**
 * Disposable email providers are frequently used to create throwaway accounts.
 * The list is deliberately short and can be extended through evaluator options.
 */
const DEFAULT_DISPOSABLE_DOMAINS = Object.freeze([
  "mailinator.com",
  "10minutemail.com",
  "tempmail.dev",
  "trashmail.com",
]);

/**
 * Country codes that historically correlate with fraudulent traffic for our
 * use-case. The evaluator allows services to provide their own set to match
 * real-time intelligence feeds.
 */
const DEFAULT_HIGH_RISK_COUNTRIES = Object.freeze(["NG", "GH", "UA", "PK"]);

/**
 * The canonical list of fraud flags. Every entry is heavily documented so it
 * can be rendered in admin tooling without looking up external references.
 */
export const FRAUD_FLAGS = Object.freeze(
  [
    {
      id: "duplicate_contact",
      title: "Duplicate contact information",
      description:
        "Multiple enquiries or bookings share the same email or phone number " +
        "within a short time window, which frequently indicates lead " +
        "scraping or scripted submissions.",
      severity: FLAG_SEVERITY.MEDIUM,
      remediation:
        "Verify the intent with the client and merge duplicates to avoid " +
        "double bookings.",
    },
    {
      id: "disposable_email",
      title: "Disposable email domain",
      description:
        "The contact email uses a disposable provider that bypasses " +
        "verification emails and dramatically increases the probability of " +
        "chargebacks.",
      severity: FLAG_SEVERITY.LOW,
      remediation:
        "Request an alternative email or perform an identity verification " +
        "step before confirming the booking.",
    },
    {
      id: "velocity_spike",
      title: "Unusual enquiry velocity",
      description:
        "The account created significantly more enquiries than the median " +
        "couple during the configured window.",
      severity: FLAG_SEVERITY.MEDIUM,
      remediation:
        "Rate limit the actor and surface additional challenges before " +
        "allowing new requests.",
    },
    {
      id: "failed_payment_spike",
      title: "Repeated payment failures",
      description:
        "The payment processor rejected multiple attempts in a short period, " +
        "which often signals card testing or brute-force attacks.",
      severity: FLAG_SEVERITY.MEDIUM,
      remediation:
        "Pause further attempts and notify the fraud desk to investigate " +
        "potential card testing.",
    },
    {
      id: "geo_mismatch",
      title: "Geo-location mismatch",
      description:
        "The declared country differs from the IP-derived country and the IP " +
        "belongs to a region that historically correlates with fraud.",
      severity: FLAG_SEVERITY.HIGH,
      remediation:
        "Request additional verification or temporarily block processing " +
        "until the customer confirms their identity.",
    },
    {
      id: "stolen_card_report",
      title: "Reported stolen payment instrument",
      description:
        "External processors or internal chargeback tooling marked the card as " +
        "stolen or associated with previous disputes.",
      severity: FLAG_SEVERITY.HIGH,
      remediation:
        "Reject the transaction and notify the payment provider about the " +
        "attempt to minimise losses.",
    },
  ].map((entry) => Object.freeze(entry))
);

const FLAG_INDEX = new Map(FRAUD_FLAGS.map((flag) => [flag.id, flag]));

/** Severity ranking used to derive the most impactful flag in a result set. */
const SEVERITY_RANK = Object.freeze({
  none: -1,
  [FLAG_SEVERITY.LOW]: 0,
  [FLAG_SEVERITY.MEDIUM]: 1,
  [FLAG_SEVERITY.HIGH]: 2,
});

function assertPlainObject(value, label) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new TypeError(`antifraud.invalid_${label}`);
  }
  return value;
}

function normaliseString(value) {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function normaliseCountry(value) {
  const country = normaliseString(value);
  return country ? country.toUpperCase() : undefined;
}

function normaliseNumber(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function normaliseBoolean(value) {
  return value === true;
}

function createNormalisedSet(values, fallback, transform = (value) => value) {
  const output = new Set();

  const ingest = (collection) => {
    for (const entry of collection) {
      const normalised = normaliseString(entry);
      if (!normalised) {
        continue;
      }
      output.add(transform(normalised));
    }
  };

  if (values) {
    ingest(values);
  } else {
    ingest(fallback);
  }

  return output;
}

function normaliseSignals(rawSignals) {
  const signals = assertPlainObject(rawSignals, "signals");

  const email = normaliseString(signals.email)?.toLowerCase();
  const phone = normaliseString(signals.phone)?.replace(/\D+/g, "");

  return {
    email,
    phone,
    duplicateContactCount: normaliseNumber(signals.duplicateContactCount),
    recentEnquiryCount: normaliseNumber(signals.recentEnquiryCount),
    failedPaymentAttempts: normaliseNumber(signals.failedPaymentAttempts),
    declaredCountry: normaliseCountry(signals.declaredCountry),
    ipCountry: normaliseCountry(signals.ipCountry),
    hasStolenCardReport: normaliseBoolean(signals.hasStolenCardReport),
    suspiciousIpReputation: normaliseBoolean(signals.suspiciousIpReputation),
  };
}

function normaliseOptions(rawOptions = {}) {
  const options = assertPlainObject(rawOptions, "options");
  const thresholds = Object.assign({}, DEFAULT_THRESHOLDS);

  if (
    typeof options.thresholds === "object" &&
    options.thresholds !== null &&
    !Array.isArray(options.thresholds)
  ) {
    const { duplicateContact, enquiryVelocity, failedPaymentAttempts } =
      options.thresholds;

    if (Number.isFinite(duplicateContact) && duplicateContact >= 0) {
      thresholds.duplicateContact = duplicateContact;
    }
    if (Number.isFinite(enquiryVelocity) && enquiryVelocity >= 0) {
      thresholds.enquiryVelocity = enquiryVelocity;
    }
    if (Number.isFinite(failedPaymentAttempts) && failedPaymentAttempts >= 0) {
      thresholds.failedPaymentAttempts = failedPaymentAttempts;
    }
  }

  const disposableEmailDomains = createNormalisedSet(
    options.disposableEmailDomains,
    DEFAULT_DISPOSABLE_DOMAINS,
    (value) => value.toLowerCase()
  );

  const highRiskCountries = createNormalisedSet(
    options.highRiskCountries,
    DEFAULT_HIGH_RISK_COUNTRIES,
    (value) => value.toUpperCase()
  );

  return {
    thresholds,
    disposableEmailDomains,
    highRiskCountries,
  };
}

function pushMatch(matches, flagId, evidence) {
  const definition = FLAG_INDEX.get(flagId);
  if (!definition) {
    throw new Error(`antifraud.unknown_flag:${flagId}`);
  }

  matches.push(
    Object.freeze({
      flag: definition,
      evidence: Object.freeze({ ...evidence }),
    })
  );
}

function deriveHighestSeverity(matches) {
  if (matches.length === 0) {
    return "none";
  }

  return matches.reduce((current, match) => {
    const severity = match.flag.severity;
    return SEVERITY_RANK[severity] > SEVERITY_RANK[current] ? severity : current;
  }, FLAG_SEVERITY.LOW);
}

function calculateRiskScore(matches) {
  return matches.reduce(
    (score, match) => score + SEVERITY_WEIGHTS[match.flag.severity],
    0
  );
}

/**
 * Returns the definition of the requested flag or `undefined` when the flag is
 * not recognised. Consumers typically use this helper to render tooltips in UI
 * components without duplicating the metadata locally.
 */
export function getFlagDefinition(flagId) {
  return FLAG_INDEX.get(flagId);
}

/**
 * Evaluates the provided signals against the pre-defined heuristics and returns
 * both the triggered flags and aggregate risk metrics.
 *
 * @param {Record<string, unknown>} signals - Raw signals collected for a
 *   booking/enquiry/payment. Supported fields are documented in the README and
 *   within this module.
 * @param {Record<string, unknown>} [options] - Optional overrides that allow
 *   services to adjust thresholds or extend the list of disposable domains.
 * @returns {{ matches: readonly { flag: typeof FRAUD_FLAGS[number]; evidence: Record<string, unknown> }[];
 *   riskScore: number; highestSeverity: keyof typeof FLAG_SEVERITY | "none" }}
 *   Structured result with the triggered matches and summary metrics.
 */
export function evaluateFraudFlags(signals, options = {}) {
  const normalisedSignals = normaliseSignals(signals);
  const normalisedOptions = normaliseOptions(options);
  const matches = [];

  const {
    duplicateContactCount,
    recentEnquiryCount,
    failedPaymentAttempts,
    email,
    declaredCountry,
    ipCountry,
    hasStolenCardReport,
    suspiciousIpReputation,
  } = normalisedSignals;

  const { thresholds, disposableEmailDomains, highRiskCountries } =
    normalisedOptions;

  if (duplicateContactCount >= thresholds.duplicateContact) {
    pushMatch(matches, "duplicate_contact", {
      duplicateContactCount,
      threshold: thresholds.duplicateContact,
    });
  }

  if (recentEnquiryCount >= thresholds.enquiryVelocity) {
    pushMatch(matches, "velocity_spike", {
      recentEnquiryCount,
      threshold: thresholds.enquiryVelocity,
    });
  }

  if (failedPaymentAttempts >= thresholds.failedPaymentAttempts) {
    pushMatch(matches, "failed_payment_spike", {
      failedPaymentAttempts,
      threshold: thresholds.failedPaymentAttempts,
    });
  }

  if (email) {
    const domain = email.split("@").pop();
    if (domain && disposableEmailDomains.has(domain)) {
      pushMatch(matches, "disposable_email", { email, domain });
    }
  }

  if (declaredCountry && ipCountry && declaredCountry !== ipCountry) {
    pushMatch(matches, "geo_mismatch", {
      declaredCountry,
      ipCountry,
      highRisk: highRiskCountries.has(ipCountry) || suspiciousIpReputation,
    });
  } else if (!declaredCountry && suspiciousIpReputation) {
    pushMatch(matches, "geo_mismatch", {
      declaredCountry,
      ipCountry,
      highRisk: true,
    });
  }

  if (hasStolenCardReport) {
    pushMatch(matches, "stolen_card_report", {
      failedPaymentAttempts,
    });
  }

  const riskScore = calculateRiskScore(matches);
  const highestSeverity = deriveHighestSeverity(matches);

  return Object.freeze({
    matches: Object.freeze(matches),
    riskScore,
    highestSeverity,
  });
}
