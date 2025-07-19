"use client";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Calendar from "./_components/calendar/calendar";
import { CalendarTask, Mode } from "./_components/calendar/calendar-types";
import { useCallback, useContext, useEffect, useState } from "react";
import { DataContext } from "../providers";
import { TaskType as TaskTypeOptions } from "@prisma/client";
import { Task } from "@/types/models";
import { handleTaskCreation } from "./_actions/add-task";
import { handleTaskDeletion } from "./_actions/delete-task";
import { handleTaskUpdate } from "./_actions/update-task";

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

export default function TasksView() {
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
    data: { institutions, users, cases, caseTypes, tasks },
    refreshData,
  } = useContext(DataContext);

  const [mode, setMode] = useState<Mode>("month");
  const [date, setDate] = useState<Date>(new Date());

  // const [newTask, setNewTask] = useState<Partial<TaskType>>({});

  // update taskTypes options
  useEffect(() => {
    setOptions((prev) => ({
      ...prev,
      taskTypes: Object.values(TaskTypeOptions),
    }));
  }, []);

  // func to handle adding a new task
  async function addTask(
    newTask: Partial<Task>
  ): Promise<{ status: number; message: string }> {
    const { caseId, ..._task } = newTask;

    if (!caseId) {
      console.error("Missing caseID - ", newTask);
    }

    const res_ = await handleTaskCreation({
      newTask: _task,
      selectedCase: { id: caseId },
    });

    return res_;
  }

  // func to handle updating a new task
  async function updateTask(
    update: Partial<Task>
  ): Promise<{ status: number; message: string }> {
    const { id, ..._task } = update;

    if (!id) {
      console.error("Missing task-id : ", update);
    }

    const res_ = await handleTaskUpdate(update);

    return res_;
  }

  // func to handle deleting a task
  async function deleteTask(
    _task: Partial<Task>
  ): Promise<{ status: number; message: string }> {
    const { caseId, id } = _task;

    if (!caseId && !id) {
      console.error("Missing caseID || taskID - ", _task);
    }

    const res_ = await handleTaskDeletion({
      id,
      caseId,
    });

    return res_;
  }

  return (
    <Calendar
      events={tasks.map((task) => ({ ...task, reminders: [] }))} //CHECKPOINT
      addEvent={addTask}
      updateEvent={updateTask}
      deleteEvent={deleteTask}
      mode={mode}
      setMode={setMode}
      date={date}
      setDate={setDate}
    />
  );
}
