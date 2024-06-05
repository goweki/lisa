import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { ButtonPrimary, ButtonDestructive } from "@/components/atoms/buttons";
import toast from "react-hot-toast";
import {
  SVGbuilding,
  SVGdoc,
  SVGfilter,
  SVGuser,
} from "@/components/atoms/svgs";
import TaskViewArea from "./taskView";
import { dateShort, isDatePassed } from "@/helpers/dateHandlers";
import { strPascalcase } from "@/helpers/stringHandlers";
import {
  emailValidator,
  nameValidator,
  telValidator,
} from "@/helpers/inputValidators";
import { InputSelect, InputText, InputDate } from "./inputs";
import Link from "next/link";

export default function ViewCase({
  selectedCase,
  selectedTaskID,
  template,
  refreshData,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [UIstate, setUIstate] = useState("OK");
  const [tab, setTab] = useState(selectedTaskID ? "tasks" : "profile");
  const [edit, setEdit] = useState("");
  const [selectedTask, setTask] = useState(
    selectedTaskID
      ? {
          type: "task",
          item: selectedCase.tasks.find(({ id }) => id === selectedTaskID),
        }
      : ""
  );
  const [docAttachment, setDocAttachment] = useState("");
  const [errFields, setErrFields] = useState(new Set());
  const [filterPhrase, setFilterPhrase] = useState(searchParams.get("filter"));
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
  const [lawyer, setLawyer] = useState(selectedCase.lawyer ?? "");
  const [reminders, setReminders] = useState([
    { channel: "", regime: "", count: "" },
  ]);
  //reminders Handlers
  const handleReminderChange = (index, field, value) => {
    const newReminders = reminders.slice();
    newReminders[index][field] = value;
    setReminders(newReminders);
  };

  const addReminder = () => {
    setReminders((prev) => [...prev, { channel: "", count: "", regime: "" }]);
  };

  const deleteReminder = (index) => {
    setReminders((prev) => prev.filter((_, i) => i !== index));
  };

  // load task classes
  useEffect(() => {
    if (filterPhrase === "overdue")
      setCaseTasks(
        selectedCase.tasks?.filter(
          ({ dueDate, completedBy }) =>
            isDatePassed(new Date(dueDate)) && !completedBy
        )
      );
    else if (filterPhrase === "due")
      setCaseTasks(
        selectedCase.tasks?.filter(
          ({ dueDate, completedBy }) =>
            !isDatePassed(new Date(dueDate)) && !completedBy
        )
      );
    else if (filterPhrase === "done")
      setCaseTasks(
        selectedCase.tasks?.filter(({ completedBy }) => completedBy)
      );
    else setCaseTasks(selectedCase.tasks);
  }, [filterPhrase, selectedCase.tasks]);

  // render
  return (
    <div id="view-case">
      {/* header */}
      <ul className="items-center justify-center flex flex-wrap -mb-px font-medium text-sm text-center">
        <li className="me-2">
          <Link
            href={`/dashboard/cases/${selectedCase.id}`}
            className={`${
              tab === "profile"
                ? "card m-0 mt-2"
                : "border-transparent from-transparent to-transparent text-gray-500 dark:text-gray-400"
            } min-w-48 rounded-lg m-0 mt-2 cursor-pointer inline-flex border border-transparent items-center justify-center p-4 hover:border-emerald-700 dark:hover:border-emerald-200 group`}
            // onClick={() => {
            //   setTab("profile");
            //   setEdit("");
            //   // resetCaseStates();
            //   resetTaskStates();
            // }}
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
          </Link>
        </li>
        <li className="me-2">
          <Link
            href={`/dashboard/cases/${selectedCase.id}/new`}
            className={`${
              tab === "tasks"
                ? "card m-0 mt-2"
                : "border-transparent from-transparent to-transparent text-gray-500 dark:text-gray-400"
            } min-w-48 rounded-lg m-0 mt-2 cursor-pointer inline-flex border border-transparent items-center justify-center p-4 hover:border-emerald-700 dark:hover:border-emerald-200 group`}
            // onClick={() => {
            //   setTab("tasks");
            //   setEdit("");
            //   resetCaseProfileStates();
            //   // resetTaskStates();
            // }}
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
          </Link>
        </li>
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
                valValidator={nameValidator}
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
                      valValidator={telValidator}
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
                      valValidator={emailValidator}
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
                  valValidator={nameValidator}
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
                        valValidator={telValidator}
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
                        valValidator={emailValidator}
                        readOnly={edit !== "profile"}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div id="case-lawyer" className="mb-4 space-y-2">
              <label htmlFor="lawyer" className="px-2">
                Lawyer
              </label>
              <InputSelect
                name="lawyer"
                optionItems={[
                  { value: "overdue", text: "❗ overdue" },
                  { value: "due", text: "✍🏾 due" },
                  { value: "done", text: "✔️ Done" },
                ]}
                value={lawyer}
                onChange={(e) => {
                  setLawyer(e.target.value);
                }}
                icon={SVGuser}
                defaultOption="lawyer"
              />
            </div>
            <div id="court-name" className="mb-4">
              <InputText
                label="Court"
                name="court"
                placeholder="Court name"
                value={court}
                setValue={(val) => setCourt(val)}
                errFields={errFields}
                setErrFields={setErrFields}
                valValidator={nameValidator}
                readOnly={edit !== "profile"}
              />
            </div>
            <div className="flex items-center mb-4 pl-4">
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
                  setTask({ type: "", item: "" });
                }}
                icon={SVGfilter}
                defaultOption="filter"
              />
            </div>

            <div className="md:flex">
              <ul className="flex-column space-y space-y-4 text-sm font-medium text-gray-500 dark:text-gray-400 md:me-4 mb-4 md:mb-0">
                <li
                // onClick={() => {
                //   setTask({
                //     type: "new",
                //     item: {
                //       type: "",
                //       name: "",
                //       description: "",
                //       dueDate: "",
                //       reminders: [],
                //     },
                //   });
                //   setDocAttachment("");
                // }}
                >
                  <div
                    onClick={() => {
                      setTask({
                        type: "new",
                        item: {
                          type: "",
                          name: "",
                          description: "",
                          dueDate: "",
                          reminders: [],
                        },
                      });
                      setDocAttachment("");
                    }}
                    className={`${
                      selectedTask.type === "new"
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
                  {/* <div
                    className={`${
                      selectedTask.type === "new"
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
                  </div> */}
                </li>
                {caseTasks?.map((taskItem) => (
                  <li key={taskItem.id}>
                    <Link
                      href={`/dashboard/cases/${selectedCase.id}/${taskItem.id}?filter=${filterPhrase}`}
                      // onClick={() => {
                      //   setTask({
                      //     type: "task",
                      //     item: selectedCase.tasks.find(
                      //       ({ id }) => id === taskItem.id
                      //     ),
                      //   });
                      //   setDocAttachment("");
                      // }}
                      className={`${
                        selectedTask.item?.id === taskItem.id
                          ? "text-emerald-700 bg-gray-100 dark:bg-gray-700 dark:text-emerald-200"
                          : ""
                      } min-w-[124px] inline-flex items-center px-4 py-3 rounded-lg  bg-slate-50 w-full dark:bg-gray-800 hover:text-emerald-700 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-emerald-200 cursor-pointer`}
                    >
                      {taskItem.type === "document" ? (
                        <SVGdoc
                          className={`${
                            selectedTask.item?.id === taskItem.id
                              ? "text-emerald-600"
                              : "text-gray-500 dark:text-gray-400"
                          } w-4 h-4 me-2 `}
                        />
                      ) : (
                        <SVGbuilding
                          className={`${
                            selectedTask.item?.id === taskItem.id
                              ? "text-emerald-600"
                              : "text-gray-500 dark:text-gray-400"
                          } w-4 h-4 me-2 `}
                        />
                      )}
                      {taskItem.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <TaskViewArea
                select={selectedTask}
                reminders={reminders}
                handleReminderChange={handleReminderChange}
                addReminder={addReminder}
                deleteReminder={deleteReminder}
                UIstate={UIstate}
                handleInitializeTask={handleInitializeTask}
                errFields={errFields}
                setErrFields={setErrFields}
                setTask={setTask}
                handleDeleteTask={handleDeleteTask}
                handleCompleteTask={handleCompleteTask}
              />
            </div>
          </>
        ) : null}
      </form>
    </div>
  );

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
    setTask({ type: "", item: "" });
    setDocAttachment("");
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
        setErrFields((prev) => new Set([...prev, "client-tel"]));
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
        description,
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
        "SUCCESS: Case updated successfully\n > " +
          JSON.stringify(_res.success) +
          "\n.............."
      );
      await refreshData();
      toast.success("Case updated successfully!");
      setUIstate("OK");
    } else {
      console.error(
        "ERROR: failed to update case at /dashboard/cases/[slug] - viewCase.js iAA \n > " +
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
        "ERROR: failed to delete case at /dashboard/cases/[slug] - viewCase.js iBB\n > " +
          JSON.stringify(_res) +
          "\n.............."
      );
      toast.error(_res?.error ?? "No Response, check internet connection");
    }
  }
  //func to Create Task
  async function handleInitializeTask() {
    const reminderfields = reminders.reduce((acc, v) => {
      return [...acc, ...Object.values(v)];
    }, []);
    if (
      !selectedTask.item.type ||
      !selectedTask.item.dueDate ||
      !selectedTask.item.name ||
      reminderfields.some((el) => !el)
    ) {
      if (!selectedTask.item.type) toast.error("Please select task type");
      if (!selectedTask.item.dueDate) toast.error("Please select task date");
      if (!selectedTask.item.name) toast.error("Please provide task name");
      if (reminderfields.some((el) => !el))
        toast.error("Delete empty/incomplete reminders");
    } else {
      // fetch options
      let fetchOptions = {
        method: "POST",
        body: JSON.stringify({
          caseID: selectedCase.id,
          ...selectedTask.item,
          reminders: reminders,
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
        setTask({ type: "", item: "" });
      } else {
        if (_res?.failed) toast.error(_res?.failed);
        else
          toast.error(_res?.error ?? "No Response, check internet connection");
      }
      setUIstate("OK");
    }
  }
  //func to AttachDoc Task
  async function handleDocAttachment() {
    if (!docAttachment) {
      toast.error("Please upload a task report/document");
    } else {
      //loading
      setUIstate("loading");
      //fetch options
      const formData = new FormData();
      formData.append("caseId", selectedCase._id);
      formData.append("taskName", selectedTask.item.task.name);
      formData.append("complete", docAttachment);
      console.log("COMPLETE file ", docAttachment);
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
  //func to Complete Task
  async function handleCompleteTask() {
    if (!session.user) {
      toast.error("User validation failed");
    }

    //loading
    setUIstate("loading");
    //fetch options
    const fetchOptions = {
      method: "PUT",
      body: JSON.stringify({
        completedBy: session.user.id,
      }),
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
      else toast.error(_res?.error ?? "No Response, check internet connection");
    }
    setUIstate("OK");
  }
  //func to Delete Task
  async function handleDeleteTask() {
    if (!selectedTask.item.id) {
      toast.error("Selected task not found");
    } else {
      //loading
      setUIstate("loading");
      //fetch options
      let fetchOptions = {
        method: "DELETE",
        body: JSON.stringify({
          caseID: selectedCase.id,
          taskID: selectedTask.item.id,
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
        setTask({ type: "", item: "" });
      } else {
        if (_res?.failed) toast.error(_res?.failed);
        else
          toast.error(_res?.error ?? "No Response, check internet connection");
      }
      setUIstate("OK");
    }
  }
}
