"use client";
import { useContext, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDate } from "@/lib/dateTime";
import { ButtonPrimary, ButtonSecondary } from "@/components/atoms/buttons";
import { SVGtime } from "@/components/atoms/svgs";
import { DataContext } from "./providers";
import { isDatePassed } from "@/helpers/dateHandlers";

export default function UserHome() {
  const router = useRouter();
  const [overdues, setOverdues] = useState("");
  const { date, time, rawDate } = useDate();
  const { issues } = useContext(DataContext);
  //useEffects
  const rawDateMemo = useCallback(() => rawDate(), []);
  useEffect(() => {
    const _overdues = issues
      .map((issue) => {
        return {
          ...issue,
          dueDates: issue.dueDates?.filter(
            (obj) => !obj.task.complete && isDatePassed(new Date(obj.date))
          ),
        };
      })
      .filter((issue) => issue.dueDates?.length > 0);
    setOverdues(_overdues);
  }, [issues, rawDateMemo]);

  // render
  return (
    <main className="flex flex-col flex-grow items-center px-4">
      <div className="w-full max-w-screen-lg grid grid-flow-row-dense grid-cols-1 m-4 gap-4 md:grid-cols-2">
        {profileCard(date, time, overdues)}
        {scheduleBrief(issues, router)}
      </div>
    </main>
  );
}

function profileCard(date, time, data_) {
  return (
    <div className="card m-auto max-w-lg w-full h-full border-1 flex flex-col leading-normal">
      <div className="grid-cols-1 m-2">
        <div className="text-sm flex justify-center items-center">
          <SVGtime className="w-4 h-4 mr-2 text-emerald-900" />
          {date()} {time()}
        </div>
        <p
          className={`font-bold text-xl mt-2 mb-4 text-center ${
            !data_.length
              ? "text-emerald-500"
              : data_.length < 3
              ? "text-red-600 dark:text-red-300"
              : "text-red-500"
          }`}
        >
          {!data_.length
            ? "Your schedule is clean"
            : data_.length < 3
            ? "You have overdue tasks"
            : "Your schedule is piling up!"}
        </p>
        <div className="text-base text-font-faded dark:text-font-dark-faded">
          <p
            className={`text-center ${
              data_.length < 1
                ? ""
                : data_.length < 3
                ? "text-red-800 dark:text-red-200"
                : "text-red-500"
            }`}
          >
            {data_.length} issue{data_.length !== 1 && <>s</>} has pending tasks
          </p>
          <ul className="hidden sm:block list-disc text-sm pl-6 pt-1">
            {data_ &&
              data_.map((v, i) => {
                return (
                  <li key={i}>
                    <span>
                      {v.name}, has passed deadlines for{" "}
                      <span className="font-bold">
                        {v.dueDates?.map((dDate) => dDate.task.name + " ,")}
                      </span>
                    </span>
                  </li>
                );
              })}
          </ul>
        </div>
        <div className="mt-6 mb-2 mx-4 space-y-4">
          {data_.length !== 0 && (
            <div>
              <Link href="/user/tasks">
                <ButtonPrimary label="View Tasks" onClick={() => ""} />
              </Link>
            </div>
          )}
          <div>
            <Link href="/user/issues/new">
              <ButtonSecondary label="New Issue" onClick={() => ""} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function scheduleBrief(data_, router) {
  return (
    <div className="card m-auto max-w-lg w-full h-full border-1 flex flex-col leading-normal p-2 md:p-4">
      <div className="flex items-center justify-start">
        <h5 className="text-xl font-bold leading-none">Active Issues</h5>
        <div className="ml-4">
          <Link
            href="/user/issues"
            className="text-sm text-emerald-600 hover:underline dark:text-emerald-400"
          >
            View all
          </Link>
        </div>
      </div>
      <table className="mt-2 w-full text-xs text-left">
        <thead className="rounded uppercase border-b border-gray-500">
          <tr>
            <th scope="col" className="px-1 py-3">
              Issue
            </th>
            <th scope="col" className="px-1 py-3">
              Source
            </th>
            <th scope="col" className="px-1 py-3">
              Category
            </th>
            <th scope="col" className="px-1 py-3">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {data_.length > 0 ? (
            data_.map((v, i) => {
              return (
                <tr
                  key={i}
                  className="border-b border-gray-300 dark:border-gray-800 hover:bg-backg-raised dark:hover:bg-backg-dark-raised cursor-pointer"
                  onClick={() => router.push(`/user/issues/${v._id}`)}
                >
                  <th scope="row" className="px-1 py-2 whitespace-nowrap">
                    {v.name}
                  </th>
                  <td className="px-1 py-2">{v.source.name}</td>
                  <td className="px-1 py-2">{v.type.category}</td>
                  <td className="px-1 py-2">{v.status.status}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={4} className="text-center py-6 italic">
                No active issues found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
