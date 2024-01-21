"use client";
import { useContext, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { DataContext } from "../providers";
import { useDate } from "@/lib/dateTime";
import { ButtonPrimary, ButtonSecondary } from "@/components/atoms/buttons";
import { InputText } from "@/components/atoms/inputs";
import { SVGsearch } from "@/components/atoms/svgs";
import {
  dateShort,
  hoursDifference,
  isDatePassed,
} from "@/helpers/dateHandlers";

export default function TasksPage() {
  const [UIstate, setUIstate] = useState("loading");
  const { issues } = useContext(DataContext);
  const { rawDate } = useDate();
  const [searchPhrase, setSearchPhrase] = useState({ value: "", error: "" });
  const [completeTasks, setCompletes] = useState("");
  const [overdueTasks, setOverdues] = useState("");
  const [almOverdueTasks, setAlmOverdues] = useState("");
  const [pendingTasks, setPendings] = useState("");
  const [selectedTask, setSelected] = useState(null);
  const rawDateMemo = useCallback(() => rawDate(), []);
  //onMount / onUpdate- set task categories
  useEffect(() => {
    //
    const issues_withCompletetasks = issues
      .filter((issue) => issue.status.status === "open")
      .map((issue) => {
        return {
          _id: issue._id,
          name: issue.name,
          type: issue.type,
          dueDates: issue.dueDates.filter((obj) => obj.task.complete),
        };
      })
      .filter((issue) => issue.dueDates.length);

    const issues_withIncompletetasks = issues
      .filter((issue) => issue.status.status === "open")
      .map((issue) => {
        return {
          _id: issue._id,
          name: issue.name,
          type: issue.type,
          dueDates: issue.dueDates.filter((obj) => !obj.task.complete),
        };
      })
      .filter((issue) => issue.dueDates.length);

    //complete tasks
    const completes_2d = issues_withCompletetasks.map((issue) => {
      const innerCompletes = issue.dueDates.map((dueDate) => {
        return {
          issueId: issue._id,
          issueName: issue.name,
          issueType: issue.type,
          dueDate: dueDate.date,
          task: dueDate.task,
        };
      });
      return innerCompletes;
    });
    const completes = completes_2d.flat();
    setCompletes(completes);
    // incomplete tasks
    const inCompletes_2d = issues_withIncompletetasks.map((issue) => {
      const innerIncompletes = issue.dueDates.map((dueDate) => {
        return {
          issueId: issue._id,
          issueName: issue.name,
          issueType: issue.type,
          dueDate: dueDate.date,
          task: dueDate.task,
        };
      });
      return innerIncompletes;
    });
    const inCompletes = inCompletes_2d.flat();
    // overdues - past due date
    if (inCompletes.length > 0) {
      // if overdues
      if (
        inCompletes.filter((task) => isDatePassed(new Date(task.dueDate)))
          .length
      )
        setOverdues(
          inCompletes.filter((task) => isDatePassed(new Date(task.dueDate)))
        );
      // if almost overdue
      if (
        inCompletes.filter(
          (task) =>
            !isDatePassed(new Date(task.dueDate)) &&
            hoursDifference(new Date(task.dueDate), rawDateMemo()) < 72
        ).length
      )
        setAlmOverdues(
          inCompletes.filter(
            (task) =>
              !isDatePassed(new Date(task.dueDate)) &&
              hoursDifference(new Date(task.dueDate), rawDateMemo()) <= 72
          )
        );
      //if pending
      if (
        inCompletes.filter(
          (task) =>
            !isDatePassed(new Date(task.dueDate)) &&
            hoursDifference(new Date(task.dueDate), rawDateMemo()) > 72
        ).length
      )
        setPendings(
          inCompletes.filter(
            (task) =>
              !isDatePassed(new Date(task.dueDate)) &&
              hoursDifference(new Date(task.dueDate), rawDateMemo()) > 72
          )
        );
    }
    //stop loading
    setUIstate("OK");
    //
  }, [issues, rawDateMemo]);
  //listItem - task
  function listItem(task, status) {
    return (
      <>
        <th scope="row" className="flex px-6 py-4 whitespace-nowrap">
          <div className="text-start ps-3">
            <div className="font-semibold">{task.task.name}</div>
            <div className="font-light text-neutral-500">{task.issueName}</div>
            <div className="font-light text-xs text-neutral-500">
              {task.issueType.category}, {task.issueType.type}
            </div>
          </div>
        </th>
        <td className="px-6 py-4">
          <div className="flex items-center">
            <div
              className={`h-2.5 w-2.5 rounded-full ${
                status === "overdue"
                  ? "bg-red-500"
                  : status === "late"
                  ? "bg-yellow-500"
                  : status === "pending"
                  ? "bg-blue-500"
                  : "bg-green-500"
              } me-2`}
            ></div>{" "}
            {status}
          </div>
        </td>
        <td className="px-6 py-4">{dateShort(new Date(task.dueDate))}</td>
        <td className="px-6 py-4">
          {/* <!-- Modal toggle --> */}
          <Link
            href="#"
            className="font-medium text-blue-600 dark:text-blue-500"
          >
            <button
              data-modal-show="editTaskModal"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setSelected(task);
              }}
            >
              View task
            </button>
          </Link>
        </td>
      </>
    );
  }
  //render
  if (UIstate === "OK")
    return (
      <main className="flex flex-col flex-grow items-center px-4">
        <div className="max-w-screen-lg py-6 mx-auto px-4 lg:px-6 w-full">
          <div className="space-y-2 md:space-y-5 mb-4">
            <h1 className="text-center uppercase">Tasks</h1>
            <div className="relative max-w-lg mx-auto grid grid-cols-1 gap-4 card pt-3 pb-6 px-12">
              {/* <div className="relative max-w-lg mx-auto grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 card pt-3 pb-6 px-12"> */}
              {/* <div className="md:order-last pt-2">
              <Link href="/user/issues/new">
                <ButtonPrimary label="+new Issue" onClick={() => ""} />
              </Link>
            </div> */}
              <div>
                <InputText
                  name="searchPhrase"
                  value={searchPhrase}
                  setValue={setSearchPhrase}
                  placeholder="Search for tasks"
                  icon={SVGsearch}
                />
              </div>
            </div>
          </div>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-start uppercase card">
                <tr>
                  <th scope="col" className="px-6 py-3 text-start">
                    Task
                  </th>
                  <th scope="col" className="px-6 py-3 text-start">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-start">
                    Due date
                  </th>
                  <th scope="col" className="px-6 py-3 text-start"></th>
                </tr>
              </thead>
              <tbody>
                {/* overdue TASKS */}
                {overdueTasks.length > 0 &&
                  overdueTasks.map((v, i) => (
                    <tr
                      key={i}
                      issueid={v.issueId}
                      className="border-b border-backg-raised dark:border-backg-dark-raised hover:bg-backg-raised dark:hover:bg-backg-dark-raised"
                    >
                      {listItem(v, "overdue")}
                    </tr>
                  ))}
                {/* late (almost-overdue) TASKS*/}
                {almOverdueTasks.length > 0 &&
                  almOverdueTasks.map((v, i) => (
                    <tr
                      key={i}
                      issueid={v.issueId}
                      className="border-b border-backg-raised dark:border-backg-dark-raised hover:bg-backg-raised dark:hover:bg-backg-dark-raised"
                    >
                      {listItem(v, "late")}
                    </tr>
                  ))}
                {/* pending TASKS*/}
                {pendingTasks.length > 0 &&
                  pendingTasks.map((v, i) => (
                    <tr
                      key={i}
                      issueid={v.issueId}
                      className="border-b border-backg-raised dark:border-backg-dark-raised hover:bg-backg-raised dark:hover:bg-backg-dark-raised"
                    >
                      {listItem(v, "pending")}
                    </tr>
                  ))}
                {/* completed TASKS*/}
                {completeTasks.length > 0 &&
                  completeTasks.map((v, i) => (
                    <tr
                      key={i}
                      issueid={v.issueId}
                      className="border-b border-backg-raised dark:border-backg-dark-raised hover:bg-backg-raised dark:hover:bg-backg-dark-raised"
                    >
                      {listItem(v, "complete")}
                    </tr>
                  ))}
              </tbody>
            </table>
            {/* <!-- Edit user modal --> */}
            {selectedTask && (
              <div
                id="editTaskModal"
                tabIndex="-1"
                aria-hidden="true"
                className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full bg-backg/50 dark:bg-backg-dark/50 backdrop-blur-sm"
              >
                <div className="relative w-full max-w-2xl max-h-full">
                  {/* <!-- Modal content --> */}
                  <form className="card relative">
                    {/* <!-- Modal header --> */}
                    <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Edit user
                      </h3>
                      <button
                        type="button"
                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-red-500 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        data-modal-hide="editTaskModal"
                        onClick={() => setSelected(null)}
                      >
                        <svg
                          className="w-3 h-3"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 14 14"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                          />
                        </svg>
                        <span className="sr-only">Close modal</span>
                      </button>
                    </div>
                    {/* <!-- Modal body --> */}
                    <div className="p-6 space-y-6">
                      <div className="grid grid-cols-6 gap-6">
                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="first-name"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            First Name
                          </label>
                          <input
                            type="text"
                            name="first-name"
                            id="first-name"
                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Bonnie"
                            required=""
                          />
                        </div>
                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="last-name"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Last Name
                          </label>
                          <input
                            type="text"
                            name="last-name"
                            id="last-name"
                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Green"
                            required=""
                          />
                        </div>
                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="email"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            id="email"
                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="example@company.com"
                            required=""
                          />
                        </div>
                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="phone-number"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Phone Number
                          </label>
                          <input
                            type="number"
                            name="phone-number"
                            id="phone-number"
                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="e.g. +(12)3456 789"
                            required=""
                          />
                        </div>
                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="department"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Department
                          </label>
                          <input
                            type="text"
                            name="department"
                            id="department"
                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Development"
                            required=""
                          />
                        </div>
                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="company"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Company
                          </label>
                          <input
                            type="number"
                            name="company"
                            id="company"
                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="123456"
                            required=""
                          />
                        </div>
                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="current-password"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Current Password
                          </label>
                          <input
                            type="password"
                            name="current-password"
                            id="current-password"
                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="••••••••"
                            required=""
                          />
                        </div>
                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="new-password"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            New Password
                          </label>
                          <input
                            type="password"
                            name="new-password"
                            id="new-password"
                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="••••••••"
                            required=""
                          />
                        </div>
                      </div>
                    </div>
                    {/* <!-- Modal footer --> */}
                    <div className="flex flex-col md:flex-row items-center p-6 rounded-b border-t border-gray-200 dark:border-gray-600 [&>*]:mx-6 [&>*]:my-3">
                      <Link href="/user/issues" className="w-full">
                        <ButtonSecondary
                          label="View Parent Issue"
                          onClick={(e) => ""}
                        />
                      </Link>
                      <ButtonPrimary label="Update Issue" onClick={(e) => ""} />
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    );
}
