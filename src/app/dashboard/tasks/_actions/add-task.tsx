import { httpCodes } from "@/lib/configs";

export const handleTaskCreation = async ({
  newTask,
  selectedCase,
}: {
  newTask: any;
  selectedCase: any;
}): Promise<{ status: number; message: string }> => {
  console.log("NEW: creating task - ", newTask);

  try {
    // Default reminder value
    const defaultReminder = {
      regime: "hours",
      count: 2,
      channel: "whatsapp",
    };

    // fetch options
    let fetchOptions = {
      method: "POST",
      // headers: {
      //   "Content-Type": "application/json",
      //   'Content-Type': 'application/x-www-form-urlencoded',
      // },
      body: JSON.stringify({
        ...newTask,
        caseID: selectedCase.id,
        reminders: [defaultReminder],
      }),
    };
    // fetch
    const res_ = await fetch("/api/dashboard/task", fetchOptions).then(
      async (res_) => {
        if (res_.ok) {
          return { status: 201, message: httpCodes[201] };
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
      "ERROR: erred Task initialization:",
      error.message || JSON.stringify(error)
    );
    return { status: 500, message: error.message || "Unknown error" };
  }
};
