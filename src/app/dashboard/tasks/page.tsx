"use client";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  emailValidator,
  nameValidator,
  telValidator,
} from "@/helpers/inputValidators";
import { useCallback, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { DataContext } from "../providers";
import { httpCodes } from "@/lib/configs";
import MultiSelect, {
  Option as MultiSelectOption,
} from "@/components/atoms/multiSelect";
import { TemplateObj } from "@/lib/types";
import {
  Institution as InstitutionType,
  Task as TaskType,
} from "@/lib/prisma/types";
import { taskType as taskTypeOptions } from "@prisma/client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type TaskFormValues = z.infer<typeof taskFormSchema>;

const taskFormSchema = z.object({
  taskName: z
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
  taskType: z.string({ required_error: "Please provide a task type" }),
  dueDate: z.date(),
  taskDescription: z.string({
    required_error: "Description is required",
  }),
});

const defaultValues: Partial<TaskFormValues> = {
  taskName: "",
  // taskType: undefined,
  dueDate: new Date(),
  taskDescription: "",
};

export default function InputForm() {
  const form = useForm<z.infer<typeof taskFormSchema>>({
    resolver: zodResolver(taskFormSchema),
    defaultValues,
  });
  const router = useRouter();
  const [options, setOptions] = useState<{
    taskTypes: string[];
  }>({
    taskTypes: [],
  });
  const {
    data: { institutions, users, cases, caseTypes },
    refreshData,
  } = useContext(DataContext);

  const [UIstate, setUIstate] = useState("");
  // const [newTask, setNewTask] = useState<Partial<TaskType>>({});

  // update taskTypes options
  useEffect(() => {
    setOptions((prev) => ({
      ...prev,
      taskTypes: Object.values(taskTypeOptions),
    }));
  }, []);

  async function onSubmit(data: z.infer<typeof taskFormSchema>) {
    console.log("form data: ", data);

    // try {
    //   // fetch options
    //   let fetchOptions = {
    //     method: "POST",
    //     // headers: {
    //     //   "Content-Type": "application/json",
    //     //   'Content-Type': 'application/x-www-form-urlencoded',
    //     // },
    //     body: JSON.stringify(data),
    //   };

    //   // POST request using fetch
    //   const _res = await fetch("/api/dashboard/task", fetchOptions).then(
    //     async (res_) => {
    //       if (res_.ok) {
    //         return await res_.json();
    //       } else {
    //         console.log(`ERROR: ` + JSON.stringify(res_));
    //         setUIstate(httpCodes[res_.status]);
    //       }
    //     }
    //   );
    //   if (_res?.success) {
    //     console.log(
    //       "SUCCESS: task initialized successfully\n > " +
    //         JSON.stringify(_res.success) +
    //         "\n.............."
    //     );
    //     toast.success("Task initialized successfully!");
    //     await refreshData();
    //     router.replace(`/dashboard/tasks/${_res.success.id}`);
    //   } else {
    //     console.error(
    //       "ERROR: failed to initialize case at /dashboard/tasks /page\n > " +
    //         JSON.stringify(_res) +
    //         "\n.............."
    //     );
    //     setUIstate(_res?.error ?? "No Response, check internet connection");
    //   }
    // } catch (error) {
    //   if (error instanceof Error) {
    //     // console.error("Case initialization failed:", error.message);
    //   } else {
    //     console.error("Case initialization failed:", error);
    //   }
    //   // setUIstate("Error: Institution was not initialized");
    //   toast.error("Case NOT initialized");
    // }
  }

  return (
    <Card x-chunk="dashboard-04-chunk-1">
      <CardHeader>
        <CardTitle className="font-light opacity-75">Create New Task</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="taskName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="opacity-75">
                    Task Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl className="!mt-0">
                    <Input placeholder="full names" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="taskType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="opacity-75">
                    Task Type <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className="!mt-1">
                      <SelectTrigger>
                        <SelectValue placeholder="Select a task type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-popover text-foreground">
                      {options.taskTypes.map((type, index) => (
                        <SelectItem key={index} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="opacity-75 h-[17.5px] flex w-full items-end">
                    Due date<span className="text-destructive ml-1"> *</span>
                  </FormLabel>
                  <FormControl className="!mt-1">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[280px] justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(val) => field.onChange(val)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>

                    {/*  */}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="taskDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="opacity-75">
                    Description
                    <span className="text-destructive ml-1">*</span>
                  </FormLabel>
                  <FormControl className="!mt-1">
                    <Textarea
                      placeholder="Task Description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="px-6 py-4">
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
