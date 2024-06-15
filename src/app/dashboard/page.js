"use client";
import { useContext, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDate } from "@/lib/dateTime";
import { ButtonPrimary, ButtonSecondary } from "@/components/atoms/buttons";
import { CardItemsTable, CardTable } from "@/components/mols/cards";
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
    // institutions
    const institutionsBrief = institutions.map((inst) => ({
      id: inst.id,
      institution: inst.name,
      location: inst.location,
      users: inst.userIDs.length,
      cases: inst.cases.length,
    }));
    // console.log("INSTITUTIONS", institutionsBrief);
    //cases
    const casesBrief = cases
      .filter((_case) => _case.status === "open")
      .slice(0, 8)
      .map((_case) => ({
        id: _case.id,
        case: _case.name,
        type: _case.type,
        client: [_case.clientName, _case.clientParty],
        status: _case.status,
      }));
    // users
    const usersBrief = users.map((user_) => ({
      id: user_.id,
      email: user_.email,
      name: user_.name,
      role: user_.role,
      institutions: user_.institutions.map((inst) => inst.name).join(", "),
    }));
    // casetypes
    const caseTypesBrief = caseTypes.map((_type) => ({
      id: _type.id,
      name: _type.name,
      description: _type.name.trim().split(" ").pop(),
      Primary: _type.primaryParty,
      Secondary: _type.secondaryParty,
    }));
    //setState
    setBriefs({ institutionsBrief, usersBrief, casesBrief, caseTypesBrief });
  }, [institutions, users, cases, caseTypes]);

  // render
  return (
    <main className="flex flex-col flex-grow items-center px-4">
      <div className="w-full max-w-screen-lg grid grid-flow-row-dense grid-cols-1 m-4 gap-4 md:grid-cols-2">
        {profileCard(date, time, overdues)}
        {/* {scheduleBrief(cases, router)}
        {UsersBrief(cases, router)}
        {InstitutionsBrief(cases, router)} */}
        {briefs.institutionsBrief?.length > 1 && (
          <CardItemsTable
            title={"Institutions"}
            data={briefs.institutionsBrief}
            pageLink={"/dashboard/institutions"}
          />
        )}

        {briefs.usersBrief && (
          <CardItemsTable
            title={"Users"}
            data={briefs.usersBrief}
            pageLink={"/dashboard/users"}
          />
        )}

        {briefs.casesBrief && (
          <CardItemsTable
            title={"Cases"}
            data={briefs.casesBrief}
            pageLink={"/dashboard/cases"}
          />
        )}

        {briefs.caseTypesBrief && (
          <CardItemsTable
            title={"Types of Cases"}
            data={briefs.caseTypesBrief}
            // pageLink={"/dashboard/case-types"}
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
