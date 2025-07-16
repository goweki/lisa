import { CalendarTask } from "../_components/calendar/calendar-types";
import { addDays, startOfMonth } from "date-fns";
import { colorOptions } from "../_components/calendar/calendar-tailwind-classes";
import { Reminder, taskType } from "@prisma/client";

const EVENT_TITLES = [
  "Team Standup",
  "Project Review",
  "Client Meeting",
  "Design Workshop",
  "Code Review",
  "Sprint Planning",
  "Product Demo",
  "Architecture Discussion",
  "User Testing",
  "Stakeholder Update",
  "Tech Talk",
  "Deployment Planning",
  "Bug Triage",
  "Feature Planning",
  "Team Training",
];

// Extract color values from colorOptions
const EVENT_COLORS = colorOptions.map((color) => color.value);

function getRandomTime(date: Date): Date {
  const hours = Math.floor(Math.random() * 14) + 8; // 8 AM to 10 PM
  const minutes = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, 45
  return new Date(date.setHours(hours, minutes, 0, 0));
}

function generateEventDuration(): number {
  const durations = [30, 60, 90, 120]; // in minutes
  return durations[Math.floor(Math.random() * durations.length)];
}

export function generateMockEvents(): CalendarTask[] {
  const events: CalendarTask[] = [];
  const startDate = startOfMonth(new Date());

  // Generate 120 events over 3 months
  for (let i = 0; i < 120; i++) {
    // Random date between start and end
    const daysToAdd = Math.floor(Math.random() * 90); // 90 days = ~3 months
    const eventDate = addDays(startDate, daysToAdd);

    const startTime = getRandomTime(eventDate);
    const durationMinutes = generateEventDuration();
    const endTime = new Date(startTime.getTime() + durationMinutes * 60000);

    events.push({
      id: `event-${i + 1}`,
      name: EVENT_TITLES[Math.floor(Math.random() * EVENT_TITLES.length)],
      dueDate: endTime,
      reminders: [],
      type:
        Math.floor(Math.random() * 2) + 1 === 1
          ? taskType.document
          : taskType.event,
      description: null,
      completedByID: null,
      caseID: "",
    });
  }

  // Sort events by due date
  return events.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
}
