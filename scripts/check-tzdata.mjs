#!/usr/bin/env node
/**
 * Report where `@vvo/tzdb`'s packaged data has fallen behind the IANA time zone
 * database this runtime carries.
 *
 * tzdb generates `raw-time-zones.json` at release time, so its offsets,
 * abbreviations and zone groupings freeze until it publishes again. The app
 * reads offsets and abbreviations from `Intl` at runtime (see
 * `src/lib/timezone.ts`) precisely so that drift does not reach the UI, but
 * anything this script flags under "zones missing" or "groups that have split"
 * needs a code change rather than a dependency bump — so run it when a region
 * changes its clocks.
 */
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const rawTimeZones = require('@vvo/tzdb/raw-time-zones.json');
const timeZoneNames = require('@vvo/tzdb/time-zones-names.json');
const { version: tzdbVersion } = require('@vvo/tzdb/package.json');

const SAMPLED_MONTHS = 12;

function createReader(zoneName) {
  try {
    const offsets = new Intl.DateTimeFormat('en-US', {
      timeZone: zoneName,
      timeZoneName: 'longOffset',
    });
    const abbreviations = new Intl.DateTimeFormat('en-US', {
      timeZone: zoneName,
      timeZoneName: 'short',
    });
    return { offsets, abbreviations };
  } catch {
    return null;
  }
}

function read(formatter, date) {
  return (
    formatter.formatToParts(date).find((part) => part.type === 'timeZoneName')
      ?.value ?? ''
  );
}

function toMinutes(value) {
  if (value === 'GMT') return 0;
  const match = /^GMT([+-])(\d{1,2}):(\d{2})$/.exec(value);
  if (!match) return null;
  const total = Number(match[2]) * 60 + Number(match[3]);
  return match[1] === '-' ? -total : total;
}

function sample(reader, from) {
  const offsets = [];
  for (let month = 0; month < SAMPLED_MONTHS; month += 1) {
    const date = new Date(from.getTime());
    date.setUTCDate(15);
    date.setUTCMonth(date.getUTCMonth() + month);
    offsets.push(toMinutes(read(reader.offsets, date)));
  }
  return offsets;
}

const now = new Date();
const staleOffsets = [];
const splitGroups = [];
const unknownToRuntime = [];

for (const zone of rawTimeZones) {
  const reader = createReader(zone.name);
  if (!reader) {
    unknownToRuntime.push(zone.name);
    continue;
  }

  const offsets = sample(reader, now);
  // Daylight saving always moves a clock forward, so the standard offset is the
  // smallest one the zone takes over the year.
  const standardOffset = Math.min(...offsets);
  if (standardOffset !== zone.rawOffsetInMinutes) {
    staleOffsets.push({
      name: zone.name,
      packaged: zone.rawOffsetInMinutes,
      runtime: standardOffset,
      abbreviation: zone.abbreviation,
      observesDst: new Set(offsets).size > 1,
    });
  }

  const signature = offsets.join(',');
  for (const member of zone.group) {
    if (member === zone.name) continue;
    const memberReader = createReader(member);
    if (!memberReader) continue;
    const memberSignature = sample(memberReader, now).join(',');
    if (memberSignature !== signature) {
      splitGroups.push({ primary: zone.name, member });
    }
  }
}

const listed = new Set(rawTimeZones.map((zone) => zone.name));
const grouped = new Set(rawTimeZones.flatMap((zone) => zone.group));
const missing = timeZoneNames.filter(
  (name) => !listed.has(name) && !grouped.has(name)
);

const hours = (minutes) =>
  `${minutes < 0 ? '-' : '+'}${String(
    Math.floor(Math.abs(minutes) / 60)
  ).padStart(2, '0')}:${String(Math.abs(minutes) % 60).padStart(2, '0')}`;

console.log(`node                ${process.version}`);
console.log(`runtime tzdata      ${process.versions.tz ?? 'unknown'}`);
console.log(`@vvo/tzdb           ${tzdbVersion}`);
console.log(`zones checked       ${rawTimeZones.length}\n`);

if (staleOffsets.length === 0) {
  console.log('standard offsets    all match the runtime');
} else {
  console.log(
    `standard offsets    ${staleOffsets.length} zone(s) where tzdb disagrees with the runtime`
  );
  console.log(
    '                    (handled at runtime — no code change needed)'
  );
  for (const zone of staleOffsets) {
    console.log(
      `  ${zone.name.padEnd(30)} tzdb ${hours(zone.packaged)} (${
        zone.abbreviation
      }) -> runtime ${hours(zone.runtime)}${zone.observesDst ? '' : ', no DST'}`
    );
  }
}

console.log();
if (splitGroups.length === 0) {
  console.log("group aliases       all still keep their primary zone's time");
} else {
  console.log(
    `group aliases       ${splitGroups.length} have split from their primary — NEEDS A CODE CHANGE`
  );
  console.log(
    '                    these names cannot be picked and resolve to the wrong rules'
  );
  for (const { primary, member } of splitGroups) {
    console.log(`  ${member.padEnd(30)} grouped under ${primary}`);
  }
}

console.log();
if (missing.length === 0) {
  console.log('zones missing       none');
} else {
  console.log(
    `zones missing       ${missing.length} IANA name(s) absent from tzdb entirely`
  );
  for (const name of missing) console.log(`  ${name}`);
}

if (unknownToRuntime.length > 0) {
  console.log(
    `\nunknown to runtime  ${unknownToRuntime.length}: ${unknownToRuntime.join(
      ', '
    )}`
  );
  console.log("                    this runtime's tzdata is older than tzdb's");
}
