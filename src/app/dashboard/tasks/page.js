"use client";
import { useContext, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
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
import { Loader1 } from "@/components/atoms/loader";

export default function TasksPage() {
  const [UIstate, setUIstate] = useState("loading");
  const {
    data: { cases },
  } = useContext(DataContext);
  const { rawDate } = useDate();
  const [searchPhrase, setSearchPhrase] = useState({ value: "", error: "" });
  const [tasks, setTasks] = useState([]);
  const [filtTasks, setFiltTasks] = useState([]);
  const [selectedTask, setSelected] = useState(null);
  const [fileUpload, setFileUpload] = useState(null);
  const rawDateMemo = useCallback(() => rawDate(), []);

  useEffect(() => {
    //onMount / onUpdate- set task by categories
    const cases_withCompletetasks = cases
      .filter((case_) => case_.status.status === "open")
      .map((case_) => {
        return {
          _id: case_._id,
          name: case_.name,
          type: case_.type,
          dueDates: case_.dueDates?.filter((obj) => obj.task.complete),
        };
      })
      .filter((case_) => case_.dueDates?.length);

    const cases_withIncompletetasks = cases
      .filter((case_) => case_.status.status === "open")
      .map((case_) => {
        return {
          _id: case_._id,
          name: case_.name,
          type: case_.type,
          dueDates: case_.dueDates?.filter((obj) => !obj.task.complete),
        };
      })
      .filter((case_) => case_.dueDates?.length);
    // incomplete tasks
    const inCompletes_2d = cases_withIncompletetasks.map((case_) => {
      const innerIncompletes = case_.dueDates?.map((dueDate) => {
        return {
          caseId: case_._id,
          caseName: case_.name,
          caseType: case_.type,
          dueDate: dueDate.date,
          task: dueDate.task,
        };
      });
      return innerIncompletes;
    });
    const inCompletes = inCompletes_2d.flat();
    if (inCompletes.length > 0) {
      // incomplete categories
      const overdues = inCompletes.filter((task) =>
        isDatePassed(new Date(task.dueDate))
      );
      const almostOverdue = inCompletes.filter(
        (task) =>
          !isDatePassed(new Date(task.dueDate)) &&
          hoursDifference(new Date(task.dueDate), rawDateMemo()) < 72
      );
      const pending = inCompletes.filter(
        (task) =>
          !isDatePassed(new Date(task.dueDate)) &&
          hoursDifference(new Date(task.dueDate), rawDateMemo()) > 72
      );
      setTasks([]);
      // if overdues
      if (overdues.length)
        setTasks((prev) => [
          ...prev,
          ...overdues.map((item) => ({ ...item, status: "overdue" })),
        ]);
      // if almost overdue
      if (almostOverdue.length)
        setTasks((prev) => [
          ...prev,
          ...almostOverdue.map((item) => ({ ...item, status: "late" })),
        ]);
      //if pending
      if (pending.length)
        setTasks((prev) => [
          ...prev,
          ...pending.map((item) => ({ ...item, status: "pending" })),
        ]);
    }
    //complete tasks
    const completes_2d = cases_withCompletetasks.map((case_) => {
      const innerCompletes = case_.dueDates?.map((dueDate) => {
        return {
          caseId: case_._id,
          caseName: case_.name,
          caseType: case_.type,
          dueDate: dueDate.date,
          task: dueDate.task,
        };
      });
      return innerCompletes;
    });
    const completes = completes_2d.flat();
    if (completes.length)
      setTasks((prev) => [
        ...prev,
        ...completes.map((item) => ({ ...item, status: "complete" })),
      ]);
    // setTasks(completes.map((item) => ({ ...item, status: "complete" })));
    //stop loading
    setUIstate("OK");
    //
  }, [cases, rawDateMemo]);
  //filter tasks by searchPhrase
  useEffect(() => {
    setFiltTasks(
      tasks?.filter(
        ({ caseName, caseType, task }) =>
          caseName.toLowerCase().includes(searchPhrase.value?.toLowerCase()) ||
          caseType.category
            .toLowerCase()
            .includes(searchPhrase.value?.toLowerCase()) ||
          task.name.toLowerCase().includes(searchPhrase.value?.toLowerCase())
      )
    );
  }, [searchPhrase, tasks]);
  //
  //render
  return UIstate === "OK" ? (
    <main className="flex flex-col flex-grow items-center px-4">
      <div className="max-w-screen-lg py-6 mx-auto px-4 lg:px-6 w-full">
        <div className="space-y-2 md:space-y-5 mb-4">
          <h1 className="text-center uppercase">Tasks</h1>
          <div className="relative max-w-lg mx-auto grid grid-cols-1 gap-4 card pt-3 pb-6 px-12">
            {/* <div className="relative max-w-lg mx-auto grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 card pt-3 pb-6 px-12"> */}
            {/* <div className="md:order-last pt-2">
              <Link href="/dashboard/cases/new">
                <ButtonPrimary label="+new Case" onClick={() => ""} />
              </Link>
            </div> */}
            <div>
              <InputText
                name="searchPhrase"
                valObj={searchPhrase}
                setValue={setSearchPhrase}
                placeholder="Search for tasks by name, case..."
                icon={SVGsearch}
              />
            </div>
          </div>
        </div>
        <div className="relative overflow-x-auto">
          {tasks.length > 0 ? (
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
                {/* TASKS */}
                {filtTasks.length > 0 &&
                  filtTasks.map((v, i) => (
                    <tr
                      key={i}
                      className="border-b border-backg-raised dark:border-backg-dark-raised hover:bg-backg-raised dark:hover:bg-backg-dark-raised"
                    >
                      {listItem(v)}
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-6 italic">
              No existing tasks found
            </div>
          )}
          {/* <!-- editTaskModal --> */}
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
                  <div className="flex items-start justify-between p-4 border-b rounded-t border-gray-100 dark:border-gray-600">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        <span className="font-normal">Task: </span>
                        {selectedTask.task.name}
                      </h3>
                      <Link
                        href={`/dashboard/cases/${selectedTask.caseId}/${selectedTask.task.name}`}
                      >
                        <button
                          type="button"
                          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-emerald-500 rounded-lg text-sm ms-auto inline-block justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                          onClick={() => ""}
                        >
                          Go to task
                        </button>
                      </Link>
                    </div>
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
                  {/* <!-- task details --> */}
                  <div className="py-6 px-12 md:px-16">
                    <ul className="grid grid-cols-6 gap-6 [&>*]:col-span-6 [&>*]:md:col-span-3">
                      <li className="flex flex-col">
                        <div className="text-xs">
                          <span className="text-emerald-900 dark:text-emerald-100 border-b border-emerald-900 dark:border-emerald-100">
                            Parent case:
                          </span>
                        </div>
                        <div className="flex h-full items-start py-1 px-3 text-base">
                          {`${selectedTask.caseType.category}, ${selectedTask.caseType.type} - ${selectedTask.caseName}`}
                        </div>
                      </li>
                      <li className="flex flex-col">
                        <div className="text-xs">
                          <span className="text-emerald-900 dark:text-emerald-100 border-b border-emerald-900 dark:border-emerald-100">
                            Due date:
                          </span>
                        </div>
                        <div className="flex h-full items-start py-1 px-3 text-base">
                          <div className="flex h-full items-center justify-center">
                            <div
                              className={`h-2.5 w-2.5 rounded-full ${
                                selectedTask.status === "overdue"
                                  ? "bg-red-500"
                                  : selectedTask.status === "late"
                                  ? "bg-yellow-500"
                                  : selectedTask.status === "pending"
                                  ? "bg-blue-500"
                                  : selectedTask.status === "complete"
                                  ? "bg-green-500"
                                  : "bg-neutral-500"
                              } me-2`}
                            ></div>
                          </div>
                          <div className="my-auto">
                            {dateShort(new Date(selectedTask.dueDate))}
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                  {/* <!-- task doc upload --> */}
                  <div className="flex items-center p-6 rounded-b border-t border-gray-100 dark:border-gray-600">
                    {selectedTask.task.complete ? (
                      <>completed</>
                    ) : (
                      <span className="text-red-700 dark:text-red-200">
                        This task is incomplete
                      </span>
                    )}
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  ) : (
    <Loader1 />
  );
  //funcs
  function listItem(task) {
    return (
      <>
        <th scope="row" className="flex px-6 py-4 whitespace-nowrap">
          <div className="text-start ps-3">
            <div className="font-semibold">{task.task.name}</div>
            <div className="font-light text-neutral-500">{task.caseName}</div>
            <div className="font-light text-xs text-neutral-500">
              {task.caseType.category}, {task.caseType.type}
            </div>
          </div>
        </th>
        <td className="px-6 py-4">
          <div className="flex items-center">
            <div
              className={`h-2.5 w-2.5 rounded-full ${
                task.status === "overdue"
                  ? "bg-red-500"
                  : task.status === "late"
                  ? "bg-yellow-500"
                  : task.status === "pending"
                  ? "bg-blue-500"
                  : task.status === "complete"
                  ? "bg-green-500"
                  : "bg-slate-500"
              } me-2`}
            ></div>{" "}
            {task.status}
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
}
