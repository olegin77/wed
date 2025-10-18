export const MIN_REVIEW_RATING = 4;
export const MIN_REVIEW_LENGTH = 50;

export const isReviewPublishable = (rating: number, text: string): boolean =>
  rating >= MIN_REVIEW_RATING && text.trim().length >= MIN_REVIEW_LENGTH;
