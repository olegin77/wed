export const MIN_REVIEW_RATING = 4;
export const MIN_REVIEW_LENGTH = 80;
export const MIN_REVIEW_WORDS = 15;

export interface ReviewCandidate {
  rating: number;
  text: string;
  attachmentsCount?: number;
  contractVerified: boolean;
  attendedEvent?: boolean;
  flaggedReasons?: string[];
}

export interface ReviewPolicyResult {
  canPublish: boolean;
  reasons: string[];
}

const countWords = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

/**
 * Evaluates whether a review can be published and collects rejection reasons.
 */
export const evaluateReview = ({
  rating,
  text,
  attachmentsCount = 0,
  contractVerified,
  attendedEvent = true,
  flaggedReasons = [],
}: ReviewCandidate): ReviewPolicyResult => {
  const reasons: string[] = [];
  const trimmed = text.trim();

  if (!contractVerified) {
    reasons.push('contract_not_verified');
  }

  if (rating < MIN_REVIEW_RATING) {
    reasons.push('rating_below_threshold');
  }

  if (trimmed.length < MIN_REVIEW_LENGTH || countWords(trimmed) < MIN_REVIEW_WORDS) {
    reasons.push('insufficient_text');
  }

  if (!attendedEvent) {
    reasons.push('guest_absent');
  }

  if (flaggedReasons.length > 0) {
    reasons.push(...flaggedReasons.map((flag) => `moderation_${flag}`));
  }

  if (attachmentsCount === 0) {
    reasons.push('missing_media');
  }

  const uniqueReasons = [...new Set(reasons)];
  return { canPublish: uniqueReasons.length === 0, reasons: uniqueReasons };
};

export const isReviewPublishable = (candidate: ReviewCandidate): boolean => evaluateReview(candidate).canPublish;
