export interface TimeRange {
  start: string;  // "9:00"
  end: string;    // "17:00"
}

export interface Schedule {
  days: number[] | null;          // [1,2,3,4,5] for Mon-Fri, null = all days
  timeRanges: TimeRange[] | null; // CHANGED: array of time ranges, null = all day
}

export interface ParsedEntry {
  path: string;                  // "example.com"
  schedules: Schedule[] | null;  // CHANGED: array of schedules, null = 24/7 blocking
}

const DAY_NAMES: Record<string, number> = {
  "Sun": 0,
  "Mon": 1,
  "Tue": 2,
  "Wed": 3,
  "Thu": 4,
  "Fri": 5,
  "Sat": 6,
};

/**
 * Validates if a time string is in valid HH:MM format
 */
export const isValidTime = (time: string): boolean => {
  const match = time.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return false;

  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);

  return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
};

/**
 * Parses a time range string like "9:00-17:00"
 * Returns null if invalid format
 */
export const parseTimeRange = (timeStr: string): TimeRange | null => {
  const match = timeStr.match(/^(\d{1,2}:\d{2})-(\d{1,2}:\d{2})$/);
  if (!match) return null;

  const start = match[1];
  const end = match[2];

  if (!isValidTime(start) || !isValidTime(end)) {
    return null;
  }

  return { start, end };
};

/**
 * Parses a day range string like "Mon-Fri" or single day like "Mon"
 * Returns array of day numbers (0=Sunday, 1=Monday, etc.)
 * Returns null if invalid format
 */
export const parseDayRange = (dayStr: string): number[] | null => {
  // Check for single day
  if (DAY_NAMES[dayStr] !== undefined) {
    return [DAY_NAMES[dayStr]];
  }

  // Check for day range
  const match = dayStr.match(/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)-(Mon|Tue|Wed|Thu|Fri|Sat|Sun)$/);
  if (!match) return null;

  const startDay = DAY_NAMES[match[1]];
  const endDay = DAY_NAMES[match[2]];

  // Special case: Sat-Sun (6-0) is valid
  if (startDay === 6 && endDay === 0) {
    return [6, 0];
  }

  // Don't allow other wrapping ranges like "Fri-Mon" or "Sun-Sat"
  if (startDay > endDay) {
    return null;
  }

  // Generate array of days from start to end (inclusive)
  const days: number[] = [];
  for (let i = startDay; i <= endDay; i++) {
    days.push(i);
  }

  return days;
};

/**
 * Parses a site entry with optional time intervals and day ranges.
 * Supports multiple time ranges and multiple schedules with different days.
 *
 * Examples:
 *   - "example.com" → { path: "example.com", schedules: null }
 *   - "example.com 9:00-12:00 14:00-17:00" → Single schedule with multiple time ranges
 *   - "example.com Mon-Fri 9:00-17:00" → Single schedule with days and time
 *   - "example.com Mon-Fri 9:00-12:00 14:00-17:00 Sat 10:00-14:00" → Multiple schedules
 */
export const parseEntry = (entry: string): ParsedEntry => {
  // Strip comments (everything after #)
  const cleanEntry = entry.split("#")[0].trim();

  // Split by whitespace
  const parts = cleanEntry.split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return { path: "", schedules: null };
  }

  // First part is always the path
  const path = parts[0];

  // If only one part, no schedule
  if (parts.length === 1) {
    return { path, schedules: null };
  }

  // State machine for parsing schedules
  const schedules: Schedule[] = [];
  let currentDays: number[] | null = null;
  let currentTimeRanges: TimeRange[] = [];
  let hasScheduleContent = false;  // Track if we've seen any days or times

  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];

    // Try to parse as day range
    const parsedDays = parseDayRange(part);
    if (parsedDays !== null) {
      // Lookahead: check if next token is a time range
      const nextPart = i + 1 < parts.length ? parts[i + 1] : null;
      const nextIsTime = nextPart !== null && parseTimeRange(nextPart) !== null;

      // Save current schedule if:
      // 1. We already have days (second day pattern), OR
      // 2. We have time ranges AND next token is a time (separate schedules)
      if (currentDays !== null || (currentTimeRanges.length > 0 && nextIsTime)) {
        schedules.push({
          days: currentDays,
          timeRanges: currentTimeRanges.length > 0 ? currentTimeRanges : null,
        });
        currentTimeRanges = [];
      }

      // Set days for new schedule
      currentDays = parsedDays;
      hasScheduleContent = true;
      continue;
    }

    // Try to parse as time range
    const parsedTime = parseTimeRange(part);
    if (parsedTime !== null) {
      currentTimeRanges.push(parsedTime);
      hasScheduleContent = true;
      continue;
    }

    // Invalid token, ignore
  }

  // Save final schedule if it has content
  if (currentTimeRanges.length > 0 || (currentDays !== null && hasScheduleContent)) {
    schedules.push({
      days: currentDays,
      timeRanges: currentTimeRanges.length > 0 ? currentTimeRanges : null,
    });
  }

  // Return result
  if (schedules.length === 0) {
    return { path, schedules: null };  // 24/7 blocking
  }

  return { path, schedules };
};
