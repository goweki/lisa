// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// export function Modal({
//   Title: title = "Title",
//   Description = "Description",
//   Selected: selected,
//   Case: theCase,
// }: {
//   Case: { [key: string]: any };
//   Title?: string;
//   Description?: string;
//   Selected?: { [key: string]: any };
// }) {
//   if (theCase)
//     return (
//       <Dialog>
//         <DialogTrigger asChild>
//           <Button variant="outline">
//             {!selected?.id ? "New Task" : "Edit Task"}
//           </Button>
//         </DialogTrigger>
//         <DialogContent className="sm:max-w-[425px]">
//           <DialogHeader>
//             <DialogTitle>{`${
//               !selected ? "New" : "Edit"
//             } ${title}`}</DialogTitle>
//             <DialogDescription>
//               {theCase.id ? (
//                 <>
//                   {" "}
//                   Create a new task for
//                   <span className="italic"> {theCase.name}. </span>
//                   Click save when you&apos;re done.
//                 </>
//               ) : (
//                 <>
//                   {" "}
//                   Edit a new task in
//                   <span className="italic"> {theCase.name}. </span>
//                   Click save when you&apos;re done.
//                 </>
//               )}
//             </DialogDescription>
//           </DialogHeader>
//           <div className="grid gap-4 py-4">
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="name" className="text-right">
//                 Name
//               </Label>
//               <Input
//                 id="name"
//                 defaultValue="Pedro Duarte"
//                 className="col-span-3"
//               />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="type" className="text-right">
//                 Type
//               </Label>
//               <Input
//                 id="type"
//                 defaultValue="@peduarte"
//                 className="col-span-3"
//               />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="dueDate" className="text-right">
//                 Due date
//               </Label>
//               <Input
//                 id="dueDate"
//                 defaultValue="@peduarte"
//                 className="col-span-3"
//               />
//             </div>
//           </div>
//           <DialogFooter>
//             <Button type="submit">Save changes</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     );
// }

import { useState } from "react";
import { Task as TaskType } from "@/lib/prisma/types";
import {
  Reminder as ReminderType,
  taskType as taskTypeOptions,
} from "@prisma/client";
import { Modal } from "@/components/mols/modal";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";

// schema for a single Reminder object
const reminderSchema = z.object({
  regime: z.string(), // regime should be a string
  count: z.number().int(), // count should be an integer
  channel: z.string(), // channel should be a string
});

// schema for new task object
const newTaskFormSchema = z.object({
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
  dueDate: z.date({
    required_error: "Your task requires a due date",
  }),
  description: z.string().optional(),
  reminders: z.array(reminderSchema),
});

// TypeScript type inference
type FormDataNew = z.infer<typeof newTaskFormSchema>;
// default form values.
const defaultValues: Partial<FormDataNew> = {
  name: "",
  reminders: [{ regime: "hours", count: 2, channel: "sms" }],
};

// Modal
export function TaskModal({
  selectedCase,
  selectedTask,
}: {
  selectedCase: { [key: string]: any };
  selectedTask?: { [key: string]: any };
}) {
  // state hooks
  const [taskEdits, setTaskEdits] = useState<Partial<TaskType>>();

  // Define the form.

  const formNew = useForm<FormDataNew>({
    resolver: zodResolver(newTaskFormSchema),
    defaultValues,
    // mode: "onChange",
  });

  const formEdit = useForm<FormDataNew>({
    resolver: zodResolver(newTaskFormSchema),
    defaultValues,
    // mode: "onChange",
  });

  // Initialize useFieldArray hook

  // const { fields, append, remove }
  const remindersNewForm = useFieldArray({
    name: "reminders",
    control: formNew.control,
  });

  // Handle form submission

  const onSubmitNew = (data: FormDataNew) => {
    console.log("submit: ", data);
  };

  const onSubmitEdit = (data: FormDataNew) => {
    console.log("submit: ", data);
  };

  //render
  return (
    <Modal
      title={selectedTask ? "Edit Task" : "New Task"}
      trigger="New Task"
      // actionButton={{
      //   label: selectedTask ? "Update Task" : "Create Task",
      //   disabled: false,
      // }}
      Description={
        !selectedTask?.id ? (
          <>
            {" "}
            Create a new task for
            <span className="italic"> {selectedCase.name}. </span>
            Click save when you&apos;re done.
          </>
        ) : (
          <>
            {" "}
            Edit a new task in
            <span className="italic"> {selectedCase.name}. </span>
            Click save when you&apos;re done.
          </>
        )
      }
    >
      {!selectedTask ? (
        <Form {...formNew}>
          <form
            onSubmit={formNew.handleSubmit(onSubmitNew)}
            className="space-y-4"
          >
            <FormField
              control={formNew.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Task Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={formNew.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type *</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      // {...field}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a task type..." />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(taskTypeOptions).map((val) => (
                          <SelectItem key={val} value={val}>
                            {val}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={formNew.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>due Date</FormLabel>
                  <Popover>
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
                  </Popover>
                  <FormDescription className="italic">
                    Date must be within 6 months
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={formNew.control}
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

            <div className="pt-4 flex flex-col sm:flex-row sm:justify-end md:px-4">
              <Button type="submit" disabled={false}>
                {selectedTask ? "Update Task" : "Create Task"}
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        "Old"
      )}
    </Modal>
  );
}
