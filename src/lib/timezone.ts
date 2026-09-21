import { getTimeZones, TimeZone } from '@vvo/tzdb';

import { pad } from '@/lib/string';

export function utcOffsetToDisplay(utcOffset: number) {
  const hours = Math.floor(Math.abs(utcOffset) / 60);
  const minutes = Math.abs(utcOffset) % 60;

  const sign = utcOffset < 0 ? '-' : '+';

  return `${sign}${hours}${minutes > 0 ? ':' + pad(minutes) : ''}`;
}

export type TimeZoneWithId = TimeZone & { id: number };

/*
 * Offsets and abbreviations below are read from the runtime's own IANA data
 * rather than from the values `@vvo/tzdb` bakes into its shipped JSON. tzdb
 * generates that JSON at release time, so its offsets and abbreviations go stale
 * whenever a region changes its rules; resolving at runtime means a browser with
 * current tzdata shows the current rules without waiting on a dependency
 * release. `pnpm check:tzdata` reports where the packaged data has fallen behind.
 */

function createZoneFormatter(
  zoneName: string,
  timeZoneName: 'short' | 'longOffset',
  locale = 'en-US'
) {
  try {
    return new Intl.DateTimeFormat(locale, {
      timeZone: zoneName,
      timeZoneName,
    });
  } catch {
    // An IANA name this runtime does not know about.
    return null;
  }
}

function readZoneName(formatter: Intl.DateTimeFormat, date: Date) {
  return (
    formatter.formatToParts(date).find((part) => part.type === 'timeZoneName')
      ?.value ?? ''
  );
}

function parseGmtOffset(value: string): number | null {
  if (value === 'GMT') {
    return 0;
  }

  const match = /^GMT([+-])(\d{1,2}):(\d{2})$/.exec(value);
  if (!match) {
    return null;
  }

  const [, sign, hours, minutes] = match;
  const total = Number(hours) * 60 + Number(minutes);

  return sign === '-' ? -total : total;
}

export function getZoneOffsetInMinutes(
  zoneName: string,
  date: Date = new Date()
): number | null {
  const formatter = createZoneFormatter(zoneName, 'longOffset');

  return formatter ? parseGmtOffset(readZoneName(formatter, date)) : null;
}

// "GMT-7", "UTC+5", "+05" — an offset wearing an abbreviation's clothes.
const OFFSET_LIKE = /^(?:GMT|UTC)?[+-]\d/;

/**
 * Intl only spells out an abbreviation for zones local to the locale asked
 * about: `en-US` gives "PDT" for Vancouver but "GMT+10" for Sydney, while
 * `en-AU` does the reverse. Asking in the zone's own country first and falling
 * back to `en-US` resolves a real abbreviation for 137 of tzdb's 315 zones
 * rather than 73.
 */
function readAbbreviation(zoneName: string, date: Date, countryCode: string) {
  const locales = countryCode ? [`en-${countryCode}`, 'en-US'] : ['en-US'];

  for (const locale of locales) {
    const formatter = createZoneFormatter(zoneName, 'short', locale);
    const abbreviation = formatter ? readZoneName(formatter, date) : '';

    if (abbreviation && !OFFSET_LIKE.test(abbreviation)) {
      return abbreviation;
    }
  }

  return '';
}

/**
 * tzdb's `abbreviation` is the zone's *standard* abbreviation, so it disagrees
 * with the offset shown beside it whenever the zone is on DST — Vancouver read
 * "PST, UTC-7" and Berlin "CET, UTC+2" — and stays wrong in regions that have
 * settled on one offset year round. Prefer what the runtime reports, which
 * follows the season, and keep tzdb's value only where the runtime offers no
 * abbreviation at all.
 */
export function getZoneAbbreviation(
  zoneName: string,
  date: Date = new Date(),
  { countryCode = '', fallback = '' } = {}
) {
  const abbreviation = readAbbreviation(zoneName, date, countryCode);
  if (abbreviation) {
    return abbreviation;
  }

  // Zones Intl only labels "GMT-7" often have a real abbreviation in tzdb ("YT"
  // for Whitehorse), but its value can be a stale offset of its own ("GMT-2"
  // for Nuuk, on -01 since 2023), and labelling one offset with a different one
  // is worse than showing none.
  return OFFSET_LIKE.test(fallback) ? '' : fallback;
}

/**
 * The zone's display label, "PDT, UTC-7", or just "UTC+5" for a zone with no
 * abbreviation of its own.
 */
export function getZoneLabel(
  zoneName: string,
  date: Date = new Date(),
  { countryCode = '', fallback = '' } = {}
) {
  const offset = getZoneOffsetInMinutes(zoneName, date);
  const utc = offset === null ? '' : `UTC${utcOffsetToDisplay(offset)}`;
  const abbreviation = getZoneAbbreviation(zoneName, date, {
    countryCode,
    fallback,
  });

  return [abbreviation, utc].filter(Boolean).join(', ');
}

export function getRuntimeTimeZoneName() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone ?? '';
  } catch {
    return '';
  }
}

/**
 * Every zone the picker can offer. Callers share one list so the `id`s used for
 * ordering and for marking "(Your timezone)" line up.
 */
export function getSelectableTimeZones(): TimeZoneWithId[] {
  return getTimeZones().map((timezone, index) => ({
    ...timezone,
    id: index,
  }));
}

/**
 * Resolve an IANA name against the offered zones.
 *
 * tzdb lists one primary zone per group and folds the group's other names — 344
 * of them — into `group`, so matching on `name` alone leaves anyone whose
 * browser reports an alias (`Asia/Qostanay`, `America/Coyhaique`) with nothing
 * selected. Every alias keeps the same time as its primary, so falling back to
 * the group resolves them without changing any conversion.
 */
export function findTimeZone(
  timezones: TimeZoneWithId[],
  zoneName: string
): TimeZoneWithId | null {
  if (!zoneName) {
    return null;
  }

  return (
    timezones.find((timezone) => timezone.name === zoneName) ??
    timezones.find((timezone) => timezone.group.includes(zoneName)) ??
    null
  );
}
