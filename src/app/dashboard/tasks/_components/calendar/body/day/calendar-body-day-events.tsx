import { useCalendarContext } from "../../calendar-context";
import { isSameDay } from "date-fns";

export default function CalendarBodyDayEvents() {
  const { events, date, setManageTaskDialogOpen, setSelectedTask } =
    useCalendarContext();
  const dayEvents = events.filter((event) => isSameDay(event.dueDate, date));

  return !!dayEvents.length ? (
    <div className="flex flex-col gap-2">
      <p className="font-medium p-2 pb-0 font-heading">Tasks</p>
      <div className="flex flex-col gap-2">
        {dayEvents.map((event) => (
          <div
            key={event.id}
            className="flex items-center gap-2 px-2 cursor-pointer"
            onClick={() => {
              setSelectedTask(event);
              setManageTaskDialogOpen(true);
            }}
          >
            <div className="flex items-center gap-2">
              <div
                className={`size-2 rounded-full bg-${
                  event.completedByID ? "emerald" : "slate"
                }-500`}
              />
              <p className="text-muted-foreground text-sm font-medium">
                {event.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div className="p-2 text-muted-foreground">No tasks today...</div>
  );
}
