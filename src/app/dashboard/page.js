"use client";
import { useContext, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDate } from "@/lib/dateTime";
import { ButtonPrimary, ButtonSecondary } from "@/components/atoms/buttons";
import { CardTable } from "@/components/mols/cards";
import { SVGtime } from "@/components/atoms/svgs";
import { DataContext } from "./providers";
import { isDatePassed } from "@/helpers/dateHandlers";

export default function UserHome() {
  const router = useRouter();
  const [overdues, setOverdues] = useState("");
  const [briefs, setBriefs] = useState({});
  const { date, time, rawDate } = useDate();
  const {
    data: { cases, institutions, caseTypes, users },
  } = useContext(DataContext);
  //onMount or //cases
  useEffect(() => {
    const _overdues = cases
      .map((case_) => {
        return {
          ...case_,
          dueDates: case_.dueDates?.filter(
            (obj) => !obj.task.complete && isDatePassed(new Date(obj.date))
          ),
        };
      })
      .filter((case_) => case_.dueDates?.length > 0);
    setOverdues(_overdues);
    const caseBrief = {
      headings: ["Case", "Case Type", "Client", "Status"],
      series: cases
        .filter((_case) => _case.status === "open")
        .slice(0, 8)
        .map((_case) => ({
          id: _case.id,
          case: _case.name,
          type: _case.type,
          client: {
            clientName: _case.clientName,
            clientParty: _case.clientParty,
          },
          status: _case.status,
        })),
    };
    const usersBrief = {
      headings: ["Email", "Name", "Role", "Institution"],
      series: users.map((user_) => ({
        id: user_.id,
        email: user_.email,
        name: user_.name,
        role: user_.role,
        institutions: user_.institutions.map((inst) => inst.name).join(", "),
      })),
    };
    const caseTypesBrief = {
      headings: ["Name", "Type", "primaryParty", "secondaryParty"],
      series: caseTypes.map((_type) => ({
        id: _type.id,
        name: _type.name,
        description: _type.name.trim().split(" ").pop(),
        "Primary-Party": _type.primaryParty,
        "Secondary-Party": _type.secondaryParty,
      })),
    };
    setBriefs({ caseBrief, usersBrief, caseTypesBrief });
  }, [cases, institutions, caseTypes, users]);

  // render
  return (
    <main className="flex flex-col flex-grow items-center px-4">
      <div className="w-full max-w-screen-lg grid grid-flow-row-dense grid-cols-1 m-4 gap-4 md:grid-cols-2">
        {profileCard(date, time, overdues)}
        {/* {scheduleBrief(cases, router)}
        {UsersBrief(cases, router)}
        {InstitutionsBrief(cases, router)} */}
        {briefs.institutionsBrief && (
          <CardTable
            title={"Institutions"}
            data={briefs.institutionsBrief}
            baseLink={"/dashboard/institutions"}
            linkRows={false}
            showViewAll={true}
          />
        )}
        {briefs.caseBrief && (
          <CardTable
            title={"Active Cases"}
            data={briefs.caseBrief}
            baseLink={"/dashboard/cases"}
            linkRows={true}
            showViewAll={true}
          />
        )}
        {briefs.usersBrief && (
          <CardTable
            title={"Active Users"}
            data={briefs.usersBrief}
            baseLink={"/dashboard/institutions"}
            linkRows={true}
            // showViewAll={true}
          />
        )}
        {briefs.caseTypesBrief && (
          <CardTable
            title={"Case Types"}
            data={briefs.caseTypesBrief}
            baseLink={"/dashboard/caseTypes"}
            linkRows={false}
            showViewAll={true}
          />
        )}
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
            {data_.length} case{data_.length !== 1 && <>s</>} with pending tasks
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
              <Link href="/dashboard/tasks">
                <ButtonPrimary label="View Tasks" onClick={() => ""} />
              </Link>
            </div>
          )}
          <div>
            <Link href="/dashboard/cases/new">
              <ButtonSecondary label="New Case" onClick={() => ""} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function scheduleBrief(data_, router) {
  return (
    <div className="card overflow-x-auto m-auto max-w-lg w-full h-full border-1 flex flex-col leading-normal p-2 md:p-4">
      <div className="flex items-center justify-start">
        <h5 className="text-xl font-bold leading-none">Active Cases</h5>
        <div className="ml-4">
          <Link
            href="/dashboard/cases"
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
              Case
            </th>
            <th scope="col" className="px-1 py-3">
              Case Type
            </th>
            <th scope="col" className="px-1 py-3">
              Client
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
                  key={v.id}
                  className="border-b border-gray-300 dark:border-gray-800 hover:bg-backg-raised dark:hover:bg-backg-dark-raised cursor-pointer"
                  onClick={() => router.push(`/dashboard/cases/${v.id}`)}
                >
                  <th scope="row" className="px-1 py-2 whitespace-nowrap">
                    {v.name}
                  </th>
                  <td className="px-1 py-2">
                    {/* <span className="block">{v.type}</span> */}
                    {/* <span className="block">{v.type}</span> */}
                    {v.type}
                  </td>
                  <td className="px-1 py-2">
                    <span className="block italic">{v.clientParty}</span>
                    <span className="block">{v.clientName}</span>
                  </td>
                  <td className="px-1 py-2">{v.status}</td>
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

function UsersBrief(data_, router) {
  return (
    <div className="card overflow-x-auto m-auto max-w-lg w-full h-full border-1 flex flex-col leading-normal p-2 md:p-4">
      <div className="flex items-center justify-start">
        <h5 className="text-xl font-bold leading-none">Users</h5>
        <div className="ml-4">
          <Link
            href="/dashboard/cases"
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
              Case
            </th>
            <th scope="col" className="px-1 py-3">
              Case Type
            </th>
            <th scope="col" className="px-1 py-3">
              Client
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
                  key={v.id}
                  className="border-b border-gray-300 dark:border-gray-800 hover:bg-backg-raised dark:hover:bg-backg-dark-raised cursor-pointer"
                  onClick={() => router.push(`/dashboard/cases/${v.id}`)}
                >
                  <th scope="row" className="px-1 py-2 whitespace-nowrap">
                    {v.name}
                  </th>
                  <td className="px-1 py-2">
                    {/* <span className="block">{v.type}</span> */}
                    {/* <span className="block">{v.type}</span> */}
                    {v.type}
                  </td>
                  <td className="px-1 py-2">
                    <span className="block italic">{v.clientParty}</span>
                    <span className="block">{v.clientName}</span>
                  </td>
                  <td className="px-1 py-2">{v.status}</td>
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

function InstitutionsBrief(data_, router) {
  return (
    <div className="card overflow-x-auto m-auto max-w-lg w-full h-full border-1 flex flex-col leading-normal p-2 md:p-4">
      <div className="flex items-center justify-start">
        <h5 className="text-xl font-bold leading-none">Institutions</h5>
        <div className="ml-4">
          <Link
            href="/dashboard/cases"
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
              Case
            </th>
            <th scope="col" className="px-1 py-3">
              Case Type
            </th>
            <th scope="col" className="px-1 py-3">
              Client
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
                  key={v.id}
                  className="border-b border-gray-300 dark:border-gray-800 hover:bg-backg-raised dark:hover:bg-backg-dark-raised cursor-pointer"
                  onClick={() => router.push(`/dashboard/cases/${v.id}`)}
                >
                  <th scope="row" className="px-1 py-2 whitespace-nowrap">
                    {v.name}
                  </th>
                  <td className="px-1 py-2">
                    {/* <span className="block">{v.type}</span> */}
                    {/* <span className="block">{v.type}</span> */}
                    {v.type}
                  </td>
                  <td className="px-1 py-2">
                    <span className="block italic">{v.clientParty}</span>
                    <span className="block">{v.clientName}</span>
                  </td>
                  <td className="px-1 py-2">{v.status}</td>
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
