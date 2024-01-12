"use client";
import { useDate } from "@/lib/dateTime";
import { ButtonSecondary } from "@/components/atoms/buttons";
import { SVGtime } from "@/components/atoms/svgs";

export default function UserHome() {
  const { date, time } = useDate();
  // render
  return (
    <main className="flex flex-col flex-grow items-center p-4">
      <div className="w-full max-w-screen-lg grid grid-flow-row-dense grid-cols-1 m-4 gap-4 md:grid-cols-2">
        {profileCard(date, time)}
        {scheduleBrief()}
      </div>
    </main>
  );
}

function scheduleBrief() {
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
              Client
            </th>
            <th scope="col" className="px-1 py-3">
              Category
            </th>
            <th scope="col" className="px-1 py-3">
              Start
            </th>
          </tr>
        </thead>
        <tbody>
          {issues.map((v, i) => {
            return (
              <tr
                key={i}
                className="border-b border-gray-300 dark:border-gray-800 hover:bg-background-raised dark:hover:bg-background-dark-raised "
              >
                <th scope="row" className="px-1 py-2 whitespace-nowrap">
                  {v.name}
                </th>
                <td className="px-1 py-2">{v.client}</td>
                <td className="px-1 py-2">{v.category}</td>
                <td className="px-1 py-2">{v.startDate}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function profileCard(date, time) {
  return (
    <div className="card m-auto max-w-lg w-full border-1 flex flex-col justify-between leading-normal">
      <div className="grid-cols-1">
        <p className="text-sm flex justify-center">
          <SVGtime className="w-4 h-4 mr-2 text-emerald-500" />
          {date()} {time()}
        </p>
        <p className="font-bold text-xl mt-2 mb-4 text-center">
          Your schedule is clean
        </p>
        <div className="text-base text-font-faded dark:text-font-dark-faded">
          <p>3 pending issues</p>
          <ul className="list-disc text-sm pl-6 pt-1">
            {["i231023-divorce", "i231027-electoral", "i231031-property"].map(
              (v, i) => {
                return (
                  <li key={i}>
                    <span className="truncate">{v}</span>
                  </li>
                );
              }
            )}
          </ul>
        </div>
        <div className="mt-6 mb-2 mx-4">
          <ButtonSecondary label="view schedule" />
        </div>
      </div>
    </div>
  );
}

const issues = [
  {
    name: "div-Andeyo-2305",
    client: "Betty Andeyo",
    category: "Marital",
    startDate: "23-05-2023",
  },
  {
    name: "land-Onyeiti-2305",
    client: "Albart Onyeiti",
    category: "Property",
    startDate: "12-03-2023",
  },
];
