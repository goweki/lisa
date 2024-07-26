import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export function CardInstitution({ item, icon }) {
  return (
    <BaseCardBrief item={item} baseLink="/dashboard/institutions" icon={icon} />
  );
}

export function CardCase({ item, icon }) {
  return <BaseCardBrief item={item} baseLink="/dashboard/cases" icon={icon} />;
}

export function CardItemsTable({ title, data, pageLink }) {
  if (!data || data.length === 0) {
    return (
      <div className="card m-0 grid place-items-center">
        <span className="m-auto italic opacity-50">
          No {title} data available
        </span>
      </div>
    );
  }
  const headers = Object.keys(data[0]).filter((key) => key !== "id");

  return (
    <div className="card min-h-60 max-h-80 overflow-x-auto m-auto max-w-lg w-full h-full border-1 flex flex-col leading-normal p-2 md:p-4">
      <div className="flex items-center justify-start">
        {title && <h5 className="text-xl font-bold leading-none">{title}</h5>}
        <div className="ml-4">
          {pageLink && (
            <Link
              href={pageLink}
              className="text-sm text-emerald-600 hover:underline dark:text-emerald-400"
            >
              View all
            </Link>
          )}
        </div>
      </div>
      <table className="mt-2 w-full text-xs text-left">
        <thead className="rounded uppercase border-b border-gray-500">
          <tr>
            {headers.map((header, i) => (
              <th key={i} scope="col" className="px-1 py-3">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="overflow-y-auto">
          {data?.length > 0 &&
            data.map((row, i) => (
              <tr
                key={row.id}
                className="border-b border-gray-300 dark:border-gray-800 hover:bg-backg-raised dark:hover:bg-backg-dark-raised"
              >
                {headers.map((header, index) =>
                  index === 0 ? (
                    <th
                      key={header}
                      scope="row"
                      className="px-1 py-2 whitespace-nowrap"
                    >
                      {row[header]}
                    </th>
                  ) : (
                    <td key={header} className="px-1 py-2">
                      {Array.isArray(row[header]) ? (
                        row[header].map((item, subIndex) => (
                          <span
                            key={subIndex}
                            className={`block ${subIndex !== 0 && "italic"}`}
                          >
                            {item}
                          </span>
                        ))
                      ) : (
                        <span className="block">{row[header]}</span>
                      )}
                    </td>
                  )
                )}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

function BaseCardBrief({ item, baseLink, icon: Icon }) {
  return (
    <Link
      href={`${baseLink}/${item.id}`}
      className="card hover:scale-105 m-0 flex flex-col p-6 space-y-6 lg:p-8 lg:flex-row lg:space-y-0 lg:space-x-6 shadow dark:shadow-backg-dark hover:shadow-lg"
    >
      <div className="flex items-center justify-center w-16 h-16 lg:h-20 lg:w-20">
        <Icon className="w-12 h-12 text-emerald-500" />
      </div>
      <div className="flex-1">
        <h5 className="mb-3 text-xl font-bold lg:text-2xl">{item.name}</h5>
        <div className="mb-6 text-lg ">
          <p>{item.type}</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
              className={`bg-slate-500 h-2.5 rounded-full w-${
                item.completedBy
                  ? "w-full"
                  : item.tasks?.filter((v) => v.completedBy).length === 0 ||
                    item.tasks?.length === 0
                  ? "0"
                  : item.tasks?.filter((v) => v.completedBy).length < 3
                  ? "1/3"
                  : item.tasks?.filter((v) => v.completedBy).length < 4
                  ? "2/3"
                  : "3/3"
              }/`}
            ></div>
          </div>
        </div>
        <span className="flex items-baseline text-lg font-bold text-emerald-700 dark:text-emerald-400">
          View details
          <svg
            className="w-4 h-4 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            ></path>
          </svg>
        </span>
      </div>
    </Link>
  );
}
