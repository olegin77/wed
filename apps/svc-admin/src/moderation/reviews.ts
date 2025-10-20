export interface ReviewModerationInput {
  /**
   * Indicates whether the vendor-pair contract has been verified by the admin team.
   * Only verified contracts allow the publication of associated reviews.
   */
  contractVerified: boolean;
}

/**
 * Returns true when a review may be published on the platform.
 * The "contract verified" rule enforces that only couples with a
 * confirmed vendor contract can leave public feedback.
 */
export function canPublishReview({ contractVerified }: ReviewModerationInput): boolean {
  return Boolean(contractVerified);
}
