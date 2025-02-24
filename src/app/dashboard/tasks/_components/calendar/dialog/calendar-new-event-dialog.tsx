import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { taskType as taskTypeOptions } from "@prisma/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useCalendarContext } from "../calendar-context";
import toast from "react-hot-toast";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useContext, useEffect, useState } from "react";
import { DataContext } from "@/app/dashboard/providers";
import { Case } from "@/lib/prisma/types";
import { ComboboxSearchable } from "@/components/atoms/inputs";
import { httpCodes } from "@/lib/configs";
import { DateTimePicker } from "@/components/ui/datetime-picker";

const taskSchema = z.object({
  caseID: z.string().min(1, {
    message: "Please select a case",
  }),
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
  // type: z.string({ required_error: "Please provide a task type" }),
  type: z.nativeEnum(taskTypeOptions, {
    required_error: "Please provide a task type",
  }),

  dueDate: z.date({
    required_error: "Your task requires a due date",
  }),
  description: z.string().optional(),
  // reminders: z.array(reminderSchema),
});
// z.object({
//     title: z.string().min(1, "Title is required"),
//     start: z.string().datetime(),
//     end: z.string().datetime(),
//     color: z.string(),
//   })
//   .refine(
//     (data) => {
//       const start = new Date(data.start);
//       const end = new Date(data.end);
//       return end >= start;
//     },
//     {
//       message: "End time must be after start time",
//       path: ["end"],
//     }
//   );

export default function CalendarTaskDialog() {
  const {
    newTaskDialogOpen,
    setNewTaskDialogOpen,
    date,
    events,
    addEvent,
    deleteEvent,
  } = useCalendarContext();

  const router = useRouter();

  const {
    data: { users, caseTypes, cases, tasks },
    refreshData,
  } = useContext(DataContext);

  const [casesOptions, setCasesOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [UIstate, setUIstate] = useState<string>("");

  // form
  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      caseID: "",
      name: "",
    },
    // mode: "onChange",
  });

  // cases to select-options
  useEffect(() => {
    if (cases && cases.length > 0) {
      const casesOptions = cases.map((_case: Case) => ({
        label: _case.name,
        value: _case.id,
      }));
      setCasesOptions(casesOptions);
    }
  }, [cases]);

  function handleClose() {
    setNewTaskDialogOpen(false);
    form.reset();
  }

  // submit logic
  async function onSubmit(newTask: z.infer<typeof taskSchema>) {
    setUIstate("loading");

    const { caseID, ...newTask_ } = newTask;

    if (!caseID && !newTask_.name) {
      console.error(" > Missing task attributes - ", newTask);
    }

    const res = await addEvent(newTask);
    if (res.status === 201) {
      toast.success("Task created successfully");
      await refreshData();
      handleClose();
    } else {
      toast.error(httpCodes[res.status] || "Unknown Error");
    }
  }

  return (
    <Dialog open={newTaskDialogOpen} onOpenChange={setNewTaskDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-bold text-primary">
            Create task
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="caseID"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Parent Case</FormLabel>
                  <FormMessage />
                  <ComboboxSearchable
                    label="case"
                    options={casesOptions}
                    value={field.value}
                    setValue={field.onChange}
                  />
                  {/* <FormDescription className="italic">
                   A task must have a parent case
                  </FormDescription> */}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Event title" {...field} />
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
                <FormItem className="flex flex-col">
                  <FormLabel>Due Date</FormLabel>
                  <FormMessage />
                  {/* <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date >
                            new Date(
                              new Date().setMonth(new Date().getMonth() + 7)
                            ) ||
                          date <
                            new Date(
                              new Date().setMonth(new Date().getMonth() - 1)
                            )
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover> */}
                  <DateTimePicker
                    value={field.value}
                    onChange={field.onChange}
                    className="w-[280px]"
                  />
                  {/* <FormDescription className="italic">
                    Date must be within 6 months
                  </FormDescription> */}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="More info about the task"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit">Create task</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
