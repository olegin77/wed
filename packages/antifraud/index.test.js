import test from "node:test";
import assert from "node:assert/strict";

import {
  FLAG_SEVERITY,
  FRAUD_FLAGS,
  evaluateFraudFlags,
  getFlagDefinition,
} from "./index.js";

test("exposes immutable flag metadata", () => {
  assert.equal(typeof FLAG_SEVERITY.LOW, "string");
  assert.equal(FLAG_SEVERITY.LOW, "low");

  assert.ok(Object.isFrozen(FRAUD_FLAGS));
  const identifiers = new Set();

  for (const definition of FRAUD_FLAGS) {
    assert.ok(Object.isFrozen(definition));
    assert.ok(definition.id.length > 0);
    assert.ok(!identifiers.has(definition.id), "definitions should be unique");
    identifiers.add(definition.id);
  }
});

test("getFlagDefinition returns canonical instances", () => {
  const sample = FRAUD_FLAGS[0];
  assert.equal(getFlagDefinition(sample.id), sample);
  assert.equal(getFlagDefinition("unknown"), undefined);
});

test("benign signals do not trigger any flags", () => {
  const result = evaluateFraudFlags({
    email: "couple@example.com",
    phone: "+998 90 123-45-67",
    recentEnquiryCount: 2,
    duplicateContactCount: 0,
    failedPaymentAttempts: 0,
  });

  assert.deepEqual(result.matches, []);
  assert.equal(result.riskScore, 0);
  assert.equal(result.highestSeverity, "none");
  assert.ok(Object.isFrozen(result.matches));
});

test("detects duplicate contacts, velocity spikes, disposable emails, and geo mismatches", () => {
  const result = evaluateFraudFlags({
    email: "fraudster@mailinator.com",
    duplicateContactCount: 3,
    recentEnquiryCount: 8,
    declaredCountry: "UZ",
    ipCountry: "NG",
  });

  const triggeredIds = result.matches.map((match) => match.flag.id);
  assert.deepEqual(triggeredIds.sort(), [
    "disposable_email",
    "duplicate_contact",
    "geo_mismatch",
    "velocity_spike",
  ]);

  assert.equal(result.highestSeverity, "high");
  assert.equal(result.riskScore, 1 + 3 + 5 + 3);
});

test("flags repeated payment failures and honours custom thresholds", () => {
  const result = evaluateFraudFlags(
    {
      failedPaymentAttempts: 2,
    },
    {
      thresholds: { failedPaymentAttempts: 2 },
    }
  );

  assert.equal(result.matches.length, 1);
  assert.equal(result.matches[0].flag.id, "failed_payment_spike");
  assert.equal(result.riskScore, 3);
  assert.equal(result.highestSeverity, "medium");
});

test("custom disposable domains and high-risk countries extend defaults", () => {
  const result = evaluateFraudFlags(
    {
      email: "lead@Example.org",
      declaredCountry: "UZ",
      ipCountry: "de",
    },
    {
      disposableEmailDomains: new Set(["Example.org"]),
      highRiskCountries: ["DE"],
    }
  );

  const triggeredIds = result.matches.map((match) => match.flag.id).sort();
  assert.deepEqual(triggeredIds, ["disposable_email", "geo_mismatch"]);
});

test("suspicious IP reputation triggers geo mismatch even without declared country", () => {
  const result = evaluateFraudFlags({
    suspiciousIpReputation: true,
    ipCountry: "br",
  });

  assert.equal(result.matches[0].flag.id, "geo_mismatch");
  assert.equal(result.matches[0].evidence.highRisk, true);
});

test("rejects invalid payload shapes", () => {
  assert.throws(() => evaluateFraudFlags(null), /antifraud.invalid_signals/);
  assert.throws(() => evaluateFraudFlags({}, null), /antifraud.invalid_options/);
});
