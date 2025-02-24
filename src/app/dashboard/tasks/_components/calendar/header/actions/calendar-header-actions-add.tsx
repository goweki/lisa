import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useCalendarContext } from "../../calendar-context";

export default function CalendarHeaderActionsAdd() {
  const { setNewTaskDialogOpen } = useCalendarContext();
  return (
    <Button
      className="flex items-center gap-1"
      onClick={() => setNewTaskDialogOpen(true)}
    >
      <Plus />
      Add Task
    </Button>
  );
}
