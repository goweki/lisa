"use client";
import { useContext, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { DataContext } from "../providers";
import { useDate } from "@/lib/dateTime";
import { ButtonPrimary } from "@/components/atoms/buttons";
import { InputText } from "@/components/atoms/inputs";
import { SVGsearch } from "@/components/atoms/svgs";
import { dateShort } from "@/helpers/dateHandlers";

export default function TasksPage() {
  const [UIstate, setUIstate] = useState("loading");
  const { issues } = useContext(DataContext);
  const { rawDate } = useDate();
  const [searchPhrase, setSearchPhrase] = useState({ value: "", error: "" });
  const [pendingTasks, setPendings] = useState("");
  const [overdueTasks, setOverdues] = useState("");
  const [completeTasks, setCompletes] = useState("");
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

    //completes
    console.log(
      "> Issues with Completes: ",
      JSON.stringify(issues_withCompletetasks)
    );
    const completes = issues_withCompletetasks.map((issue) => {
      for (const dueDate of issue.dueDates) {
        return {
          issueId: issue._id,
          issueName: issue.name,
          issueType: issue.type,
          dueDate: dueDate.date,
          task: dueDate.task,
        };
      }
    });
    console.log("> Completes: ", JSON.stringify(completes));
    setCompletes(completes);
    //pendings
    console.log(
      "> Issues with inCompletes: ",
      JSON.stringify(issues_withIncompletetasks)
    );
    const pendings = issues_withIncompletetasks.map((issue) => {
      for (const dueDate of issue.dueDates) {
        return {
          issueId: issue._id,
          issueName: issue.name,
          issueType: issue.type,
          dueDate: dueDate.date,
          task: dueDate.task,
        };
      }
    });
    console.log("> Pendings: ", JSON.stringify(pendings));
    setPendings(pendings);
    //overdues
    if (pendings.length !== 0) {
      const overdues = pendings.filter(
        (pending) => new Date() > new Date(pending.dueDate)
      );
      setOverdues(overdues);
    }
    setUIstate("OK");
    //
  }, [issues, rawDateMemo]);
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
              <thead className="text-xs uppercase card">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Task
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Due date
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Issue-type
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* overdue TASKS */}
                {overdueTasks &&
                  overdueTasks.map((v, i) => (
                    <tr
                      key={i}
                      issueid={v.issueId}
                      className="border-b border-backg-raised dark:border-backg-dark-raised hover:bg-backg-raised dark:hover:bg-backg-dark-raised"
                    >
                      <th
                        scope="row"
                        className="flex px-6 py-4 whitespace-nowrap"
                      >
                        <div className="text-start ps-3">
                          <div className="font-semibold">{v.task.name}</div>
                          <div className="font-light text-neutral-500">
                            {v.issueName}
                          </div>
                          <div className="font-light text-xs text-neutral-500">
                            {v.issueType.category}, {v.issueType.type}
                          </div>
                        </div>
                      </th>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-2.5 w-2.5 rounded-full bg-red-500 me-2"></div>{" "}
                          overdue
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {dateShort(new Date(v.dueDate))}
                      </td>
                      <td className="px-6 py-4">
                        {/* <!-- Modal toggle --> */}
                        <a
                          href="#"
                          type="button"
                          data-modal-target="editUserModal"
                          data-modal-show="editUserModal"
                          className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                        >
                          Edit task
                        </a>
                      </td>
                    </tr>
                  ))}
                {/* almost-overdue TASKS*/}
                {pendingTasks.filter(
                  (pending) =>
                    new Date() < new Date(pending.dueDate) &&
                    (new Date(pending.dueDate) - new Date()) / 3600000 <= 3
                ).length
                  ? pendingTasks
                      .filter(
                        (pending) =>
                          new Date() < new Date(pending.dueDate) &&
                          (new Date(pending.dueDate) - new Date()) / 3600000 <=
                            3
                      )
                      .map((v, i) => (
                        <tr
                          key={i}
                          issueid={v.issueId}
                          className="border-b border-backg-raised dark:border-backg-dark-raised hover:bg-backg-raised dark:hover:bg-backg-dark-raised"
                        >
                          <th
                            scope="row"
                            className="flex px-6 py-4 whitespace-nowrap"
                          >
                            <div className="text-start ps-3">
                              <div className="font-semibold">{v.task.name}</div>
                              <div className="font-light text-neutral-500">
                                {v.issueName}
                              </div>
                              <div className="font-light text-xs text-neutral-500">
                                {v.issueType.category}, {v.issueType.type}
                              </div>
                            </div>
                          </th>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="h-2.5 w-2.5 rounded-full bg-yellow-500 me-2"></div>{" "}
                              late
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {dateShort(new Date(v.dueDate))}
                          </td>
                          <td className="px-6 py-4">
                            {/* <!-- Modal toggle --> */}
                            <a
                              href="#"
                              type="button"
                              data-modal-target="editUserModal"
                              data-modal-show="editUserModal"
                              className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                            >
                              Edit task
                            </a>
                          </td>
                        </tr>
                      ))
                  : null}
                {/* due TASKS*/}
                {pendingTasks.filter(
                  (pending) =>
                    (new Date(pending.dueDate) - new Date()) / 3600000 > 3
                ).length
                  ? pendingTasks
                      .filter(
                        (pending) =>
                          (new Date(pending.dueDate) - new Date()) / 3600000 > 3
                      )
                      .map((v, i) => (
                        <tr
                          key={i}
                          issueid={v.issueId}
                          className="border-b border-backg-raised dark:border-backg-dark-raised hover:bg-backg-raised dark:hover:bg-backg-dark-raised"
                        >
                          <th
                            scope="row"
                            className="flex px-6 py-4 whitespace-nowrap"
                          >
                            <div className="text-start ps-3">
                              <div className="font-semibold">{v.task.name}</div>
                              <div className="font-light text-neutral-500">
                                {v.issueName}
                              </div>
                              <div className="font-light text-xs text-neutral-500">
                                {v.issueType.category}, {v.issueType.type}
                              </div>
                            </div>
                          </th>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 me-2"></div>{" "}
                              pending
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {" "}
                            {dateShort(new Date(v.dueDate))}
                          </td>
                          <td className="px-6 py-4">
                            {/* <!-- Modal toggle --> */}
                            <a
                              href="#"
                              type="button"
                              data-modal-target="editUserModal"
                              data-modal-show="editUserModal"
                              className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                            >
                              Edit task
                            </a>
                          </td>
                        </tr>
                      ))
                  : null}
              </tbody>
            </table>
            {/* <!-- Edit user modal --> */}
            <div
              id="editUserModal"
              tabIndex="-1"
              aria-hidden="true"
              className="fixed top-0 left-0 right-0 z-50 items-center justify-center hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
            >
              <div className="relative w-full max-w-2xl max-h-full">
                {/* <!-- Modal content --> */}
                <form className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                  {/* <!-- Modal header --> */}
                  <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Edit user
                    </h3>
                    <button
                      type="button"
                      className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                      data-modal-hide="editUserModal"
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
                  <div className="flex items-center p-6 space-x-3 rtl:space-x-reverse border-t border-gray-200 rounded-b dark:border-gray-600">
                    <button
                      type="submit"
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Save all
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
}
