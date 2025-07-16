import { Task } from "@/types/models";
import { Prisma } from "@prisma/client";

export type CalendarProps = {
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
  calendarIconIsToday?: boolean;
};

export type CalendarContextType = CalendarProps & {
  newTaskDialogOpen: boolean;
  setNewTaskDialogOpen: (open: boolean) => void;
  manageTaskDialogOpen: boolean;
  setManageTaskDialogOpen: (open: boolean) => void;
  selectedTask: CalendarTask | null;
  setSelectedTask: (event: CalendarTask | null) => void;
};

export type CalendarTask = Prisma.TaskGetPayload<{
  include: { reminders: true };
}>;

export const calendarModes = ["day", "week", "month"] as const;
export type Mode = (typeof calendarModes)[number];
