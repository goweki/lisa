import { CalendarTask as CalendarEventType } from "./calendar-types";
import { useCalendarContext } from "./calendar-context";
import { format, isSameDay, isSameMonth } from "date-fns";
import { cn } from "@/lib/utils";
import { motion, MotionConfig, AnimatePresence } from "framer-motion";

interface EventPosition {
  left: string;
  width: string;
  top: string;
  height: string;
}

function getOverlappingEvents(
  currentEvent: CalendarEventType,
  events: CalendarEventType[]
): CalendarEventType[] {
  return events.filter((event) => {
    if (event.id === currentEvent.id) return false;
    return (
      currentEvent.dueDate < event.dueDate &&
      // currentEvent.end > event.start &&
      isSameDay(currentEvent.dueDate, event.dueDate)
    );
  });
}

function calculateEventPosition(
  event: CalendarEventType,
  allEvents: CalendarEventType[]
): EventPosition {
  const overlappingEvents = getOverlappingEvents(event, allEvents);
  const group = [event, ...overlappingEvents].sort(
    (a, b) => a.dueDate.getTime() - b.dueDate.getTime()
  );
  const position = group.indexOf(event);
  const width = `${100 / (overlappingEvents.length + 1)}%`;
  const left = `${(position * 100) / (overlappingEvents.length + 1)}%`;

  const startHour =
    typeof event.dueDate === "string"
      ? new Date(event.dueDate).getHours()
      : event.dueDate.getHours();
  const startMinutes =
    typeof event.dueDate === "string"
      ? new Date(event.dueDate).getMinutes()
      : event.dueDate.getMinutes();

  let endHour =
    typeof event.dueDate === "string"
      ? new Date(event.dueDate).getHours()
      : event.dueDate.getHours();
  let endMinutes =
    typeof event.dueDate === "string"
      ? new Date(event.dueDate).getMinutes()
      : event.dueDate.getMinutes();

  if (!isSameDay(event.dueDate, event.dueDate)) {
    endHour = 23;
    endMinutes = 59;
  }

  const topPosition = startHour * 128 + (startMinutes / 60) * 128;
  const duration = endHour * 60 + endMinutes - (startHour * 60 + startMinutes);
  const _height = (duration / 60) * 128;
  const height = _height < 60 ? 60 : _height;

  return {
    left,
    width,
    top: `${topPosition}px`,
    height: `${height}px`,
  };
}

export default function CalendarEvent({
  event,
  month = false,
  className,
}: {
  event: CalendarEventType;
  month?: boolean;
  className?: string;
}) {
  const { events, setSelectedTask, setManageTaskDialogOpen, date } =
    useCalendarContext();
  const style = month ? {} : calculateEventPosition(event, events);

  // Generate a unique key that includes the current month to prevent animation conflicts
  const isEventInCurrentMonth = isSameMonth(event.dueDate, date);
  const animationKey = `${event.id}-${
    isEventInCurrentMonth ? "current" : "adjacent"
  }`;

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence mode="wait">
        <motion.div
          className={cn(
            `px-3 py-1.5 rounded-md truncate cursor-pointer transition-all duration-300 bg-${
              event.completedById ? "emerald" : "slate"
            }-500/10 hover:bg-${
              event.completedById ? "emerald" : "slate"
            }-500/20 border border-${
              event.completedById ? "emerald" : "slate"
            }-500`,
            !month && "absolute",
            className
          )}
          style={style}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedTask(event);
            setManageTaskDialogOpen(true);
          }}
          initial={{
            opacity: 0,
            y: -3,
            scale: 0.98,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            scale: 0.98,
            transition: {
              duration: 0.15,
              ease: "easeOut",
            },
          }}
          transition={{
            duration: 0.2,
            ease: [0.25, 0.1, 0.25, 1],
            opacity: {
              duration: 0.2,
              ease: "linear",
            },
            layout: {
              duration: 0.2,
              ease: "easeOut",
            },
          }}
          layoutId={`event-${animationKey}-${month ? "month" : "day"}`}
        >
          <motion.div
            className={cn(
              `flex flex-col w-full text-${
                event.completedById ? "emerald" : "slate"
              }-500`,
              month && "flex-row items-center justify-between"
            )}
            layout="position"
          >
            <p className={cn("font-bold truncate", month && "text-xs")}>
              {event.name}
            </p>
            <p className={cn("text-sm", month && "text-xs")}>
              <span>{format(event.dueDate, "h:mm a")}</span>
              <span className={cn("mx-1", month && "hidden")}>-</span>
              <span className={cn(month && "hidden")}>
                {format(event.dueDate, "h:mm a")}s
              </span>
            </p>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </MotionConfig>
  );
}
