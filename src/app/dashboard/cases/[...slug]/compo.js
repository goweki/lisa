import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ButtonPrimary, ButtonDestructive } from "@/components/atoms/buttons";
import toast from "react-hot-toast";
import { SVGbuilding, SVGdoc, SVGfilter } from "@/components/atoms/svgs";
import { dateShort, isDatePassed } from "@/helpers/dateHandlers";
import { strPascalcase } from "@/helpers/stringHandlers";
import DocView from "@/components/mols/docViewer";
import {
  emailValidator,
  nameValidator,
  telValidator,
} from "@/helpers/inputValidators";

export function ViewCase({
  selectedCase,
  selectedTaskName,
  template,
  refreshData,
}) {
  const router = useRouter();
  const [UIstate, setUIstate] = useState("OK");
  const [tab, setTab] = useState("profile");
  const [edit, setEdit] = useState("");
  const [select, setSelect] = useState({ menu: "", item: "" });
  const [completeUpload, setCompleteUpload] = useState("");
  const [errFields, setErrFields] = useState(new Set());
  const [filterPhrase, setFilterPhrase] = useState("");
  const [expandedField, setExpanded] = useState("");
  // client State
  const defaultClient = {
    party: selectedCase.clientParty ?? "",
    name: selectedCase.clientName ?? "",
    tel: selectedCase.clientTel ?? "",
    email: selectedCase.clientEmail ?? "",
  };
  const [client, setClient] = useState(defaultClient);
  // otherParty State
  const defaultOtherParty = {
    party:
      [template.primaryParty, template.secondaryParty].find(
        (v) => v !== selectedCase.clientParty
      ) ?? "",
    name: selectedCase.otherPartyName ?? "",
    tel: selectedCase.otherPartyTel ?? "",
    email: selectedCase.otherPartyEmail ?? "",
  };
  const [otherParty, setOtherParty] = useState(defaultOtherParty);
  // states
  const [court, setCourt] = useState(selectedCase.court ?? "");
  const [caseTasks, setCaseTasks] = useState(selectedCase.tasks ?? []);
  const [status, setStatus] = useState(selectedCase.status ?? "");
  const [description, setDescription] = useState(
    selectedCase.description ?? ""
  );

  // load task classes
  useEffect(() => {
    if (filterPhrase === "overdue")
      setCaseTasks(
        selectedCase.tasks?.filter(
          ({ date, task }) => isDatePassed(new Date(date)) && !task.complete
        )
      );
    else if (filterPhrase === "due")
      setCaseTasks(
        selectedCase.tasks?.filter(
          ({ date, task }) => !isDatePassed(new Date(date)) && !task.complete
        )
      );
    else if (filterPhrase === "done")
      setCaseTasks(selectedCase.tasks?.filter(({ task }) => task.complete));
    else setCaseTasks(selectedCase.tasks);
  }, [filterPhrase, selectedCase.tasks]);
  // if selectedTaskId
  useEffect(() => {
    if (selectedTaskName) {
      setTab("tasks");
      const task = selectedCase.tasks.find(
        ({ task }) => task.name === selectedTaskName
      );
      setSelect({ menu: "task", item: task });
    }
  }, [selectedTaskName, selectedCase.tasks]);

  // render
  return (
    <div id="view-case">
      {/* header */}
      <ul className="items-center justify-center flex flex-wrap -mb-px font-medium text-sm text-center">
        <li className="me-2">
          <div
            className={`${
              tab === "profile"
                ? "card m-0 mt-2"
                : "border-transparent from-transparent to-transparent text-gray-500 dark:text-gray-400"
            } min-w-48 rounded-lg m-0 mt-2 cursor-pointer inline-flex border border-transparent items-center justify-center p-4 hover:border-emerald-700 dark:hover:border-emerald-200 group`}
            onClick={() => {
              setTab("profile");
              setEdit("");
              // resetCaseStates();
              resetTaskStates();
            }}
          >
            <svg
              className="w-4 h-4 me-2 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M5 11.424V1a1 1 0 1 0-2 0v10.424a3.228 3.228 0 0 0 0 6.152V19a1 1 0 1 0 2 0v-1.424a3.228 3.228 0 0 0 0-6.152ZM19.25 14.5A3.243 3.243 0 0 0 17 11.424V1a1 1 0 0 0-2 0v10.424a3.227 3.227 0 0 0 0 6.152V19a1 1 0 1 0 2 0v-1.424a3.243 3.243 0 0 0 2.25-3.076Zm-6-9A3.243 3.243 0 0 0 11 2.424V1a1 1 0 0 0-2 0v1.424a3.228 3.228 0 0 0 0 6.152V19a1 1 0 1 0 2 0V8.576A3.243 3.243 0 0 0 13.25 5.5Z" />
            </svg>
            Case Profile
          </div>
        </li>
        <li className="me-2">
          <div
            className={`${
              tab === "tasks"
                ? "card m-0 mt-2"
                : "border-transparent from-transparent to-transparent text-gray-500 dark:text-gray-400"
            } min-w-48 rounded-lg m-0 mt-2 cursor-pointer inline-flex border border-transparent items-center justify-center p-4 hover:border-emerald-700 dark:hover:border-emerald-200 group`}
            onClick={() => {
              setTab("tasks");
              setEdit("");
              resetCaseProfileStates();
              // resetTaskStates();
            }}
          >
            <svg
              className="w-4 h-4 me-2 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 18 20"
            >
              <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
            </svg>
            Tasks
          </div>
        </li>
        {/* <li className="me-2">
          <div
            className={`${
              tab === "tasks"
                ? "card m-0 mt-2"
                : "border-transparent from-transparent to-transparent text-gray-500 dark:text-gray-400"
            } rounded-lg m-0 mt-2 cursor-pointer inline-flex border border-transparent items-center justify-center p-4 hover:border-emerald-700 dark:hover:border-emerald-200 group`}
            onClick={() => {
              setTab("tasks");
            }}
          >
            <svg
              className="w-5 h-5 me-2 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M2.625 6.75a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875 0A.75.75 0 0 1 8.25 6h12a.75.75 0 0 1 0 1.5h-12a.75.75 0 0 1-.75-.75ZM2.625 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0ZM7.5 12a.75.75 0 0 1 .75-.75h12a.75.75 0 0 1 0 1.5h-12A.75.75 0 0 1 7.5 12Zm-4.875 5.25a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875 0a.75.75 0 0 1 .75-.75h12a.75.75 0 0 1 0 1.5h-12a.75.75 0 0 1-.75-.75Z"
                clipule="evenodd"
              />
            </svg>
            Tasks
          </div>
        </li> */}
      </ul>
      {/* content */}
      <form className="card p-6 overflow-x-auto">
        {tab === "profile" ? (
          <>
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center h-5">
                <input
                  id="edit-profile"
                  type="checkbox"
                  // defaultChecked={edit === "profile"}
                  checked={edit === "profile"}
                  onChange={(e) => {
                    if (e.target.checked) setEdit("profile");
                    else {
                      setEdit("");
                      resetCaseProfileStates();
                    }
                  }}
                  className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
                />
              </div>
              <label
                htmlFor="edit-profile"
                className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                edit
              </label>
            </div>
            <div id="client-details" className="mb-4">
              <InputText
                label={`Client (${client.party})`}
                name="client-name"
                placeholder="Client name"
                value={client.name}
                setValue={(val) =>
                  setClient((prev) => ({ ...prev, name: val }))
                }
                errFields={errFields}
                setErrFields={setErrFields}
                readOnly={edit !== "profile"}
              />
              <div id="client-dropdown-button" className="mx-6">
                <button
                  type="button"
                  className="flex items-center justify-between w-full font-medium text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400 gap-3"
                  onClick={() => {
                    setExpanded((prev) =>
                      prev === "client-name" ? "" : "client-name"
                    );
                  }}
                >
                  <span className="text-xs">more fields</span>
                  <svg
                    data-accordion-icon
                    className={`w-3 h-3 shrink-0 ${
                      expandedField !== "client-name" ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5 5 1 1 5"
                    />
                  </svg>
                </button>
              </div>
              <div
                id="client-more-fields"
                className={`${
                  expandedField === "client-name" ? "" : "hidden"
                } mx-6 md:mx-8`}
              >
                <div className="py-5 border-b border-gray-200 dark:border-gray-700">
                  <div className="grid gap-6 md:grid-cols-2">
                    <InputText
                      name="client-tel"
                      placeholder="Telephone number"
                      value={client.tel}
                      setValue={(val) =>
                        setClient((prev) => ({ ...prev, tel: val }))
                      }
                      errFields={errFields}
                      setErrFields={setErrFields}
                      readOnly={edit !== "profile"}
                    />
                    <InputText
                      name="client-email"
                      placeholder="Email address"
                      value={client.email}
                      setValue={(val) =>
                        setClient((prev) => ({ ...prev, email: val }))
                      }
                      errFields={errFields}
                      setErrFields={setErrFields}
                      readOnly={edit !== "profile"}
                    />
                  </div>
                </div>
              </div>
            </div>
            {otherParty.party && (
              <div id="otherParty-details" className="mb-4">
                <InputText
                  label={strPascalcase(otherParty.party)}
                  name="otherParty-name"
                  placeholder={`${otherParty.party} name`}
                  value={otherParty.name}
                  setValue={(val) =>
                    setOtherParty((prev) => ({ ...prev, name: val }))
                  }
                  errFields={errFields}
                  setErrFields={setErrFields}
                  readOnly={edit !== "profile"}
                />
                <div id="otherParty-dropdown-button" className="mx-6">
                  <button
                    type="button"
                    className="flex items-center justify-between w-full font-medium text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400 gap-3"
                    onClick={() => {
                      setExpanded((prev) =>
                        prev === "otherParty-name" ? "" : "otherParty-name"
                      );
                    }}
                  >
                    <span className="text-xs">more fields</span>
                    <svg
                      data-accordion-icon
                      className={`w-3 h-3 shrink-0 ${
                        expandedField !== "otherParty-name" ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 10 6"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5 5 1 1 5"
                      />
                    </svg>
                  </button>
                </div>
                <div
                  id="otherParty-more-fields"
                  className={`${
                    expandedField === "otherParty-name" ? "" : "hidden"
                  } mx-6 md:mx-8`}
                >
                  <div className="py-5 border-b border-gray-200 dark:border-gray-700">
                    <div className="grid gap-6 md:grid-cols-2">
                      <InputText
                        name="otherParty-tel"
                        placeholder="Telephone number"
                        value={otherParty.tel}
                        setValue={(val) =>
                          setOtherParty((prev) => ({ ...prev, tel: val }))
                        }
                        errFields={errFields}
                        setErrFields={setErrFields}
                        readOnly={edit !== "profile"}
                      />
                      <InputText
                        name="otherParty-email"
                        placeholder="Email address"
                        value={otherParty.email}
                        setValue={(val) =>
                          setOtherParty((prev) => ({ ...prev, email: val }))
                        }
                        errFields={errFields}
                        setErrFields={setErrFields}
                        readOnly={edit !== "profile"}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div id="court-name" className="mb-6">
              <InputText
                label="Court"
                name="court"
                placeholder="Court name"
                value={court}
                setValue={(val) => setCourt(val)}
                errFields={errFields}
                setErrFields={setErrFields}
                readOnly={edit !== "profile"}
              />
            </div>
            <div className="flex items-center mb-6 pl-4">
              <div className="flex items-center h-5">
                <input
                  id="case-status"
                  type="checkbox"
                  checked={status === "open"}
                  onChange={(e) => {
                    if (e.target.checked) setStatus("open");
                    else setStatus("closed");
                  }}
                  className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
                  disabled={edit !== "profile"}
                />
              </div>
              <label
                htmlFor="case-status"
                className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Active
              </label>
              <div className="ml-6 mt-4">
                <InputText
                  name="description"
                  placeholder="Status description"
                  value={description}
                  setValue={(val) => setDescription(val)}
                  errFields={errFields}
                  setErrFields={setErrFields}
                  readOnly={edit !== "profile"}
                />
              </div>
            </div>
            {edit === "profile" && (
              <div className="max-w-lg mx-auto">
                <div className="mb-4">
                  <ButtonPrimary
                    label="Submit Case changes"
                    loading={UIstate === "loading"}
                    onClick={handleSubmitCaseChanges}
                  />
                </div>
                <div className="flex justify-center">
                  <ButtonDestructive
                    label="Delete Case"
                    loading={UIstate === "loading"}
                    onClick={handleDeleteCase}
                  />
                </div>
              </div>
            )}
          </>
        ) : tab === "tasks" ? (
          <>
            <div className="max-w-xs mb-4 mr-auto">
              <InputSelect
                name="filterPhrase"
                optionItems={[
                  { value: "overdue", text: "❗ overdue" },
                  { value: "due", text: "✍🏾 due" },
                  { value: "done", text: "✔️ Done" },
                ]}
                value={filterPhrase}
                onChange={(e) => {
                  setFilterPhrase(e.target.value);
                  setSelect({ menu: "", items: "" });
                }}
                icon={SVGfilter}
                defaultOption="filter"
              />
            </div>

            <div className="md:flex">
              <ul className="flex-column space-y space-y-4 text-sm font-medium text-gray-500 dark:text-gray-400 md:me-4 mb-4 md:mb-0">
                <li
                  onClick={() => {
                    setSelect({
                      menu: "new",
                      item: {
                        date: "",
                        type: "",
                        task: { name: "", complete: "" },
                      },
                    });
                    setCompleteUpload("");
                  }}
                >
                  <div
                    className={`${
                      select.menu === "new"
                        ? "text-emerald-700 bg-emerald-100 dark:bg-emerald-700 dark:text-white border-transparent dark:border-transparent"
                        : ""
                    } min-w-[124px] inline-flex items-center px-4 py-3 rounded-lg w-full border border-neutral-400 dark:border-neutral-500 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white hover:border-transparent dark:hover:border-transparent cursor-pointer`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4 me-2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                    New task
                  </div>
                </li>
                {caseTasks?.map((taskItem) => (
                  <li
                    key={taskItem.task.name}
                    onClick={() => {
                      setSelect({ menu: "task", item: taskItem });
                      setCompleteUpload("");
                    }}
                  >
                    <div
                      className={`${
                        select.item?.task?.name === taskItem.task.name
                          ? "text-emerald-700 bg-gray-100 dark:bg-gray-700 dark:text-emerald-200"
                          : ""
                      } min-w-[124px] inline-flex items-center px-4 py-3 rounded-lg  bg-slate-50 w-full dark:bg-gray-800 hover:text-emerald-700 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-emerald-200 cursor-pointer`}
                    >
                      {taskItem.type === "document" ? (
                        <SVGdoc
                          className={`${
                            select.item?.task?.name === taskItem.task.name
                              ? "text-emerald-600"
                              : "text-gray-500 dark:text-gray-400"
                          } w-4 h-4 me-2 `}
                        />
                      ) : (
                        <SVGbuilding
                          className={`${
                            select.item?.task?.name === taskItem.task.name
                              ? "text-emerald-600"
                              : "text-gray-500 dark:text-gray-400"
                          } w-4 h-4 me-2 `}
                        />
                      )}
                      {taskItem.task.name}
                    </div>
                  </li>
                ))}
              </ul>
              {viewArea(select)}
            </div>
          </>
        ) : null}
      </form>
    </div>
  );

  //Details view area
  function viewArea(select) {
    return (
      <div className="p-6 bg-gray-50 text-medium text-gray-500 dark:text-gray-400 dark:bg-gray-800 rounded-lg w-full">
        {select.menu === "task" && select.item ? (
          <>
            <div className="flex flex-row justify-between">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                {strPascalcase(select.item.task.name) + " " + select.item.type}{" "}
                <span className="font-light text-gray-500 dark:text-gray-400">
                  {/* {select.item.type === "document" ? " Due Date" : " Date"}:{" "} */}
                  {"-"}
                  {dateShort(new Date(select.item.date))}
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
              {!select.item.task.complete ? (
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
                          setCompleteUpload(e.target.files[0]);
                        else toast.error("File must not exceed 2MB pdf,word");
                      }}
                    />
                  </div>
                  <div className="mt-auto">
                    <ButtonPrimary
                      label="Complete Task"
                      onClick={handleCompleteTask}
                      disabled={!completeUpload}
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
              {completeUpload && <DocView doc={completeUpload} />}
            </div>
          </>
        ) : select.menu === "new" && select.item ? (
          <div>
            <InputSelect
              name="taskType"
              optionItems={[
                { value: "document", text: "📝 document" },
                { value: "event", text: "⏲️ event" },
              ]}
              value={select.item.type}
              onChange={(e) => {
                setSelect((prev) => ({
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
              value={select.item.task.name}
              setValue={(val) =>
                setSelect((prev) => ({
                  ...prev,
                  item: {
                    ...prev.item,
                    task: { ...prev.item.task, name: val },
                  },
                }))
              }
              errFields={errFields}
              setErrFields={setErrFields}
            />
            <InputDate
              label="Date*"
              name="taskDate"
              value={select.item.date}
              setValue={(val) =>
                setSelect((prev) => ({
                  ...prev,
                  item: {
                    ...prev.item,
                    date: val,
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
            <div className="pt-4">
              <ButtonPrimary
                label="Create Task"
                disabled={
                  !select.item.type ||
                  !select.item.date ||
                  !select.item.task.name
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
  //func to reset case-states
  function resetCaseProfileStates() {
    setClient(defaultClient);
    setOtherParty(defaultOtherParty);
    setCourt(selectedCase.court ?? "");
    setStatus(selectedCase.status ?? "");
  }
  //func to reset task-state
  function resetTaskStates() {
    setFilterPhrase("");
    setSelect({ menu: "", item: "" });
    setCompleteUpload("");
  }
  //func to Update Case
  async function handleSubmitCaseChanges() {
    if (!selectedCase.id) {
      toast.error("Sorry, case could not be found");
      return;
    }
    //validate fields
    const err_clientName = client.name ? nameValidator(client.name) : "";
    const err_clientTel = client.tel ? telValidator(client.tel) : "";
    const err_clientEmail = client.email ? emailValidator(client.email) : "";
    const err_otherPartyName = otherParty.name
      ? nameValidator(otherParty.name)
      : "";
    const err_otherPartyTel = otherParty.tel
      ? telValidator(otherParty.tel)
      : "";
    const err_otherPartyEmail = otherParty.email
      ? emailValidator(otherParty.email)
      : "";
    if (
      err_clientName ||
      err_clientTel ||
      err_clientEmail ||
      err_otherPartyName ||
      err_otherPartyTel ||
      err_otherPartyEmail
    ) {
      if (err_clientName) {
        setErrFields((prev) => new Set([...prev, "client-name"]));
        toast.error("Invalid client name");
      }
      if (err_clientTel) {
        setErrFields((prev) => [...prev, "client-tel"]);
        toast.error("Invalid client Telephone No.");
      }
      if (err_clientEmail) {
        setErrFields((prev) => new Set([...prev, "client-email"]));
        toast.error("Invalid client email");
      }
      if (err_otherPartyName) {
        setErrFields((prev) => new Set([...prev, "otherParty-name"]));
        toast.error("Invalid name for the other party");
      }
      if (err_otherPartyTel) {
        setErrFields((prev) => new Set([...prev, "otherParty-tel"]));
        toast.error("Invalid Telephone No. for the other party");
      }
      if (err_otherPartyEmail) {
        setErrFields((prev) => new Set([...prev, "otherParty-email"]));
        toast.error("Invalid email for the other party");
      }
      return;
    }
    // fetch options
    let fetchOptions = {
      method: "PUT",
      body: JSON.stringify({
        id: selectedCase.id,
        clientName: client.name,
        clientTel: client.tel,
        clientEmail: client.email,
        otherPartyName: otherParty.name,
        otherPartyTel: otherParty.tel,
        otherPartyEmail: otherParty.email,
        court,
        status,
      }),
    };
    setUIstate("loading");
    // PUT request using fetch
    const _res = await fetch("/api/dashboard/case", fetchOptions).then(
      async (res_) => {
        if (res_.ok) {
          return await res_.json();
        } else {
          console.log(`ERROR: ` + JSON.stringify(res_));
          toast.error("OOPS: case not updated");
        }
      }
    );
    if (_res?.success) {
      console.log(
        "SUCCESS: case updated successfully\n > " +
          JSON.stringify(_res.success) +
          "\n.............."
      );
      await refreshData();
      toast.success("Case updated successfully!");
      setUIstate("OK");
    } else {
      console.error(
        "ERROR: failed to update case at /dashboard/cases/[slug] /compo\n > " +
          JSON.stringify(_res) +
          "\n.............."
      );
      toast.error(_res?.error ?? "No Response, check internet connection");
    }
  }
  //func to Delete Case
  async function handleDeleteCase() {
    if (!selectedCase.id) {
      toast.error("Sorry, case could not be found");
      return;
    }
    // fetch options
    let fetchOptions = {
      method: "DELETE",
      body: JSON.stringify({
        id: selectedCase.id,
      }),
    };
    setUIstate("loading");
    // PUT request using fetch
    const _res = await fetch("/api/dashboard/case", fetchOptions).then(
      async (res_) => {
        if (res_.ok) {
          return await res_.json();
        } else {
          console.error(`ERROR: ` + JSON.stringify(res_));
          toast.error("OOPS: case not deleted");
        }
      }
    );
    if (_res?.success) {
      console.log(
        "SUCCESS: case deleted\n > " +
          JSON.stringify(_res.success) +
          "\n.............."
      );
      await refreshData();
      toast.success("Case deleted");
      router.replace("/dashboard/cases");
    } else {
      console.error(
        "ERROR: failed to delete case at /dashboard/cases/[slug] /compo\n > " +
          JSON.stringify(_res) +
          "\n.............."
      );
      toast.error(_res?.error ?? "No Response, check internet connection");
    }
  }
  //func to Create Task
  async function handleInitializeTask() {
    if (!select.item.type || !select.item.date || !select.item.task.name) {
      if (!select.item.type) toast.error("Please select task type");
      if (!select.item.date) toast.error("Please select task date");
      if (!select.item.task.name) toast.error("Please provide task name");
    } else {
      // fetch options
      let fetchOptions = {
        method: "POST",
        body: JSON.stringify({
          caseId: selectedCase._id,
          type: select.item.type,
          date: select.item.date,
          name: select.item.task.name,
        }),
      };
      setUIstate("loading");
      // POST request using fetch
      const _res = await fetch("/api/dashboard/task", fetchOptions).then(
        async (res_) => {
          if (res_.ok) {
            return await res_.json();
          } else {
            console.log(`ERROR: ` + JSON.stringify(res_));
            toast.error("OOPS: task not initialized");
          }
        }
      );
      if (_res?.success) {
        console.log(
          "SUCCESS: task initialized successfully\n > " +
            JSON.stringify(_res.success) +
            "\n.............."
        );
        await refreshData();
        toast.success("Task initialized successfully!");
        setSelect({ menu: "", item: "" });
      } else {
        if (_res?.failed) toast.error(_res?.failed);
        else
          toast.error(_res?.error ?? "No Response, check internet connection");
      }
      setUIstate("OK");
    }
  }
  //func to Complete Task
  async function handleCompleteTask() {
    if (!completeUpload) {
      toast.error("Please upload a task report/document");
    } else {
      //loading
      setUIstate("loading");
      //fetch options
      const formData = new FormData();
      formData.append("caseId", selectedCase._id);
      formData.append("taskName", select.item.task.name);
      formData.append("complete", completeUpload);
      console.log("COMPLETE file ", completeUpload);
      const fetchOptions = {
        method: "PUT",
        body: formData,
      };
      // POST request using fetch
      const _res = await fetch("/api/dashboard/task", fetchOptions).then(
        async (res_) => {
          if (res_.ok) {
            return await res_.json();
          } else {
            console.error(`ERROR: ` + JSON.stringify(res_));
            toast.error("OOPS: task not initialized");
          }
        }
      );
      if (_res?.success) {
        console.log(
          "SUCCESS: task completed\n > " +
            JSON.stringify(_res.success) +
            "\n.............."
        );
        await refreshData();
        toast.success("Task status complete!");
      } else {
        if (_res?.failed) toast.error(_res?.failed);
        else
          toast.error(_res?.error ?? "No Response, check internet connection");
      }
      setUIstate("OK");
    }
  }
  //func to Delete Task
  async function handleDeleteTask() {
    if (!select.item.task.name) {
      toast.error("Selected task not found");
    } else {
      //loading
      setUIstate("loading");
      //fetch options
      let fetchOptions = {
        method: "DELETE",
        body: JSON.stringify({
          caseId: selectedCase._id,
          taskName: select.item.task.name,
        }),
      };
      // POST request using fetch
      const _res = await fetch("/api/dashboard/task", fetchOptions).then(
        async (res_) => {
          if (res_.ok) {
            return await res_.json();
          } else {
            console.error(`ERROR: ` + JSON.stringify(res_));
            toast.error("OOPS: task not deleted");
          }
        }
      );
      if (_res?.success) {
        console.log(
          "SUCCESS: task deleted\n > " +
            JSON.stringify(_res.success) +
            "\n.............."
        );
        toast.success("Task deleted!");
        await refreshData();
        setSelect({ menu: "", item: "" });
      } else {
        if (_res?.failed) toast.error(_res?.failed);
        else
          toast.error(_res?.error ?? "No Response, check internet connection");
      }
      setUIstate("OK");
    }
  }
}

function InputText({
  value,
  setValue,
  valValidator = (val) => "",
  name = "inputName",
  label,
  type = "text",
  placeholder = "Text field",
  icon: Icon,
  errFields,
  setErrFields,
  readOnly,
}) {
  return (
    <div className="space-y-2 mb-4">
      {label && (
        <div className="no-wrap">
          <label htmlFor={name} className="px-2">
            {label}
          </label>
        </div>
      )}
      <div className="relative mb-6 mt-0">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
          {Icon && (
            <Icon className="w-4 h-4 text-emerald-800 dark:text-emerald-500" />
          )}
        </div>
        <input
          name={name}
          id={name}
          type={type}
          className={`${
            errFields.has(name)
              ? "border-red-500 dark:border-red-400"
              : "border-transparent dark:border-transparent focus:ring-emerald-800 focus:border-emerald-800 dark:focus:ring-emerald-800 dark:focus:border-emerald-800"
          } border bg-[linear-gradient(176deg,_#cbd1d8,_#f2f8ff)] dark:bg-[linear-gradient(176deg,_#0e1526,_#10192d)] shadow dark:shadow-dak dark:focus:shadow-dpressed focus:shadow-pressed text-gray-900 text-sm rounded-lg  block w-full pl-10 p-2.5  dark:bg-gray-700  dark:placeholder-gray-400 placeholder:italic dark:text-white `}
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            if (errFields.has(name)) {
              const err_ = valValidator(e.target.value);
              if (!err_) {
                setErrFields(
                  (prev) =>
                    new Set([[...prev].filter((name_) => name_ !== name)])
                );
              }
            }
            setValue(e.target.value);
          }}
          disabled={readOnly}
        />
      </div>
    </div>
  );
}

function InputDate({
  value,
  setValue,
  name = "inputName",
  label,
  type = "date",
  min = "2024-01-01",
  max = "2060-12-31",
  icon: Icon,
  errFields,
  readOnly,
}) {
  return (
    <div className="space-y-2 mb-4">
      {label && (
        <div className="no-wrap">
          <label htmlFor={name} className="px-2">
            {label}
          </label>
        </div>
      )}
      <div className="relative mb-6 mt-0">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
          {Icon && (
            <Icon className="w-4 h-4 text-emerald-800 dark:text-emerald-500" />
          )}
        </div>
        <input
          name={name}
          id={name}
          type={type}
          className={`${
            errFields.has(name)
              ? "border-red-500 dark:border-red-400"
              : "border-transparent dark:border-transparent focus:ring-emerald-800 focus:border-emerald-800 dark:focus:ring-emerald-800 dark:focus:border-emerald-800"
          } border bg-[linear-gradient(176deg,_#cbd1d8,_#f2f8ff)] dark:bg-[linear-gradient(176deg,_#0e1526,_#10192d)] shadow dark:shadow-dak dark:focus:shadow-dpressed focus:shadow-pressed text-gray-900 text-sm rounded-lg  block w-full pl-10 p-2.5  dark:bg-gray-700  dark:placeholder-gray-400 placeholder:italic dark:text-white `}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          min={min}
          max={max}
          disabled={readOnly}
        />
      </div>
    </div>
  );
}

function InputSelect({
  optionItems,
  value,
  onChange = () => "",
  name = "inputName",
  defaultOption = "type",
  icon: Icon,
}) {
  return (
    <div className="relative mb-6">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
        {Icon && (
          <Icon className="w-4 h-4 text-emerald-800 dark:text-emerald-500" />
        )}
      </div>
      <select
        name={name}
        id={name}
        className={`border-transparent dark:border-transparent focus:ring-emerald-800 focus:border-emerald-800 dark:focus:ring-emerald-800 dark:focus:border-emerald-800 border shadow dark:shadow-dak dark:focus:shadow-dpressed focus:shadow-pressed text-gray-900 text-sm rounded-lg  block w-full pl-10 p-2.5  dark:bg-gray-700  dark:placeholder-gray-400 placeholder:italic dark:text-white `}
        value={value}
        onChange={onChange}
      >
        <option value="" className="italic font-light">
          Select a {defaultOption}...
        </option>
        {optionItems.map((option) => (
          <option key={option.value} value={option.value}>
            {option.text}
          </option>
        ))}
      </select>
    </div>
  );
}
