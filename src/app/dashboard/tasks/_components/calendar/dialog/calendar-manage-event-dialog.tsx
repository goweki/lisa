import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useContext, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { TaskType as taskTypeOptions } from "@prisma/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCalendarContext } from "../calendar-context";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import toast from "react-hot-toast";
import { DataContext } from "@/app/dashboard/providers";
import { httpCodes } from "@/lib/configs";

// const formSchema = z.object({
//   name: z.string().min(1, "Task name is required"),
//   dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
//     message: "Invalid start date",
//   }),
// });
const taskSchema = z.object({
  name: z
    .string({
      required_error: "Please provide a task name",
      invalid_type_error: "Name must be a string",
    })
    .min(3, {
      message: "Task name must be at least 3 characters",
    })
    .max(30, {
      message: "Task name MUST NOT be longer than 30 characters",
    }),
  type: z.string({ required_error: "Please provide a task type" }),
  dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid dueDate",
  }),
  description: z.string().optional(),
  // reminders: z.array(reminderSchema),
});

export default function CalendarManageEventDialog() {
  const {
    manageTaskDialogOpen: manageEventDialogOpen,
    setManageTaskDialogOpen,
    selectedTask: selectedEvent,
    setSelectedTask,
    events,
    updateEvent,
    deleteEvent,
  } = useCalendarContext();

  const {
    data: { users, caseTypes, cases, tasks },
    refreshData,
  } = useContext(DataContext);

  // const form = useForm<z.infer<typeof formSchema>>({
  //   resolver: zodResolver(formSchema),
  //   defaultValues: {
  //     name: "",
  //     dueDate: "",
  //   },
  // });
  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      name: "",
    },
    // mode: "onChange",
  });

  useEffect(() => {
    if (selectedEvent) {
      form.reset({
        name: selectedEvent.name,
        dueDate: format(selectedEvent.dueDate, "yyyy-MM-dd'T'HH:mm"),
        type: selectedEvent.type,
      });
    }
  }, [selectedEvent, form]);

  async function onSubmit(values: z.infer<typeof taskSchema>) {
    if (!selectedEvent) return;

    const updatedEvent = {
      ...selectedEvent,
      name: values.name,
      dueDate: new Date(values.dueDate),
    };

    await updateEvent(updatedEvent);

    handleClose();
  }

  async function handleDelete() {
    if (!selectedEvent) return;
    const res_ = await deleteEvent(selectedEvent);
    if (res_.status === 200) {
      toast.success("Task DELETED");
      await refreshData();
      handleClose();
    } else {
      toast.error(httpCodes[res_.status] || "Unknown Error");
    }
    handleClose();
  }

  function handleClose() {
    setManageTaskDialogOpen(false);
    setSelectedTask(null);
    form.reset();
  }

  return (
    <Dialog open={manageEventDialogOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-primary">Edit Task</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Task Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Task title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type *</FormLabel>
                  <FormMessage />
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      // {...field}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a task type..." />
                      </SelectTrigger>
                      <SelectContent className="bg-popover text-popover-foreground">
                        {Object.values(taskTypeOptions).map((val) => (
                          <SelectItem key={val} value={val}>
                            {val}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Due Date</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      value={new Date(field.value)}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="flex justify-between gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" type="button">
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete event</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this event? This action
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button type="submit">Update event</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
