import Link from "next/link";

export default function CardIssue({ item, icon: Icon }) {
  return (
    <Link
      href={`/user/issues/${item._id}`}
      className="card hover:scale-105 m-0 flex flex-col p-6 space-y-6 lg:p-8 lg:flex-row lg:space-y-0 lg:space-x-6 shadow dark:shadow-backg-dark hover:shadow-lg"
    >
      <div className="flex items-center justify-center w-16 h-16 lg:h-20 lg:w-20">
        <Icon className="w-12 h-12 text-emerald-500" />
      </div>
      <div className="flex-1">
        <h5 className="mb-3 text-xl font-bold lg:text-2xl">{item.name}</h5>
        <div className="mb-6 text-lg ">
          <p>
            A {item.type.type} by {item.source.name} for {item.type.category}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
              className={`bg-slate-500 h-2.5 rounded-full w-${
                item.status.status === "complete"
                  ? "w-full"
                  : item.dueDates?.filter((v) => v.task.status).length === 0 ||
                    item.dueDates?.length === 0
                  ? "0"
                  : item.dueDates?.filter((v) => v.task.status).length < 3
                  ? "1/3"
                  : item.dueDates?.filter((v) => v.task.status).length < 4
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
