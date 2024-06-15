"use client";
import { useContext, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { DataContext } from "../providers";
import { ButtonPrimary, ButtonSecondary } from "@/components/atoms/buttons";
import { InputText } from "@/components/atoms/inputs";
import { SVGsearch } from "@/components/atoms/svgs";
import { dateShort, isDatePassed } from "@/helpers/dateHandlers";
import { Loader1 } from "@/components/atoms/loader";

export default function TasksPage() {
  const [UIstate, setUIstate] = useState("");
  const {
    data: { cases, institutions },
  } = useContext(DataContext);
  const [searchPhrase, setSearchPhrase] = useState({ value: "", error: "" });
  const [tasks, setTasks] = useState([]);
  const [filtTasks, setFiltTasks] = useState([]);
  const [selectedTask, setSelected] = useState("");
  const [fileUpload, setFileUpload] = useState("");

  useEffect(() => {
    //onMount / onUpdate- set tasks with completion status:completed,due,overdue
    const _tasks = cases.reduce((acc, case_) => {
      let caseTasks = [];
      for (const task of case_.tasks) {
        caseTasks.push({
          ...task,
          case: case_.name,
          status: task.completedByID
            ? "completed"
            : isDatePassed(new Date(task.dueDate))
            ? "overdue"
            : "due",
          lawyer: case_.lawyer || "",
        });
      }
      return [...acc, ...caseTasks];
    }, []);
    setTasks(_tasks);
    setUIstate("OK");
    //
  }, [cases]);
  //filter tasks by searchPhrase
  useEffect(() => {
    !searchPhrase.value
      ? setFiltTasks(tasks)
      : setFiltTasks(
          tasks.filter(
            (task) =>
              task.name.includes(searchPhrase.value) ||
              task.case.includes(searchPhrase.value) ||
              task.type.includes(searchPhrase.value)
          )
        );
  }, [searchPhrase.value, tasks]);
  //
  //render
  return !UIstate ? (
    <Loader1 />
  ) : (
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
                    Type
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
                {filtTasks.length > 0 ? (
                  filtTasks.map((task) => (
                    <tr
                      key={task.id}
                      className="border-b border-backg-raised dark:border-backg-dark-raised hover:bg-backg-raised dark:hover:bg-backg-dark-raised"
                    >
                      <th
                        scope="row"
                        className="flex px-6 py-4 whitespace-nowrap"
                      >
                        <div className="text-start">
                          <div className="font-semibold">{task.name}</div>
                          <div className="font-light text-neutral-500">
                            {task.case}
                          </div>
                          <div className="font-light text-neutral-500">
                            {task.lawyer ? (
                              task.lawyer
                            ) : (
                              <span className="italic text-xs">
                                not assigned
                              </span>
                            )}
                          </div>
                        </div>
                      </th>
                      <td className="px-6 py-4">{task.type}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div
                            className={`h-2.5 w-2.5 rounded-full ${
                              task.status === "overdue"
                                ? "bg-red-500"
                                : task.status === "due"
                                ? "bg-blue-500"
                                : task.status === "complete"
                                ? "bg-green-500"
                                : "bg-slate-500"
                            } me-2`}
                          ></div>{" "}
                          {task.status}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {dateShort(new Date(task.dueDate))}
                      </td>
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
                    </tr>
                  ))
                ) : (
                  <tr className="italic">
                    <td colSpan="5" className="p-3 text-center">
                      No tasks matching filter
                    </td>
                  </tr>
                )}
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
              className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full bg-backg/50 dark:bg-backg-dark/50 backdrop-blur-lg"
            >
              <div className="relative w-full max-w-2xl max-h-full">
                {/* <!-- Modal content --> */}
                <form className="card relative">
                  {/* <!-- Modal header --> */}
                  <div className="flex items-start justify-between p-4 border-b rounded-t border-gray-100 dark:border-gray-600">
                    <div>
                      <h3 className="text-xl font-bold">Task</h3>
                    </div>
                    <button
                      type="button"
                      className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-red-500 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                      data-modal-hide="editTaskModal"
                      onClick={() => setSelected("")}
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
                    <ul className="grid grid-cols-6 gap-6 [&>*]:col-span-6 [&>*]:md:col-span-3 [&>*:last-child]:col-span-6">
                      <li className="flex flex-col">
                        <div className="text-xs">
                          <span className="text-gray-500">Task name</span>
                        </div>
                        <div className="flex h-full items-start py-1 text-base">
                          {selectedTask.name}
                        </div>
                      </li>
                      <li className="flex flex-col">
                        <div className="text-xs">
                          <span className="text-gray-500"> Parent case:</span>
                        </div>
                        <div className="flex h-full items-start py-1 text-base">
                          {selectedTask.case}
                        </div>
                      </li>
                      <li className="flex flex-col">
                        <div className="text-xs">
                          <span className="text-gray-500"> Type</span>
                        </div>
                        <div className="flex h-full items-start py-1 text-base">
                          {selectedTask.type}
                        </div>
                      </li>
                      <li className="flex flex-col">
                        <div className="text-xs">
                          <span className="text-gray-500"> Due date:</span>
                        </div>
                        <div className="flex h-full items-start py-1 text-base">
                          <div className="flex h-full items-center justify-center">
                            <div
                              className={`h-2.5 w-2.5 rounded-full ${
                                selectedTask.status === "overdue"
                                  ? "bg-red-500"
                                  : selectedTask.status === "due"
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
                      <li className="flex flex-col">
                        <div className="text-xs">
                          <span className="text-gray-500"> Description</span>
                        </div>
                        <div className="flex h-full items-start py-1 text-base">
                          {selectedTask.description}
                        </div>
                      </li>
                    </ul>
                  </div>
                  {/* <!-- task doc upload --> */}
                  <div className="flex items-center justify-between p-6 rounded-b border-t border-gray-100 dark:border-gray-600">
                    {selectedTask.status === "complete" ? (
                      <>completed</>
                    ) : (
                      <span className="text-red-700 dark:text-red-200">
                        This task is incomplete
                      </span>
                    )}
                    <Link
                      href={`/dashboard/cases/${selectedTask.caseID}/${selectedTask.id}`}
                    >
                      <button
                        type="button"
                        className="text-gray-400 bg-transparent hover:text-emerald-500 rounded-lg text-sm ms-auto inline-block justify-center items-center"
                        onClick={() => ""}
                      >
                        Edit Task
                      </button>
                    </Link>
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
