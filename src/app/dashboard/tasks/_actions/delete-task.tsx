import { httpCodes } from "@/lib/configs";
import { Task } from "@/types/models";

export const handleTaskDeletion = async (
  _task: Partial<Task>
): Promise<{ status: number; message: string }> => {
  if (!_task.id && !_task.caseID) {
    console.error(" > FAILED: Missing id or caseID - ", _task);
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
          return { status: 200, message: httpCodes[200] };
        } else {
          console.error(
            `FAILED: failed to delete task: ` + JSON.stringify(res_)
          );
          return {
            status: res_.status,
            message: httpCodes[res_.status] || "Unknown error",
          };
        }
      }
    );
    return res_;
  } catch (error: any) {
    console.error(
      "ERROR: erred Task initialization:",
      error.message || JSON.stringify(error)
    );
    return { status: 500, message: error.message || "Unknown error" };
  }
};
