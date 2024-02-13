import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ButtonPrimary, ButtonText } from "@/components/atoms/buttons";
import toast from "react-hot-toast";
import { SVGbuilding, SVGdoc, SVGfilter } from "@/components/atoms/svgs";
import { dateShort, isDatePassed } from "@/helpers/dateHandlers";
import { strPascalcase } from "@/helpers/stringHandlers";
import DocView from "@/components/mols/docViewer";

export function ViewIssue({
  selectedIssue,
  template,
  refreshData,
  selectedTaskName,
}) {
  const router = useRouter();
  const [UIstate, setUIstate] = useState("OK");
  const [tab, setTab] = useState("profile");
  const [edit, setEdit] = useState("");
  const [select, setSelect] = useState({ menu: "", item: "" });
  const [completeUpload, setCompleteUpload] = useState("");
  const [errFields, setErrFields] = useState([]);
  const [filterPhrase, setFilterPhrase] = useState("");
  const [expandedField, setExpanded] = useState("");
  const [source, setSource] = useState({
    name: selectedIssue.source.name ?? "",
    tel: selectedIssue.source.tel ?? "",
    email: selectedIssue.source.email ?? "",
  });
  const [respondent, setRespondent] = useState({
    name: selectedIssue.respondent?.name ?? "",
    tel: selectedIssue.respondent?.tel ?? "",
    email: selectedIssue.respondent?.email ?? "",
  });
  const [court, setCourt] = useState(selectedIssue.court ?? "");
  const [dueDates, setDueDates] = useState(selectedIssue.dueDates);
  const [status, setStatus] = useState({
    status: selectedIssue.status.status ?? "",
    description: selectedIssue.status.description ?? "",
  });

  // load task classes
  useEffect(() => {
    if (filterPhrase === "overdue")
      setDueDates(
        selectedIssue.dueDates?.filter(
          ({ date, task }) => isDatePassed(new Date(date)) && !task.complete
        )
      );
    else if (filterPhrase === "due")
      setDueDates(
        selectedIssue.dueDates?.filter(
          ({ date, task }) => !isDatePassed(new Date(date)) && !task.complete
        )
      );
    else if (filterPhrase === "done")
      setDueDates(selectedIssue.dueDates?.filter(({ task }) => task.complete));
    else setDueDates(selectedIssue.dueDates);
  }, [filterPhrase, selectedIssue.dueDates]);
  // if selectedTaskId
  useEffect(() => {
    if (selectedTaskName) {
      setTab("tasks");
      const task = selectedIssue.dueDates.find(
        ({ task }) => task.name === selectedTaskName
      );
      setSelect({ menu: "task", item: task });
    }
  }, [selectedTaskName, selectedIssue.dueDates]);

  // render
  return (
    <div id="view-issue">
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
              // resetIssueStates();
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
            Issue Profile
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
              resetIssueProfileStates();
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
      <form className="card p-6 overflow-hidden">
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
                      resetIssueProfileStates();
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
            <div id="source-details" className="mb-4">
              <InputText
                label="Source (issue initiator)"
                name="source-name"
                placeholder="Source name"
                value={source.name}
                setValue={(val) =>
                  setSource((prev) => ({ ...prev, name: val }))
                }
                errFields={errFields}
                readOnly={edit !== "profile"}
              />
              <div id="source-dropdown-button" className="mx-6">
                <button
                  type="button"
                  className="flex items-center justify-between w-full font-medium text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400 gap-3"
                  onClick={() => {
                    setExpanded((prev) =>
                      prev === "source-name" ? "" : "source-name"
                    );
                  }}
                >
                  <span className="text-xs">more fields</span>
                  <svg
                    data-accordion-icon
                    className={`w-3 h-3 shrink-0 ${
                      expandedField !== "source-name" ? "rotate-180" : ""
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
                id="source-more-fields"
                className={`${
                  expandedField === "source-name" ? "" : "hidden"
                } mx-6 md:mx-8`}
              >
                <div className="py-5 border-b border-gray-200 dark:border-gray-700">
                  <div className="grid gap-6 md:grid-cols-2">
                    <InputText
                      name="source-tel"
                      placeholder="Telephone number"
                      value={source.tel}
                      setValue={(val) =>
                        setSource((prev) => ({ ...prev, tel: val }))
                      }
                      errFields={errFields}
                      readOnly={edit !== "profile"}
                    />
                    <InputText
                      name="source-email"
                      placeholder="Email address"
                      value={source.email}
                      setValue={(val) =>
                        setSource((prev) => ({ ...prev, email: val }))
                      }
                      errFields={errFields}
                      readOnly={edit !== "profile"}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div id="respondent-details" className="mb-4">
              <InputText
                label="Respondent"
                name="respondent-name"
                placeholder="Respondent name"
                value={respondent.name}
                setValue={(val) =>
                  setRespondent((prev) => ({ ...prev, name: val }))
                }
                errFields={errFields}
                readOnly={edit !== "profile"}
              />
              <div id="respondent-dropdown-button" className="mx-6">
                <button
                  type="button"
                  className="flex items-center justify-between w-full font-medium text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400 gap-3"
                  onClick={() => {
                    setExpanded((prev) =>
                      prev === "respondent-name" ? "" : "respondent-name"
                    );
                  }}
                >
                  <span className="text-xs">more fields</span>
                  <svg
                    data-accordion-icon
                    className={`w-3 h-3 shrink-0 ${
                      expandedField !== "respondent-name" ? "rotate-180" : ""
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
                id="respondent-more-fields"
                className={`${
                  expandedField === "respondent-name" ? "" : "hidden"
                } mx-6 md:mx-8`}
              >
                <div className="py-5 border-b border-gray-200 dark:border-gray-700">
                  <div className="grid gap-6 md:grid-cols-2">
                    <InputText
                      name="respondent-tel"
                      placeholder="Telephone number"
                      value={respondent.tel}
                      setValue={(val) =>
                        setRespondent((prev) => ({ ...prev, tel: val }))
                      }
                      errFields={errFields}
                      readOnly={edit !== "profile"}
                    />
                    <InputText
                      name="respondent-email"
                      placeholder="Email address"
                      value={respondent.email}
                      setValue={(val) =>
                        setRespondent((prev) => ({ ...prev, email: val }))
                      }
                      errFields={errFields}
                      readOnly={edit !== "profile"}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div id="court-name" className="mb-6">
              <InputText
                label="Court"
                name="court"
                placeholder="Court name"
                value={court}
                setValue={(val) => setCourt(val)}
                errFields={errFields}
                readOnly={edit !== "profile"}
              />
            </div>
            <div className="flex items-center mb-6 pl-4">
              <div className="flex items-center h-5">
                <input
                  id="issue-status"
                  type="checkbox"
                  checked={status.status === "open"}
                  onChange={(e) => {
                    if (e.target.checked)
                      setStatus((prev) => ({ ...prev, status: "open" }));
                    else setStatus((prev) => ({ ...prev, status: "closed" }));
                  }}
                  className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
                  disabled={edit !== "profile"}
                />
              </div>
              <label
                htmlFor="issue-status"
                className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Active
              </label>
              <div className="ml-6 mt-4">
                <InputText
                  name="status-description"
                  placeholder="Status description"
                  value={status.description}
                  setValue={(val) =>
                    setStatus((prev) => ({ ...prev, description: val }))
                  }
                  errFields={errFields}
                  readOnly={edit !== "profile"}
                />
              </div>
            </div>
            {edit === "profile" && (
              <div className="max-w-lg mx-auto">
                <div className="mb-4">
                  <ButtonPrimary
                    label="Submit Issue changes"
                    loading={UIstate === "loading"}
                    onClick={handleSubmitIssueChanges}
                  />
                </div>
                <div className="flex justify-center">
                  <ButtonText
                    label="Delete Issue"
                    loading={UIstate === "loading"}
                    onClick={handleDeleteIssue}
                  />
                </div>
              </div>
            )}
          </>
        ) : tab === "tasks" ? (
          <>
            <div>
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
                {dueDates?.map((taskItem) => (
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
                <ButtonText
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
              defaultOption="type of issue"
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
  //func to reset issue-states
  function resetIssueProfileStates() {
    setSource({
      name: selectedIssue.source.name ?? "",
      tel: selectedIssue.source.tel ?? "",
      email: selectedIssue.source.email ?? "",
    });
    setRespondent({
      name: selectedIssue.respondent?.name ?? "",
      tel: selectedIssue.respondent?.tel ?? "",
      email: selectedIssue.respondent?.email ?? "",
    });
    setCourt(selectedIssue.court ?? "");
    setStatus({
      status: selectedIssue.status.status ?? "",
      description: selectedIssue.status.description ?? "",
    });
  }
  //func to reset task-state
  function resetTaskStates() {
    setFilterPhrase("");
    setSelect({ menu: "", item: "" });
    setCompleteUpload("");
  }
  //func to Update Issue
  async function handleSubmitIssueChanges() {
    if (!selectedIssue._id) {
      toast.error("Sorry, issue could not be found");
    } else {
      // fetch options
      let fetchOptions = {
        method: "PUT",
        body: JSON.stringify({
          _id: selectedIssue._id,
          source,
          respondent,
          court,
          status,
        }),
      };
      setUIstate("loading");
      // PUT request using fetch
      const _res = await fetch("/api/user/issue", fetchOptions).then(
        async (res_) => {
          if (res_.ok) {
            return await res_.json();
          } else {
            console.log(`ERROR: ` + JSON.stringify(res_));
            toast.error("OOPS: issue not updated");
          }
        }
      );
      if (_res?.success) {
        console.log(
          "SUCCESS: issue updated successfully\n > " +
            JSON.stringify(_res.success) +
            "\n.............."
        );
        await refreshData();
        toast.success("Issue updated successfully!");
        setUIstate("OK");
      } else {
        console.error(
          "ERROR: failed to update issue at /user/issues/[slug] /compo\n > " +
            JSON.stringify(_res) +
            "\n.............."
        );
        toast.error(_res?.error ?? "No Response, check internet connection");
      }
    }
  }
  //func to Delete Issue
  async function handleDeleteIssue() {
    if (!selectedIssue._id) {
      toast.error("Sorry, issue could not be found");
    } else {
      // fetch options
      let fetchOptions = {
        method: "DELETE",
        body: JSON.stringify({
          _id: selectedIssue._id,
        }),
      };
      setUIstate("loading");
      // PUT request using fetch
      const _res = await fetch("/api/user/issue", fetchOptions).then(
        async (res_) => {
          if (res_.ok) {
            return await res_.json();
          } else {
            console.error(`ERROR: ` + JSON.stringify(res_));
            toast.error("OOPS: issue not deleted");
          }
        }
      );
      if (_res?.success) {
        console.log(
          "SUCCESS: issue deleted\n > " +
            JSON.stringify(_res.success) +
            "\n.............."
        );
        await refreshData();
        toast.success("Issue deleted");
        router.replace("/user/issues");
      } else {
        console.error(
          "ERROR: failed to delete issue at /user/issues/[slug] /compo\n > " +
            JSON.stringify(_res) +
            "\n.............."
        );
        toast.error(_res?.error ?? "No Response, check internet connection");
      }
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
          issueId: selectedIssue._id,
          type: select.item.type,
          date: select.item.date,
          name: select.item.task.name,
        }),
      };
      setUIstate("loading");
      // POST request using fetch
      const _res = await fetch("/api/user/task", fetchOptions).then(
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
      formData.append("issueId", selectedIssue._id);
      formData.append("taskName", select.item.task.name);
      formData.append("complete", completeUpload);
      console.log("COMPLETE file ", completeUpload);
      const fetchOptions = {
        method: "PUT",
        body: formData,
      };
      // POST request using fetch
      const _res = await fetch("/api/user/task", fetchOptions).then(
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
          issueId: selectedIssue._id,
          taskName: select.item.task.name,
        }),
      };
      // POST request using fetch
      const _res = await fetch("/api/user/task", fetchOptions).then(
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
  name = "inputName",
  label,
  type = "text",
  placeholder = "Text field",
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
            errFields.includes(name)
              ? "border-red-500 dark:border-red-400"
              : "border-transparent dark:border-transparent focus:ring-emerald-800 focus:border-emerald-800 dark:focus:ring-emerald-800 dark:focus:border-emerald-800"
          } border bg-[linear-gradient(176deg,_#cbd1d8,_#f2f8ff)] dark:bg-[linear-gradient(176deg,_#0e1526,_#10192d)] shadow dark:shadow-dak dark:focus:shadow-dpressed focus:shadow-pressed text-gray-900 text-sm rounded-lg  block w-full pl-10 p-2.5  dark:bg-gray-700  dark:placeholder-gray-400 placeholder:italic dark:text-white `}
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
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
            errFields.includes(name)
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
