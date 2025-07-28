import { Task } from "@/types/models";
import toast from "react-hot-toast";

export const handleTaskDeletion = async (
  _task: Partial<Task>
): Promise<string | null> => {
  if (!_task.id && !_task.caseId) {
    console.error(" > FAILED: Missing id or caseId - ", _task);
    toast.error('Task deletion failed. Try again later.')
  }

  try {
    // fetch options
    let fetchOptions = {
      method: "DELETE",
      body: JSON.stringify(_task),
    };
    // fetch
    const res_ = await fetch("/api/dashboard/task", fetchOptions).then(
      async (res_) => {
        if (res_.ok) {
          return await res_.json();
        } else {
          const error_ = `FAILED: failed to delete task: ${await res_.json()} `
          console.error(error_);
          toast.error('Task deletion failed. Try again later.')
          return null
        }
      }
    );
    return res_;
  } catch (error: any) {
    console.error(
      "ERROR: task deletion failed:",
      error
    );
    toast.error('Task deletion failed. Try again later.')
    return null;
  }
};
