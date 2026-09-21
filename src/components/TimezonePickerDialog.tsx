'use client';

import * as React from 'react';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  getSelectableTimeZones,
  TimeZoneWithId,
  utcOffsetToDisplay,
} from '@/lib/timezone';

export function TimezonePickerDialog({
  open,
  setOpen,
  selectedTimezones,
  addSelectedTimezone,
  removeSelectedTimezone,
  userTimezone = null,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedTimezones: TimeZoneWithId[];
  addSelectedTimezone: (timezone: TimeZoneWithId) => void;
  removeSelectedTimezone: (timezone: TimeZoneWithId) => void;
  userTimezone: TimeZoneWithId | null;
}) {
  const allTimezones: TimeZoneWithId[] = React.useMemo(
    () => getSelectableTimeZones(),
    []
  );
  const unselectedTimezones = React.useMemo(
    () =>
      allTimezones.filter(
        (timezone) =>
          !selectedTimezones.some(
            (selectedTimezone) => selectedTimezone.name === timezone.name
          )
      ),
    [selectedTimezones, allTimezones]
  );
  const haveSelectedTimezones = selectedTimezones.length > 0;

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search timezone..." />
      <CommandList>
        <CommandEmpty>No timezone found.</CommandEmpty>

        {/* Selected timezones */}
        {haveSelectedTimezones && (
          <>
            <CommandGroup heading="Selected">
              {selectedTimezones.map((timezone) => (
                <CommandItem
                  key={timezone.name}
                  value={timezone.name}
                  onSelect={() => {
                    removeSelectedTimezone(timezone);
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  UTC
                  {utcOffsetToDisplay(timezone.currentTimeOffsetInMinutes)}{' '}
                  {timezone.name}
                  {timezone.id === userTimezone?.id && (
                    <span className="text-[#7C7C7C] dark:text-[#DFDFDF] text-xs ml-1">
                      (Your timezone)
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {/* Other unselected timezones */}
        <CommandGroup heading="All time zones">
          {/* show all timezones, if selected, show check mark, and when click, remove from array, otherwise not show check mark, and when click insert into array */}
          {unselectedTimezones.map((timezone) => {
            const isSelected = selectedTimezones.some(
              (selectedTimezone) => selectedTimezone.name === timezone.name
            );
            return (
              <CommandItem
                key={timezone.name}
                value={timezone.name}
                onSelect={() => {
                  if (isSelected) {
                    removeSelectedTimezone(timezone);
                  } else {
                    addSelectedTimezone(timezone);
                  }
                  setOpen(false);
                }}
                className="cursor-pointer"
              >
                UTC{utcOffsetToDisplay(timezone.currentTimeOffsetInMinutes)}{' '}
                {timezone.name}
                {timezone.id === userTimezone?.id && (
                  <span className="text-[#7C7C7C] dark:text-[#DFDFDF] text-xs ml-1">
                    {' '}
                    (Your timezone)
                  </span>
                )}
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
