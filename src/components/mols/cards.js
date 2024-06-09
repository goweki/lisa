import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export function CardCase({ item, icon }) {
  return <BaseCardLarge item={item} baseLink="/dashboard/cases" icon={icon} />;
}
export function CardInstitution({ item, icon }) {
  return (
    <BaseCardLarge item={item} baseLink="/dashboard/institutions" icon={icon} />
  );
}

export function CardTable({ title, data, baseLink, linkRows, showViewAll }) {
  const { headings, series } = data;
  const router = useRouter();
  const [series_, setSeries] = useState("");
  useEffect(() => {
    const arr = series.map((item) => {
      const values = Object.values(item).map((value) => {
        // If the value is an object, extract its values
        if (typeof value === "object") {
          return Object.values(value);
        } else return value;
      });
      // return values.flat(); // Flatten the array to remove nested arrays
      return values;
    });
    setSeries(arr);
  }, [series]);
  return (
    <div className="card overflow-x-auto m-auto max-w-lg w-full h-full border-1 flex flex-col leading-normal p-2 md:p-4">
      <div className="flex items-center justify-start">
        {title && <h5 className="text-xl font-bold leading-none">{title}</h5>}
        <div className="ml-4">
          {showViewAll && (
            <Link
              href={baseLink}
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
            {headings.map((v, i) => (
              <th key={i} scope="col" className="px-1 py-3">
                {v}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {series_?.length > 0 ? (
            series_.map((v) => {
              return (
                <tr
                  key={v[0]}
                  className="border-b border-gray-300 dark:border-gray-800 hover:bg-backg-raised dark:hover:bg-backg-dark-raised cursor-pointer"
                  onClick={
                    linkRows
                      ? () => router.push(`${baseLink}/${v.id}`)
                      : () => ""
                  }
                >
                  <th scope="row" className="px-1 py-2 whitespace-nowrap">
                    {v[1]}
                  </th>
                  <td className="px-1 py-2">
                    {/* <span className="block">{v.type}</span> */}
                    {/* <span className="block">{v.type}</span> */}
                    {v[2]}
                  </td>
                  <td className="px-1 py-2">
                    {typeof v[3] === "object" ? (
                      <>
                        <span className="block">{v[3][0]}</span>
                        <span className="block">{v[3][1]}</span>
                      </>
                    ) : (
                      <span className="block">{v[3]}</span>
                    )}
                  </td>
                  <td className="px-1 py-2">{v[4]}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={4} className="text-center py-6 italic">
                No active cases found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function BaseCardLarge({ item, baseLink, icon: Icon }) {
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
