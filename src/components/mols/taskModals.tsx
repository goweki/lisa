// import { useState } from "react";
// import { Task as TaskType } from "@/lib/prisma/types";
// import {
//   Reminder as ReminderType,
//   taskType as taskTypeOptions,
// } from "@prisma/client";
// import { Modal } from "@/components/mols/modal";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useFieldArray, useForm } from "react-hook-form";
// import { z } from "zod";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { cn } from "@/lib/utils";
// import { format } from "date-fns";
// import { CalendarIcon, X } from "lucide-react";
// import { Calendar } from "@/components/ui/calendar";
// import { Textarea } from "@/components/ui/textarea";
// import { httpCodes } from "@/lib/configs";
// import toast from "react-hot-toast";
// import { useRouter } from "next/navigation";

// // schema for a single Reminder object
// const reminderSchema = z.object({
//   regime: z.string(), // regime should be a string
//   count: z.number().int(), // count should be an integer
//   channel: z.string(), // channel should be a string
// });

// // schema for new task object
// const newTaskFormSchema = z.object({
//   name: z
//     .string({
//       required_error: "Please provide a task name",
//       invalid_type_error: "Name must be a string",
//     })
//     .min(3, {
//       message: "Task name must be at least 3 characters",
//     })
//     .max(30, {
//       message: "Task name MUST NOT be longer than 30 characters",
//     }),
//   type: z.string({ required_error: "Please provide a task type" }),
//   dueDate: z.date({
//     required_error: "Your task requires a due date",
//   }),
//   description: z.string().optional(),
//   // reminders: z.array(reminderSchema),
// });

// // TypeScript type inference
// type FormDataNew = z.infer<typeof newTaskFormSchema>;
// // default form values.
// const defaultValues: Partial<FormDataNew> = {
//   name: "",
//   // reminders: [{ regime: "hours", count: 2, channel: "sms" }],
// };

// // Modal
// export function TaskModal({
//   selectedCase,
//   selectedTask,
//   refreshData,
// }: {
//   selectedCase: { [key: string]: any };
//   selectedTask?: { [key: string]: any };
//   refreshData: () => void;
// }) {
//   // state hooks
//   const [taskEdits, setTaskEdits] = useState<Partial<TaskType>>();
//   const [UIstate, setUIstate] = useState<"OK" | "loading" | null>(null);
//   const router = useRouter();
//   // Define the form.

//   const formNew = useForm<FormDataNew>({
//     resolver: zodResolver(newTaskFormSchema),
//     defaultValues,
//     // mode: "onChange",
//   });

//   const formEdit = useForm<FormDataNew>({
//     resolver: zodResolver(newTaskFormSchema),
//     defaultValues,
//     // mode: "onChange",
//   });

//   // Initialize useFieldArray hook
//   // const { fields, append, remove }
//   // const remindersArr = useFieldArray({
//   //   name: "reminders",
//   //   control: formNew.control,
//   // });

//   // Handle form submission

//   const onSubmitNew = async (data: FormDataNew) => {
//     console.log("submit: ", data);

//     setUIstate("loading");

//     try {
//       //json body
//       // Default reminder value
//       const defaultReminder = {
//         regime: "hours",
//         count: 2,
//         channel: "whatsapp",
//       };

//       // fetch options
//       let fetchOptions = {
//         method: "POST",
//         // headers: {
//         //   "Content-Type": "application/json",
//         //   'Content-Type': 'application/x-www-form-urlencoded',
//         // },
//         body: JSON.stringify({
//           ...data,
//           caseID: selectedCase.id,
//           reminders: [defaultReminder],
//         }),
//       };
//       // POST request using fetch
//       const _res = await fetch("/api/dashboard/task", fetchOptions).then(
//         async (res_) => {
//           if (res_.ok) {
//             return await res_.json();
//           } else {
//             console.error(`ERROR: ` + JSON.stringify(res_));
//             toast.error(httpCodes[res_.status]);
//           }
//         }
//       );
//       if (_res?.success) {
//         console.log(
//           "SUCCESS: task initialized successfully\n > " +
//             JSON.stringify(_res.success) +
//             "\n.............."
//         );
//         toast.success("Task initialized successfully!");
//         refreshData();
//         // Reset the form to its default values
//         formNew.reset();
//         router.refresh();
//       } else {
//         console.error(
//           "ERROR: failed to initialize case\n > " +
//             JSON.stringify(_res) +
//             "\n.............."
//         );
//         toast.error(_res?.error ?? "No Response, check internet connection");
//       }
//     } catch (error) {
//       if (error instanceof Error) {
//         console.error("Task initialization failed:", error.message);
//       } else {
//         console.error("Task initialization failed:", error);
//       }
//       // setUIstate("Error: Institution was not initialized");
//       toast.error("Task NOT initialized");
//     }
//   };

//   const onSubmitEdit = (data: FormDataNew) => {
//     console.log("submit: ", data);
//   };

//   //render
//   return (
//     <Modal
//       title={selectedTask ? "Edit Task" : "New Task"}
//       trigger="New Task"
//       // actionButton={{
//       //   label: selectedTask ? "Update Task" : "Create Task",
//       //   disabled: false,
//       // }}
//       Description={
//         !selectedTask?.id ? (
//           <>
//             {" "}
//             Create a new task for
//             <span className="italic"> {selectedCase.name}. </span>
//             Click save when you&apos;re done.
//           </>
//         ) : (
//           <>
//             {" "}
//             Edit a new task in
//             <span className="italic"> {selectedCase.name}. </span>
//             Click save when you&apos;re done.
//           </>
//         )
//       }
//     >
//       {!selectedTask ? (
//         <Form {...formNew}>
//           <form
//             onSubmit={formNew.handleSubmit(onSubmitNew)}
//             className="space-y-4"
//           >
//             <FormField
//               control={formNew.control}
//               name="name"
//               render={({ field }) => (
//                 <FormItem className="space-y-2">
//                   <FormLabel>Name *</FormLabel>
//                   <FormMessage />
//                   <FormControl>
//                     <Input placeholder="Task Name" {...field} />
//                   </FormControl>
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={formNew.control}
//               name="type"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Type *</FormLabel>
//                   <FormMessage />
//                   <FormControl>
//                     <Select
//                       value={field.value}
//                       onValueChange={field.onChange}
//                       // {...field}
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select a task type..." />
//                       </SelectTrigger>
//                       <SelectContent className="bg-popover text-popover-foreground">
//                         {Object.values(taskTypeOptions).map((val) => (
//                           <SelectItem key={val} value={val}>
//                             {val}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </FormControl>
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={formNew.control}
//               name="dueDate"
//               render={({ field }) => (
//                 <FormItem className="flex flex-col">
//                   <FormLabel>due Date</FormLabel>
//                   <FormMessage />
//                   <Popover>
//                     <PopoverTrigger asChild>
//                       <FormControl>
//                         <Button
//                           variant={"outline"}
//                           className={cn(
//                             "w-[240px] pl-3 text-left font-normal",
//                             !field.value && "text-muted-foreground"
//                           )}
//                         >
//                           {field.value ? (
//                             format(field.value, "PPP")
//                           ) : (
//                             <span>Pick a date</span>
//                           )}
//                           <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
//                         </Button>
//                       </FormControl>
//                     </PopoverTrigger>
//                     <PopoverContent className="w-auto p-0" align="start">
//                       <Calendar
//                         mode="single"
//                         selected={field.value}
//                         onSelect={field.onChange}
//                         disabled={(date) =>
//                           date >
//                             new Date(
//                               new Date().setMonth(new Date().getMonth() + 7)
//                             ) ||
//                           date <
//                             new Date(
//                               new Date().setMonth(new Date().getMonth() - 1)
//                             )
//                         }
//                         initialFocus
//                       />
//                     </PopoverContent>
//                   </Popover>
//                   {/* <FormDescription className="italic">
//                     Date must be within 6 months
//                   </FormDescription> */}
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={formNew.control}
//               name="description"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Description</FormLabel>
//                   <FormControl>
//                     <Textarea
//                       placeholder="More info about the task"
//                       className="resize-none"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* {remindersArr.fields.map((field, index) => (
//               <div
//                 key={field.id}
//                 className="flex flex-row flex-nowrap space-x-0.5"
//               >
//                 <label>
//                   Regime:
//                   <Input
//                     {...formNew.register(`reminders.${index}.regime` as const, {
//                       required: true,
//                     })}
//                     defaultValue={field.regime}
//                   />
//                 </label>
//                 <label>
//                   Count:
//                   <Input
//                     type="number"
//                     {...formNew.register(`reminders.${index}.count` as const, {
//                       required: true,
//                     })}
//                     defaultValue={field.count}
//                   />
//                 </label>
//                 <label>
//                   Channel:
//                   <Input
//                     {...formNew.register(
//                       `reminders.${index}.channel` as const,
//                       { required: true }
//                     )}
//                     defaultValue={field.channel}
//                   />
//                 </label>
//                 <div className="flex pl-2 mt-auto">
//                   <Button
//                     variant="destructive"
//                     onClick={() => remindersArr.remove(index)}
//                   >
//                     <X className="w-4 h-4" />
//                   </Button>
//                 </div>
//               </div>
//             ))}

//             <Button
//               variant="link"
//               onClick={() =>
//                 remindersArr.append({ regime: "", count: 0, channel: "" })
//               }
//             >
//               Add Reminder
//             </Button> */}

//             <div className="pt-4 flex flex-col sm:flex-row sm:justify-end md:px-4">
//               <Button type="submit" disabled={false}>
//                 {selectedTask ? "Update Task" : "Create Task"}
//               </Button>
//             </div>
//           </form>
//         </Form>
//       ) : (
//         "Old"
//       )}
//     </Modal>
//   );
// }

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { useContext, useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
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
import { handleTaskCreation } from "@/app/dashboard/tasks/_actions/add-task";
import { handleTaskDeletion } from "@/app/dashboard/tasks/_actions/delete-task";
import { handleTaskUpdate } from "@/app/dashboard/tasks/_actions/update-task";

interface TaskEditModalProps {
  isOpen?: boolean;
  toggleOpen?: (open: boolean) => void;
  Obj?: Record<string, any>;
  refresh?: () => any;
  createObj?: (obj: Record<string, any>) => Promise<{
    status?: number;
    message?: string;
  }>;
  updateObj?: (obj: Record<string, any>) => Promise<{
    status?: number;
    message?: string;
  }>;
  deleteObj?: (obj: Record<string, any>) => Promise<{
    status?: number;
    message?: string;
  }>;
}

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

export default function TaskEditModal(params: TaskEditModalProps) {
  const {
    isOpen,
    toggleOpen,
    Obj,
    refresh: clearObj,
    createObj,
    updateObj,
    deleteObj,
  } = params;
  const [formEdit, setFormEdit] = useState<Record<string, boolean>>({});
  const [updated, setUpdated] = useState<boolean>(false);

  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      caseID: Obj?.caseID || "",
      name: "",
      type: Obj?.type || "",
      dueDate: Obj?.dueDate || "",
      description: Obj?.description || "",
    },
    // mode: "onChange",
  });

  const { watch } = form;

  // Watch form changes and update `formEdit`
  useEffect(() => {
    watch((data, { name }) => {
      if (!name) return;

      const currentValue = data[name];
      const previousValue = Obj?.[name] || "";

      setFormEdit((prev) => {
        const newEdits_ = {
          ...prev,
          [name]: currentValue !== previousValue,
        };

        const hasEdits = Object.values(newEdits_).some((value) => value);

        if (hasEdits) {
          setUpdated(true);
        } else {
          setUpdated(false);
        }

        return newEdits_;
      });
    });
  }, [watch, Obj]);

  // is form updated on formEdit
  useEffect(() => {}, [formEdit]);

  // Load Obj into form and reset `formEdit`
  useEffect(() => {
    if (Obj) {
      form.reset({ ...Obj });
      setFormEdit({});
    }
  }, [Obj, form]);

  async function onSubmit(values: z.infer<typeof taskSchema>) {
    const actionFunc = Obj?.id ? updateObj : createObj;

    if (!Obj || !actionFunc) {
      console.error("ERROR: no action function or obj !!! RETURNED.");
      return;
    }

    // Filter only changed values
    const changedValues = Object.keys(formEdit)
      .filter((key) => formEdit[key]) // Get only edited fields
      .reduce(
        (acc, key) => {
          const typedKey = key as keyof typeof values;

          // Handle dueDate separately since it's a Date
          if (typedKey === "dueDate") {
            acc[typedKey] =
              typeof values[typedKey] === "string"
                ? new Date(values[typedKey])
                : values[typedKey] || undefined;
          } else {
            acc[typedKey] = values[typedKey] as any; // Explicitly cast for TS
          }

          return acc;
        },
        {} as Partial<z.infer<typeof taskSchema>>
      );

    // If nothing changed, don't update
    if (Object.keys(changedValues).length === 0) {
      console.log("No Updates");
      return;
    }
    // Update only changed fields
    const updatedEvent = { ...Obj, ...changedValues };
    const res = await actionFunc(updatedEvent);
    if (res.status !== 200 && res.status !== 201) {
      toast.error(res.message || "Unknown error");
      return;
    }
    if (clearObj) clearObj();
    form.reset({});
    setFormEdit({});
    toast.success("Task Updated successfully");
    if (toggleOpen) {
      toggleOpen(false);
    }
  }

  async function handleDelete() {
    if (!Obj || !deleteObj) return;

    const res_ = await deleteObj(Obj);
    if (res_.status === 200) {
      toast.success("successfully DELETED");
      if (toggleOpen) toggleOpen(false);
    } else {
      toast.error(
        res_.status && httpCodes[res_.status]
          ? httpCodes[res_.status]
          : "Unknown Error"
      );
    }
    if (toggleOpen) toggleOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={toggleOpen}>
      {!toggleOpen && (
        <DialogTrigger asChild>
          <Button variant="outline">New Task</Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-primary">
            {Obj?.id ? "Edit Task" : "Create Task"}
          </DialogTitle>
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
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="flex justify-between gap-2">
              {Obj?.id && (
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
              )}
              <DialogClose asChild>
                <Button type="submit" disabled={!form.formState.isValid}>
                  {" "}
                  {Obj?.id ? "Edit Task" : "Create Task"}
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
