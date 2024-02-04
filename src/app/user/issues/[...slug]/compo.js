import { useState, useEffect } from "react";
import { ButtonPrimary } from "@/components/atoms/buttons";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { SVGfilter } from "@/components/atoms/svgs";
import { dateShort } from "@/helpers/dateHandlers";

export function ViewIssue({ selectedIssue, template }) {
  const router = useRouter();
  const [tab, setTab] = useState("profile");
  const [select, setSelect] = useState({ menu: "", items: "" });
  const [edit, setEdit] = useState("");
  const [errFields, setErrFields] = useState([]);
  const [filterPhrase, setFilterPhrase] = useState("");
  const [expandedField, setExpanded] = useState("");
  const [UIstate, setUIstate] = useState("OK");
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
  useEffect(() => {}, []);
  //

  async function handleSubmitProfile() {
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
        toast.success("Issue updated successfully!");
        // await refreshData();
        router.refresh();
        setUIstate("OK");
      } else {
        console.error(
          "ERROR: failed to update issue at /user/issues/[slug] /page\n > " +
            JSON.stringify(_res) +
            "\n.............."
        );
        toast.error(_res?.error ?? "No Response, check internet connection");
      }
    }
  }

  function resetStates() {
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
    setDueDates(selectedIssue.dueDates);
    setStatus({
      status: selectedIssue.status.status ?? "",
      description: selectedIssue.status.description ?? "",
    });
  }

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
              resetStates();
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
              resetStates();
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
            Tasks & Documents
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
                      resetStates();
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
            <div className="flex items-center justify-center mb-6">
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
              <div className="ml-6">
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
              <ButtonPrimary
                label="Submit changes"
                loading={UIstate === "loading"}
                onClick={handleSubmitProfile}
              />
            )}
          </>
        ) : (
          <>
            <div>
              <div className="max-w-xs mb-4 m-auto">
                <InputSelect
                  name="filterPhrase"
                  optionItems={[
                    { value: "overdue", text: "❗ overdue" },
                    { value: "due", text: "✍🏾 due" },
                    { value: "done", text: "✔️ Done" },
                    { value: "undone", text: "☐ undone" },
                  ]}
                  value={filterPhrase}
                  onChange={(e) => {
                    setFilterPhrase(e.target.value);
                  }}
                  defaultOption="filter"
                />
              </div>
            </div>
            <div className="md:flex">
              <ul className="flex-column space-y space-y-4 text-sm font-medium text-gray-500 dark:text-gray-400 md:me-4 mb-4 md:mb-0">
                <li>
                  <div className="inline-flex items-center px-4 py-3 rounded-lg w-full border border-neutral-400 dark:border-neutral-500 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white cursor-pointer hover:border-transparent dark:hover:border-transparent">
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
                    New
                  </div>
                </li>
                {selectedIssue.dueDates?.map((taskItem) => (
                  <li
                    key={taskItem.task.name}
                    onClick={() => setSelect({ menu: "task", item: taskItem })}
                  >
                    <div className="inline-flex items-center px-4 py-3 rounded-lg  bg-slate-50 w-full dark:bg-gray-800 hover:text-emerald-700 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-emerald-200 cursor-pointer">
                      <svg
                        className="w-4 h-4 me-2 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 18 18"
                      >
                        <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                      </svg>
                      {taskItem.task.name}
                    </div>
                  </li>
                ))}
              </ul>
              {viewArea(select)}
            </div>
          </>
        )}
      </form>
    </div>
  );

  function viewArea(select) {
    return (
      <div className="p-6 bg-gray-50 text-medium text-gray-500 dark:text-gray-400 dark:bg-gray-800 rounded-lg w-full">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          {select.menu === "task"
            ? select.item.task.name
            : "Select an item on the left to view details"}
        </h3>
        {select.menu === "task" && (
          <p className="mb-2">
            Due Date: {dateShort(new Date(select.item.date))}
          </p>
        )}
        <p>
          The tab JavaScript swaps classes to control the content visibility and
          styling.
        </p>
      </div>
    );
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

function InputSelect({
  optionItems,
  value,
  onChange = () => "",
  name = "inputName",
  defaultOption = "type",
}) {
  return (
    <div className="relative mb-6">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
        <SVGfilter className="w-4 h-4 text-emerald-800 dark:text-emerald-500" />
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
