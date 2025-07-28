'use client'
import { Task } from "@prisma/client";

export const handleTaskCreation = async (
  newTask: Partial<Task>
): Promise<string | null> => {
  console.log("NEW: creating task - ", newTask);

  try {
    // fetch options
    let fetchOptions = {
      method: "POST",
      body: JSON.stringify(newTask),
    };
    // fetch
    const res_ = await fetch("/api/dashboard/task", fetchOptions).then(
      async (res_) => {
        if (res_.ok) {
          return await res_.json();
        } else {
          console.error(
            `FAILED: failed to create task: ` + JSON.stringify(res_)
          );
          return null
        }
      }
    );
    return res_;
  } catch (error: any) {
    console.error(
      "ERROR: erred during Task initialization:",
      JSON.stringify(error)
    );
    return null
  }
};
