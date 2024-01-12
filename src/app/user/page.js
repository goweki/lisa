"use client";
import { useContext, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useDate } from "@/lib/dateTime";
import { ButtonSecondary } from "@/components/atoms/buttons";
import { SVGtime } from "@/components/atoms/svgs";
import { DataContext } from "./providers";

export default function UserHome() {
  const [overdues, setOverdues] = useState("");
  const { date, time, rawDate } = useDate();
  const data = useContext(DataContext);
  // const overdues = data.filter(
  //   (issue) => new Date(issue.dueDates.date) > rawDate()
  // );
  const rawDateMemo = useCallback(() => rawDate(), []);
  useEffect(() => {
    const _overdues = data
      .map((issue) => {
        return {
          ...issue,
          dueDates: issue.dueDates.filter(
            (obj) =>
              obj.task.status.length < 1 && rawDateMemo() > new Date(obj.date)
          ),
        };
      })
      .filter((issue) => issue.dueDates.length !== 0);
    setOverdues(_overdues);
  }, [data, rawDateMemo]);

  // render
  return (
    <main className="flex flex-col flex-grow items-center p-4">
      <div className="w-full max-w-screen-lg grid grid-flow-row-dense grid-cols-1 m-4 gap-4 md:grid-cols-2">
        {profileCard(date, time, overdues)}
        {scheduleBrief(data)}
      </div>
    </main>
  );
}

function profileCard(date, time, data_) {
  return (
    <div className="card m-auto max-w-lg w-full border-1 flex flex-col justify-between leading-normal">
      <div className="grid-cols-1 m-4">
        <div className="text-sm flex justify-center items-center">
          <SVGtime className="w-4 h-4 mr-2 text-emerald-900" />
          {date()} {time()}
        </div>
        <p
          className={`font-bold text-xl mt-2 mb-4 text-center ${
            data_.length < 1
              ? "text-emerald-500"
              : data_.length < 3
              ? "text-red-800 dark:text-red-200"
              : "text-red-500"
          }`}
        >
          {data_.length < 1
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
            {data_.length} pending issue{data_.length > 1 && <>s</>}
          </p>
          <ul className="hidden sm:block list-disc text-sm pl-6 pt-1">
            {data_ &&
              data_.map((v, i) => {
                return (
                  <li key={i}>
                    <span>
                      {v.name}, has passed deadlines for{" "}
                      <span className="font-bold">
                        {v.dueDates.map((dDate) => dDate.task.name + " ,")}
                      </span>
                    </span>
                  </li>
                );
              })}
          </ul>
        </div>
        <div className="mt-6 mb-2 mx-4">
          <Link href="/user/new-issue">
            <ButtonSecondary label="New Issue" onClick={() => ""} />
          </Link>
        </div>
      </div>
    </div>
  );
}

function scheduleBrief(data_) {
  return (
    <div className="card m-auto w-full h-full border-1 justify-between leading-normal">
      <div className="flex items-center justify-between">
        <h5 className="text-xl font-bold leading-none">Active Issues</h5>
        <a
          href="#"
          className="text-sm text-blue-600 hover:underline dark:text-blue-500"
        >
          View all
        </a>
      </div>
      <table className="w-full text-xs text-left text-gray-500 dark:text-gray-400">
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
          {data_ &&
            data_.map((v, i) => {
              return (
                <tr
                  key={i}
                  className="border-b border-gray-300 dark:border-gray-800 hover:bg-background-raised dark:hover:bg-background-dark-raised "
                >
                  <th scope="row" className="px-1 py-2 whitespace-nowrap">
                    {v.name}
                  </th>
                  <td className="px-1 py-2">{v.petitioner.name}</td>
                  <td className="px-1 py-2">{v.type.category}</td>
                  <td className="px-1 py-2">{v.status.status}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
