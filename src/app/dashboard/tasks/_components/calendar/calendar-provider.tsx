import { CalendarContext } from "./calendar-context";
import { CalendarTask, Mode } from "./calendar-types";
import { useState } from "react";
import CalendarTaskDialog from "./dialog/calendar-new-event-dialog";
import CalendarManageEventDialog from "./dialog/calendar-manage-event-dialog";

export default function CalendarProvider({
  events,
  addEvent,
  updateEvent,
  deleteEvent,
  mode,
  setMode,
  date,
  setDate,
  calendarIconIsToday = true,
  children,
}: {
  events: CalendarTask[];
  addEvent: (
    event: Partial<CalendarTask>
  ) => Promise<{ status: number; message: string }>;
  updateEvent: (
    event: Partial<CalendarTask>
  ) => Promise<{ status: number; message: string }>;
  deleteEvent: (
    event: Partial<CalendarTask>
  ) => Promise<{ status: number; message: string }>;
  mode: Mode;
  setMode: (mode: Mode) => void;
  date: Date;
  setDate: (date: Date) => void;
  calendarIconIsToday: boolean;
  children: React.ReactNode;
}) {
  const [newTaskDialogOpen, setNewTaskDialogOpen] = useState(false);
  const [manageTaskDialogOpen, setManageTaskDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<CalendarTask | null>(null);

  return (
    <CalendarContext.Provider
      value={{
        events,
        addEvent,
        updateEvent,
        deleteEvent,
        mode,
        setMode,
        date,
        setDate,
        calendarIconIsToday,
        newTaskDialogOpen,
        setNewTaskDialogOpen,
        manageTaskDialogOpen,
        setManageTaskDialogOpen,
        selectedTask,
        setSelectedTask,
      }}
    >
      <CalendarTaskDialog />
      <CalendarManageEventDialog />
      {children}
    </CalendarContext.Provider>
  );
}
