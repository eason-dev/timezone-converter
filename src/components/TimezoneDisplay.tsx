'use client';

import { useSortable } from '@dnd-kit/sortable';
import { TimeZone } from '@vvo/tzdb';
import { LocateFixedIcon, MenuIcon, XCircleIcon } from 'lucide-react';
import { DateTime } from 'luxon';
import * as React from 'react';

import { DateTimeDisplay } from '@/components/DateTimeDisplay';
import { Button } from '@/components/ui/button';
import { pad } from '@/lib/string';
import { getZoneLabel } from '@/lib/timezone';
import { cn } from '@/lib/utils';

export function TimezoneDisplay({
  id,
  timezone,
  selectedTime,
  isEditing = false,
  removeSelectedTimezone,
  screenWidth,
  hoveredX,
  setHoveredX,
  hoveredY,
  setHoveredY,
  hoveredTime,
  isCurrentTimezone = false,
}: {
  id: number;
  timezone: TimeZone;
  selectedTime?: Date;
  isEditing?: boolean;
  removeSelectedTimezone: (timezone: TimeZone) => void;
  screenWidth: number;
  hoveredX: number | null;
  setHoveredX: (x: number | null) => void;
  hoveredY: number | null;
  setHoveredY: (y: number | null) => void;
  hoveredTime: DateTime | null;
  isCurrentTimezone?: boolean;
}) {
  const selectedTimeInZone = DateTime.fromJSDate(selectedTime).setZone(
    timezone.name
  );

  // Label the zone as it stands at the time on screen, read from the runtime's
  // IANA data, so the header agrees with the bar across a DST boundary and in
  // regions that have dropped the seasonal change.
  const zoneLabel = getZoneLabel(timezone.name, selectedTime, {
    countryCode: timezone.countryCode,
    fallback: timezone.abbreviation,
  });

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    setActivatorNodeRef,
  } = useSortable({ id: id, disabled: !isEditing });

  const style = {
    transform: `translateY(${transform ? transform.y : 0}px)`,
    transition: transition,
  };

  // Get hovered x coordinate on the bar
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX } = e;
    setHoveredX(clientX);
  };
  const handleMouseLeave = () => {
    setHoveredX(null);
  };
  React.useEffect(() => {
    if (hoveredX !== null && hoveredY !== null) {
      const element = document.elementFromPoint(hoveredX, hoveredY);
      if (element) {
        const elementRect = element.getBoundingClientRect();
        const x = elementRect.x;
        const y = elementRect.y;
        const width = elementRect.width;
        const height = elementRect.height;

        if (x < 0 || x > width || y < 0 || y > height) {
          setHoveredX(null);
          setHoveredY(null);
        }
      }
    }
  }, [hoveredX, setHoveredX, hoveredY, setHoveredY]);

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className="flex flex-col space-y-3 relative">
        <div>
          <div className="relative inline-flex items-center">
            {isEditing && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute -left-10 rounded-full animate-wiggle-more animate-infinite animate-duration-500 animate-ease-in-out"
                ref={setActivatorNodeRef}
                {...listeners}
              >
                <MenuIcon className="h-6 w-6" />
              </Button>
            )}
            <div className="flex items-end space-x-2">
              <div className="flex items-center space-x-2">
                {isCurrentTimezone && <LocateFixedIcon className="h-6 w-6" />}
                <p className="text-xl font-bold">{timezone.name}</p>
              </div>
              <p className="text-md text-[#7C7C7C] dark:text-[#DFDFDF] font-medium">
                {zoneLabel}
              </p>
            </div>
            {isEditing && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute -right-10 rounded-full animate-wiggle-more animate-infinite animate-duration-500 animate-ease-in-out"
                onClick={() => {
                  removeSelectedTimezone(timezone);
                }}
              >
                <XCircleIcon className="h-6 w-6" />
              </Button>
            )}
          </div>
        </div>

        <div className="overflow-x-hidden -mx-12 px-12">
          {/* Bar */}
          <div
            className="relative flex items-center h-[58px] rounded-[15px] w-full overflow-hidden mb-2"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className="flex items-center h-full"
              style={{
                transform: `translateX(calc(50vw - 28px - 48px - ${
                  (selectedTimeInZone.hour + selectedTimeInZone.minute / 60) *
                  56
                }px - (56px * 24)))`,
                background:
                  'linear-gradient(90deg, rgba(31,52,182,1) 0%, rgba(31,52,182,1) 8.333%, rgba(135,208,240,1) 11.111%, rgba(135,208,240,1) 23.611%, rgba(31,52,182,1) 26.388%, rgba(31,52,182,1) 41.666%, rgba(135,208,240,1) 44.444%, rgba(135,208,240,1) 56.944%, rgba(31,52,182,1) 59.722%, rgba(31,52,182,1) 75%, rgba(135,208,240,1) 77.777%, rgba(135,208,240,1) 90.277%, rgba(31,52,182,1) 93.055%, rgba(31,52,182,1) 100%)',
              }}
            >
              {Array.from({ length: 145 }).map((_, i) => (
                <div key={i} className="flex justify-end w-[28px] shrink-0">
                  <div
                    className={cn(
                      'w-[2px] shrink-0 bg-white',
                      i % 2 === 0 ? 'h-[18px]' : 'h-[9px]'
                    )}
                  />
                </div>
              ))}
            </div>

            {/* Current time display line */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 w-0.5 h-full bg-[#1B55EB]" />
            {/* Current time display label */}
            <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-[#F1F5F9]/90 text-sm text-[#1245CA] px-2 py-1 leading-6 rounded-[10px] backdrop-blur-[2px]">
              <DateTimeDisplay
                currentTime={DateTime.fromJSDate(selectedTime)}
                timezoneName={timezone.name}
              />
            </div>

            {hoveredX !== null && screenWidth > 1024 && (
              <>
                {/* Hovered time display line */}
                <div
                  className="absolute left-[-49px] top-0 w-[1px] h-full dashed-border"
                  style={{
                    transform: `translateX(calc(-50% + ${hoveredX}px))`,
                  }}
                />
                {/* Hovered time display label */}
                <div
                  className="absolute left-[-49px] top-1/2 bg-[#F1F5F9]/90 text-sm text-[#1245CA] px-2 py-1 leading-6 rounded-[10px] backdrop-blur-[2px]"
                  style={{
                    transform: `translateX(calc(-50% + ${hoveredX}px)) translateY(-50%)`,
                  }}
                >
                  <DateTimeDisplay
                    currentTime={hoveredTime}
                    timezoneName={timezone.name}
                  />
                </div>
              </>
            )}
          </div>
          {/* ./Bar */}

          {/* Numbers */}
          <div
            className="text-sm flex font-bold leading-4"
            style={{
              transform: `translateX(calc(50vw - 28px - 48px - ${
                (selectedTimeInZone.hour + selectedTimeInZone.minute / 60) * 56
              }px - (56px * 24)))`,
            }}
          >
            {Array.from({ length: 73 }).map((_, i) => {
              const distanceFromScreenCenterInPixels = Math.floor(
                Math.abs(
                  73 -
                    24 -
                    24 -
                    1 -
                    i +
                    selectedTimeInZone.hour +
                    selectedTimeInZone.minute / 60
                ) * 56
              );
              const distanceFromEdgeInPixels =
                screenWidth / 2 - 48 - distanceFromScreenCenterInPixels;
              const isEdge =
                distanceFromEdgeInPixels > 0 && distanceFromEdgeInPixels < 56;
              const isOutsideScreen = distanceFromEdgeInPixels < 0;

              return (
                <div
                  className="w-[56px] shrink-0 text-center flex flex-col items-center"
                  key={i}
                >
                  <p>{isOutsideScreen ? '' : pad(i % 24)}</p>
                  <p className="text-[#7C7C7C] dark:text-[#DFDFDF] text-xs">
                    {!isOutsideScreen && (isEdge || i % 24 === 0)
                      ? selectedTimeInZone
                          .minus({
                            days:
                              (73 - 24 - 24 - 1 - i + selectedTimeInZone.hour) /
                              24,
                          })
                          .toFormat('M/d')
                      : ''}
                  </p>
                </div>
              );
            })}
          </div>
          {/* ./Numbers */}
        </div>
      </div>
    </div>
  );
}
