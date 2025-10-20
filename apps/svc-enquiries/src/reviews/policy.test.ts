import assert from "node:assert/strict";
import test from "node:test";

import { evaluateReview, isReviewPublishable, MIN_REVIEW_RATING } from "./policy.js";

const baseCandidate = {
  rating: MIN_REVIEW_RATING,
  text: "Отличная площадка, персонал очень внимательный и мы остались довольны мероприятием с декором.",
  attachmentsCount: 1,
  contractVerified: true,
};

test("approves fully qualified reviews", () => {
  assert.equal(isReviewPublishable(baseCandidate), true);
});

test("collects rejection reasons", () => {
  const result = evaluateReview({
    ...baseCandidate,
    rating: 3,
    text: "Понравилось",
    attachmentsCount: 0,
    contractVerified: false,
    flaggedReasons: ["abuse"],
  });

  assert.equal(result.canPublish, false);
  assert.deepEqual(result.reasons.sort(), [
    "contract_not_verified",
    "insufficient_text",
    "missing_media",
    "moderation_abuse",
    "rating_below_threshold",
  ]);
});
