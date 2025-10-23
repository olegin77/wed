/**
 * Date utilities
 */

export interface DateRange {
  start: Date;
  end: Date;
}

export interface TimeSlot {
  start: Date;
  end: Date;
  available: boolean;
}

/**
 * Get start of day
 */
export function startOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * Get end of day
 */
export function endOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
}

/**
 * Get start of week
 */
export function startOfWeek(date: Date, firstDayOfWeek: number = 1): Date {
  const result = new Date(date);
  const day = result.getDay();
  const diff = (day < firstDayOfWeek ? 7 : 0) + day - firstDayOfWeek;
  result.setDate(result.getDate() - diff);
  return startOfDay(result);
}

/**
 * Get end of week
 */
export function endOfWeek(date: Date, firstDayOfWeek: number = 1): Date {
  const result = startOfWeek(date, firstDayOfWeek);
  result.setDate(result.getDate() + 6);
  return endOfDay(result);
}

/**
 * Get start of month
 */
export function startOfMonth(date: Date): Date {
  const result = new Date(date);
  result.setDate(1);
  return startOfDay(result);
}

/**
 * Get end of month
 */
export function endOfMonth(date: Date): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + 1, 0);
  return endOfDay(result);
}

/**
 * Add days to date
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Add months to date
 */
export function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

/**
 * Add years to date
 */
export function addYears(date: Date, years: number): Date {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + years);
  return result;
}

/**
 * Get difference in days between two dates
 */
export function differenceInDays(dateLeft: Date, dateRight: Date): number {
  const start = startOfDay(dateLeft);
  const end = startOfDay(dateRight);
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Get difference in hours between two dates
 */
export function differenceInHours(dateLeft: Date, dateRight: Date): number {
  return Math.round((dateRight.getTime() - dateLeft.getTime()) / (1000 * 60 * 60));
}

/**
 * Get difference in minutes between two dates
 */
export function differenceInMinutes(dateLeft: Date, dateRight: Date): number {
  return Math.round((dateRight.getTime() - dateLeft.getTime()) / (1000 * 60));
}

/**
 * Check if date is today
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return isSameDay(date, today);
}

/**
 * Check if date is yesterday
 */
export function isYesterday(date: Date): boolean {
  const yesterday = addDays(new Date(), -1);
  return isSameDay(date, yesterday);
}

/**
 * Check if date is tomorrow
 */
export function isTomorrow(date: Date): boolean {
  const tomorrow = addDays(new Date(), 1);
  return isSameDay(date, tomorrow);
}

/**
 * Check if two dates are the same day
 */
export function isSameDay(dateLeft: Date, dateRight: Date): boolean {
  return (
    dateLeft.getFullYear() === dateRight.getFullYear() &&
    dateLeft.getMonth() === dateRight.getMonth() &&
    dateLeft.getDate() === dateRight.getDate()
  );
}

/**
 * Check if date is in the past
 */
export function isPast(date: Date): boolean {
  return date < new Date();
}

/**
 * Check if date is in the future
 */
export function isFuture(date: Date): boolean {
  return date > new Date();
}

/**
 * Check if date is within a range
 */
export function isWithinRange(date: Date, range: DateRange): boolean {
  return date >= range.start && date <= range.end;
}

/**
 * Get business days between two dates (excluding weekends)
 */
export function getBusinessDays(startDate: Date, endDate: Date): number {
  let count = 0;
  const current = new Date(startDate);
  
  while (current <= endDate) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday (0) or Saturday (6)
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return count;
}

/**
 * Get next business day
 */
export function getNextBusinessDay(date: Date): Date {
  let nextDay = addDays(date, 1);
  
  while (nextDay.getDay() === 0 || nextDay.getDay() === 6) {
    nextDay = addDays(nextDay, 1);
  }
  
  return nextDay;
}

/**
 * Format date for display
 */
export function formatDateForDisplay(date: Date, locale: string = 'ru-RU'): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * Format time for display
 */
export function formatTimeForDisplay(date: Date, locale: string = 'ru-RU'): string {
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Parse date from various formats
 */
export function parseDate(dateString: string): Date | null {
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
}

/**
 * Get time slots for a day
 */
export function getTimeSlots(
  date: Date,
  startHour: number = 9,
  endHour: number = 18,
  intervalMinutes: number = 30
): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const start = new Date(date);
  start.setHours(startHour, 0, 0, 0);
  
  const end = new Date(date);
  end.setHours(endHour, 0, 0, 0);
  
  let current = new Date(start);
  
  while (current < end) {
    const slotEnd = new Date(current);
    slotEnd.setMinutes(slotEnd.getMinutes() + intervalMinutes);
    
    slots.push({
      start: new Date(current),
      end: slotEnd,
      available: true,
    });
    
    current.setMinutes(current.getMinutes() + intervalMinutes);
  }
  
  return slots;
}