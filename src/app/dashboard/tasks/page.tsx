// "use client";

// import { Loader1 } from "@/components/atoms/loader";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardTitle,
//   CardDescription,
//   CardFooter,
//   CardHeader,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import {
//   emailValidator,
//   nameValidator,
//   telValidator,
// } from "@/helpers/inputValidators";
// import { useCallback, useContext, useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import { DataContext } from "../providers";
// import { httpCodes } from "@/lib/configs";
// import MultiSelect, {
//   Option as MultiSelectOption,
// } from "@/components/atoms/multiSelect";
// import { TemplateObj } from "@/lib/types";
// import {
//   Institution as InstitutionType,
//   Task as TaskType,
// } from "@/lib/prisma/types";
// import { taskType as taskTypeOptions } from "@prisma/client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";

// const taskFormSchema = z.object({
//   taskName: z
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
//   taskType: z.string({ required_error: "Please provide a task type" }),
//   // email: z
//   //   .string({
//   //     required_error: "Please provide an email",
//   //   })
//   //   .email(),
//   dueDate: z.string().date(),
//   taskDescription: z.string({
//     required_error: "Description is required",
//   }),
// });

// type TaskFormValues = z.infer<typeof taskFormSchema>;

// export default function TasksPage() {
//   const {
//     data: { institutions, users, cases, caseTypes },
//     refreshData,
//   } = useContext(DataContext);

//   const router = useRouter();

//   // This can come from your database or API.
//   const defaultValues: Partial<TaskFormValues> = {
//     taskName: "",
//     taskType: "",
//     dueDate: new Date().toISOString(),
//     taskDescription: "",
//   };

//   const form = useForm<TaskFormValues>({
//     resolver: zodResolver(taskFormSchema),
//     defaultValues,
//     // mode: "onChange",
//   });

//   const [UIstate, setUIstate] = useState("");
//   const [newTask, setNewTask] = useState<Partial<TaskType>>({});
//   const [options, setOptions] = useState<{
//     taskTypes: string[];
//   }>({
//     taskTypes: [],
//   });

//   // update taskTypes options
//   useEffect(() => {
//     setOptions((prev) => ({
//       ...prev,
//       taskTypes: Object.values(taskTypeOptions),
//     }));
//   }, []);

//   // submit handler.
//   async function onSubmit(data: TaskFormValues) {
//     // toast(`submitting form data ${JSON.stringify(data, null, 2)}`);
//     console.log("Submitting data: ", data);

//     try {
//       // fetch options
//       let fetchOptions = {
//         method: "POST",
//         // headers: {
//         //   "Content-Type": "application/json",
//         //   'Content-Type': 'application/x-www-form-urlencoded',
//         // },
//         body: JSON.stringify(data),
//       };

//       // POST request using fetch
//       const _res = await fetch("/api/dashboard/task", fetchOptions).then(
//         async (res_) => {
//           if (res_.ok) {
//             return await res_.json();
//           } else {
//             console.log(`ERROR: ` + JSON.stringify(res_));
//             setUIstate(httpCodes[res_.status]);
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
//         await refreshData();
//         router.replace(`/dashboard/tasks/${_res.success.id}`);
//       } else {
//         console.error(
//           "ERROR: failed to initialize case at /dashboard/tasks /page\n > " +
//             JSON.stringify(_res) +
//             "\n.............."
//         );
//         setUIstate(_res?.error ?? "No Response, check internet connection");
//       }
//     } catch (error) {
//       if (error instanceof Error) {
//         // console.error("Case initialization failed:", error.message);
//       } else {
//         console.error("Case initialization failed:", error);
//       }
//       // setUIstate("Error: Institution was not initialized");
//       toast.error("Case NOT initialized");
//     }
//   }

//   return (
//     <Card x-chunk="dashboard-04-chunk-1">
//       <CardHeader>
//         <CardTitle className="font-light">Create New Task</CardTitle>
//         {/* <CardDescription className="text-lg text-muted-foreground font-semibold">
//           Create New Case
//         </CardDescription> */}
//       </CardHeader>
//       <CardContent>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
//             <FormField
//               control={form.control}
//               name="taskName"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Task Name *</FormLabel>
//                   <FormControl className="!mt-0">
//                     <Input placeholder="full names" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="taskType"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>case Type *</FormLabel>
//                   <Select
//                     onValueChange={field.onChange}
//                     defaultValue={field.value}
//                   >
//                     <FormControl className="!mt-1">
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select a task type" />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent className="bg-popover text-foreground">
//                       <SelectItem value="m@example.com">
//                         m@example.com
//                       </SelectItem>
//                       <SelectItem value="m@google.com">m@google.com</SelectItem>
//                       <SelectItem value="m@support.com">
//                         m@support.com
//                       </SelectItem>
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="taskDescription"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Bio</FormLabel>
//                   <FormControl className="!mt-1">
//                     <Textarea
//                       placeholder="Tell us a little bit about yourself"
//                       className="resize-none"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <div className="px-6 py-4">
//               <Button type="submit">Initialize Task</Button>
//             </div>
//           </form>
//         </Form>
//       </CardContent>
//     </Card>
//   );
// }

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import toast from "react-hot-toast";
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
import { Input } from "@/components/ui/input";

const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

export default function InputForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast.success("Submitting data");
    console.log("Submitting data: ", data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
