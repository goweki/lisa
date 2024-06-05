import { ButtonPrimary, ButtonDestructive } from "@/components/atoms/buttons";
import DocView from "@/components/mols/docViewer";
import { InputSelect, InputText, InputDate } from "./inputs";
import Reminders from "./reminders";
import { strPascalcase } from "@/helpers/stringHandlers";
import { dateShort } from "@/helpers/dateHandlers";

export default function TaskView({
  select,
  reminders,
  handleReminderChange,
  addReminder,
  deleteReminder,
  UIstate,
  handleInitializeTask,
  errFields,
  setErrFields,
  setTask,
  handleDeleteTask,
  handleCompleteTask,
}) {
  //render
  return (
    <div className="p-6 bg-gray-50 text-medium text-gray-500 dark:text-gray-400 dark:bg-gray-800 rounded-lg w-full">
      {select.type === "task" && select.item ? (
        <>
          <div className="flex flex-row justify-between">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              {strPascalcase(select.item.name) + " " + select.item.type}{" "}
              <span className="font-light text-gray-500 dark:text-gray-400">
                {/* {select.item.type === "document" ? " Due Date" : " Date"}:{" "} */}
                {"-"}
                {dateShort(new Date(select.item.dueDate))}
              </span>
            </h3>
            <div>
              <ButtonDestructive
                label="delete task"
                onClick={handleDeleteTask}
                loading={UIstate === "loading"}
              />
            </div>
          </div>

          <div>
            {!select.item.complete ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    htmlFor="file_input"
                  >
                    Upload report to complete task
                  </label>
                  <p
                    className="mb-1 text-xs text-gray-500 dark:text-gray-300"
                    id="file_input_help"
                  >
                    pdf,word (2MB max)
                  </p>
                  <input
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                    id="file_input"
                    type="file"
                    accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    placeholder="Select a file"
                    onChange={(e) => {
                      if (
                        e.target.files[0] &&
                        ["pdf", "doc", "docx"].includes(
                          e.target.files[0].name.split(".").pop()
                        ) &&
                        e.target.files[0].size < 2100000
                      )
                        setDocAttachment(e.target.files[0]);
                      else toast.error("File must not exceed 2MB pdf,word");
                    }}
                  />
                </div>
                <div className="mt-auto">
                  <ButtonPrimary
                    label="Complete Task"
                    onClick={handleCompleteTask}
                    // disabled={!docAttachment}
                  />
                </div>
              </div>
            ) : (
              <DocView
                doc={
                  new File(
                    [
                      Uint8Array.from(atob(select.item.task.complete), (c) =>
                        c.charCodeAt(0)
                      ).buffer,
                    ],
                    "task-report.pdf",
                    {
                      type: "application/pdf",
                    }
                  )
                }
              />
            )}
            {select.documents?.length > 0 && (
              <DocView doc={select.documents[0].link} />
            )}
          </div>
        </>
      ) : select.type === "new" && select.item ? (
        <div>
          <InputSelect
            name="taskType"
            optionItems={[
              { value: "document", text: "📝 document" },
              { value: "event", text: "⏲️ event" },
            ]}
            value={select.item.type}
            onChange={(e) => {
              setTask((prev) => ({
                ...prev,
                item: { ...prev.item, type: e.target.value },
              }));
            }}
            defaultOption="type of task"
          />
          <InputText
            label="Task Name*"
            name="taskName"
            placeholder="Task name"
            value={select.item.name}
            setValue={(val) =>
              setTask((prev) => ({
                ...prev,
                item: {
                  ...prev.item,
                  name: val,
                },
              }))
            }
            errFields={errFields}
            setErrFields={setErrFields}
          />
          <InputDate
            label="Date*"
            name="dueDate"
            value={select.item.date}
            setValue={(val) =>
              setTask((prev) => ({
                ...prev,
                item: {
                  ...prev.item,
                  dueDate: val,
                },
              }))
            }
            min={new Date().toISOString().split("T")[0]}
            max={
              new Date(new Date().setFullYear(new Date().getFullYear() + 10))
                .toISOString()
                .split("T")[0]
            }
            errFields={errFields}
            setErrFields={setErrFields}
          />
          <InputText
            label="Task Description*"
            name="task-description"
            placeholder="Task Description"
            value={select.item.description}
            setValue={(val) =>
              setTask((prev) => ({
                ...prev,
                item: {
                  ...prev.item,
                  description: val,
                },
              }))
            }
            errFields={errFields}
            setErrFields={setErrFields}
          />
          <div className="flex flex-col space-y-2">
            <span className="px-2">Reminders</span>
            <Reminders
              reminders={reminders}
              onReminderChange={handleReminderChange}
              onAddReminder={addReminder}
              onDeleteReminder={deleteReminder}
            />
          </div>
          <div className="pt-4">
            <ButtonPrimary
              label="Create Task"
              disabled={
                !select.item.type || !select.item.name || !select.item.dueDate
              }
              loading={UIstate === "loading"}
              onClick={handleInitializeTask}
            />
          </div>
        </div>
      ) : (
        <h3 className="text-lg font-light italic text-gray-500 mb-2">
          Select an item on the left to view details
        </h3>
      )}
    </div>
  );
}
