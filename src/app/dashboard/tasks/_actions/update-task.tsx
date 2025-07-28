export const handleTaskUpdate = async (update: any): Promise<string | null> => {
  console.log("UPDATE: updating task - ", update);
  try {
    // fetch options
    let fetchOptions = {
      method: "PATCH",
      body: JSON.stringify(update),
    };
    // fetch
    const res_ = await fetch("/api/dashboard/task", fetchOptions).then(
      async (res_) => {
        if (res_.ok && res_.status === 200) {
          return await res_.json();
        } else {
          const error = await res_.json();
          console.error(`FAILED: failed to create task: `, error);
          return null;
        }
      }
    );
    return res_;
  } catch (error: any) {
    console.error("ERROR: erred Task update: ", error);
    return null;
  }
};
