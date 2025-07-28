'use client'

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
import { Task, TaskType as taskTypeOptions } from "@prisma/client";
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
import { handleTaskCreation } from "@/app/dashboard/tasks/_actions/create-task";
import { handleTaskDeletion } from "@/app/dashboard/tasks/_actions/delete-task";
import { handleTaskUpdate } from "@/app/dashboard/tasks/_actions/update-task";
import { useRouter } from "next/navigation";

interface TaskModalProps {
  isOpen?: boolean;
  toggleOpen?: (open: boolean) => void;
  _task?: Partial<Task>;
}

const taskInputSchema = z.object({
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
  type: z.nativeEnum(taskTypeOptions, {
    required_error: "Please provide a task type",
  }),
  caseId: z.string({
    required_error: "Please provide a caseId",
  }),
  dueDate: z.date({
    required_error: "Your task requires a due date",
  }),
  description: z.string().optional(),
});

export default function TaskModal(params: TaskModalProps) {
  const {
    isOpen,
    toggleOpen,
    _task,
  } = params;
  const [isUpdated, setIsUpdated] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof taskInputSchema>>({
    resolver: zodResolver(taskInputSchema),
    defaultValues: {
      name: _task?.name,
      caseId: _task?.caseId,
      type: _task?.type,
      dueDate: _task?.dueDate,
      description: _task?.description || "",
    },
    // mode: "onChange",
  });

  // isFormUpdated on form change
  useEffect(() => {
    const subscription = form.watch((values) => {
      if (!values.name || !values.type || !values.dueDate) {
        setIsUpdated(false);
        return;
      }

      const hasChanged = values.name !== _task?.name ||
        values.type !== _task?.type || values.type !== _task?.type || values.dueDate !== _task?.dueDate

      setIsUpdated(hasChanged);

    });

    return () => subscription.unsubscribe(); // cleanup
  }, [form, _task]);

  // 
  useEffect(() => {
    if (_task) {
      const resetData = {
        name: _task.name || '',
        type: _task.type || undefined,
        caseId: _task.caseId,
        dueDate: _task.dueDate || new Date(),
        description: _task.description || ''
      }
      form.reset(resetData);
    }
  }, [_task]);

  async function onSubmit(values: z.infer<typeof taskInputSchema>) {

    console.log("Form data: ", values);
    let APIresponse: string | null = null

    if (_task?.id) {
      const updates = {
        name: values.name !== _task.name ? values.name : undefined,
        type: values.type !== _task.name ? values.type : undefined,
        dueDate: values.dueDate !== _task.dueDate ? values.dueDate : undefined,
      }

      APIresponse = await handleTaskUpdate({ id: _task.id, ...updates })
      console.log('RESPONSE - ', APIresponse)

    } else {
      APIresponse = await handleTaskCreation(values)
      if (!!APIresponse) {
        console.error('API response  - ', APIresponse,)
        toast.success('Task created')
        router.refresh()
      } else {
        toast.error('Task Not created')
      }

    }

    if (toggleOpen) {
      toggleOpen(false);
    }
  }

  async function handleDelete() {
    if (!_task?.id) return;

    const res_ = await handleTaskDeletion(_task);
    if (!!res_) {
      toast.success(res_);
      if (toggleOpen) toggleOpen(false);
    } else {

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
            {_task?.id ? "Edit Task" : "Create Task"}
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
              {_task?.id && (
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
              <Button type="submit" disabled={!form.formState.isValid}>
                {_task?.id ? "Edit Task" : "Create Task"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
