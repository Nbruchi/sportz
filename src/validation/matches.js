import { z } from 'zod';

/** Valid ISO 8601 date/datetime string (parsable by Date). */
function isValidISODateString(value) {
  const parsed = Date.parse(value);
  return Number.isFinite(parsed);
}

const isoDateStringSchema = z
  .string()
  .refine(isValidISODateString, { message: 'Must be a valid ISO date string' });

/** Optional limit: coerced positive integer, max 100. */
export const listMatchesQuerySchema = z.object({
  limit: z.coerce
    .number()
    .int()
    .positive({ message: 'limit must be a positive integer' })
    .max(100, { message: 'limit must be at most 100' })
    .optional(),
});

/** Match status constants (values lowercase). */
export const MATCH_STATUS = Object.freeze({
  SCHEDULED: 'scheduled',
  LIVE: 'live',
  FINISHED: 'finished',
});

/** Required id: coerced positive integer (e.g. route param). */
export const matchIdParamSchema = z.object({
  id: z.coerce
    .number()
    .int()
    .positive({ message: 'id must be a positive integer' }),
});

/** Create match body: sport, teams, times (ISO), optional scores. */
export const createMatchSchema = z
  .object({
    sport: z.string().min(1, { message: 'sport must be non-empty' }),
    homeTeam: z.string().min(1, { message: 'homeTeam must be non-empty' }),
    awayTeam: z.string().min(1, { message: 'awayTeam must be non-empty' }),
    startTime: isoDateStringSchema,
    endTime: isoDateStringSchema,
    homeScore: z.coerce
      .number()
      .int()
      .min(0, { message: 'homeScore must be non-negative' })
      .optional(),
    awayScore: z.coerce
      .number()
      .int()
      .min(0, { message: 'awayScore must be non-negative' })
      .optional(),
  })
  .superRefine((data, ctx) => {
    const start = data.startTime ? new Date(data.startTime).getTime() : NaN;
    const end = data.endTime ? new Date(data.endTime).getTime() : NaN;
    if (Number.isFinite(start) && Number.isFinite(end) && end <= start) {
      ctx.addIssue({
        message: 'endTime must be chronologically after startTime',
        path: ['endTime'],
      });
    }
  });

/** Update score body: required non-negative integers. */
export const updateScoreSchema = z.object({
  homeScore: z.coerce
    .number()
    .int()
    .min(0, { message: 'homeScore must be non-negative' }),
  awayScore: z.coerce
    .number()
    .int()
    .min(0, { message: 'awayScore must be non-negative' }),
});
