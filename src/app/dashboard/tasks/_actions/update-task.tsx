import { httpCodes } from "@/lib/configs";

export const handleTaskUpdate = async (
  update: any
): Promise<{ status: number; message: string }> => {
  console.log("UPDATE: updating task - ", update);
  try {
    // fetch options
    let fetchOptions = {
      method: "PATCH",
      // headers: {
      //   "Content-Type": "application/json",
      //   'Content-Type': 'application/x-www-form-urlencoded',
      // },
      body: JSON.stringify(update),
    };
    // fetch
    const res_ = await fetch("/api/dashboard/task", fetchOptions).then(
      async (res_) => {
        if (res_.ok && res_.status === 200) {
          return { status: 200, message: httpCodes[201] };
        } else {
          console.error(
            `FAILED: failed to create task: ` + JSON.stringify(res_)
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
      "ERROR: erred Task update:",
      error.message || JSON.stringify(error)
    );
    return {
      status: error.status || 500,
      message: httpCodes[error.status] || "Unknown error",
    };
  }
};
