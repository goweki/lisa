"use client";
import { useContext, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDate } from "@/lib/dateTime";
import { ButtonPrimary, ButtonSecondary } from "@/components/atoms/buttons";
import { CardItemsTable } from "@/components/mols/cards";
import { SVGtime } from "@/components/atoms/svgs";
import { DataContext } from "@/app/dashboard/providers";
import { useSession, signOut } from "next-auth/react";
import { Case, Task } from "@/types/models";
import { CaseStatus, EntityStatus, UserRole } from "@prisma/client";

interface UsersBrief {
  id: string;
  email: string;
  name: string;
}

export default function UserHome() {
  const router = useRouter();
  const { data: session } = useSession();
  const [casesWithDues, setDueCases] = useState<
    Array<(typeof cases)[0] & { dueTasks: (typeof cases)[0]["tasks"] }>
  >([]);
  const [briefs, setBriefs] = useState<Record<string, Record<string, any>[]>>({
    institutionsBrief: [],
    usersBrief: [],
  });
  const [uiState, setUIstate] = useState("");
  const { date, time, rawDate } = useDate();
  const {
    data: { cases, institutions, caseTypes, users },
  } = useContext(DataContext);

  //onMount or //cases
  useEffect(() => {
    const _casesWithDues = cases
      .map((case_) => {
        return {
          ...case_,
          dueTasks: case_.tasks?.filter(
            (task_) =>
              // !task_.completedByID && isDatePassed(new Date(task_.dueDate))
              !task_.completedById
          ),
        };
      })
      .filter((case_) => case_.tasks && case_.tasks?.length > 0);
    setDueCases(_casesWithDues);
    // institutions
    const institutionsBrief = institutions
      ? institutions.map((inst) => ({
        id: inst.id,
        institution: inst.name,
        location: inst.location,
        users: inst.users ? inst.users.length : [],
        cases: inst.cases?.length,
      }))
      : [];
    // console.log("INSTITUTIONS", institutionsBrief);
    //cases
    const casesBrief = cases
      .filter((_case) => _case.status === CaseStatus.OPEN)
      .slice(0, 8)
      .map((_case) => ({
        id: _case.id,
        case: _case.name,
        type: _case.caseType?.name,
        client: [_case.clientName, _case.clientParty],
        status: _case.status,
      }));
    // users

    const usersBrief = users.map((user_) => {
      const institutions_roles = user_.institutions?.map((instUser) => {
        const institution_ = institutions?.find(
          ({ id }) => id === instUser.institutionId
        );
        return { name: institution_?.name, role: instUser.role };
      });
      const roles_: string[] =
        (institutions_roles?.map(({ role }) => role) as string[]) || [];
      const user_institutions_str =
        institutions_roles?.map(({ name }) => name).join(", ") || "";
      return {
        id: user_.id,
        email: user_.email,
        name: user_.names,
        role: user_.systemAdmin
          ? "system"
          : roles_.includes(UserRole.ADMIN)
            ? "admin"
            : "user",
        institutions: user_institutions_str,
      };
    });
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
    setUIstate("OK");
  }, [institutions, users, cases, caseTypes]);

  // render
  return uiState ? (
    <main className="flex flex-col flex-grow items-center px-4 md:py-8">
      <div className="w-full max-w-screen-lg grid grid-flow-row-dense grid-cols-1 m-4 gap-4 md:grid-cols-2">
        <ProfileCard
          date={date}
          time={time}
          data={casesWithDues}
          entities={briefs}
        />

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
            pageLink={"/dashboard/case-types"}
          />
        )}
      </div>
    </main>
  ) : null;
}

function ProfileCard({
  date,
  time,
  data,
  entities,
}: {
  date: () => string;
  time: () => string;
  data: any[];
  entities: Record<string, Record<string, any>[]>;
}) {
  const { data: session } = useSession();

  return (
    <div className="card m-auto max-w-lg w-full h-full border-1 flex flex-col leading-normal">
      <div className="grid-cols-1 m-2">
        <div className="text-sm flex justify-center items-center">
          <SVGtime className="w-4 h-4 mr-2 text-emerald-900" />
          {date()} {time()}
        </div>
        {!session?.user?.systemAdmin ? (
          <>
            <p
              className={`font-bold text-xl mt-2 mb-4 text-center ${!data.length
                  ? "text-emerald-500"
                  : data.length < 3
                    ? "text-red-800 dark:text-red-300"
                    : "text-red-500"
                }`}
            >
              {!data.length
                ? "Your schedule is clean"
                : data.length < 3
                  ? "You have due tasks"
                  : "Your schedule is piling up!"}
            </p>
            <div className="text-base text-font-faded dark:text-font-dark-faded">
              <p
                className={`text-center ${data.length < 1
                    ? ""
                    : data.length < 3
                      ? "text-red-800 dark:text-red-200"
                      : "text-red-500"
                  }`}
              >
                {data.length} case{data.length !== 1 && <>s</>} with pending
                tasks
              </p>
              <ul className="hidden sm:block list-disc text-sm pl-6 pt-1">
                {data &&
                  data.map(
                    (_case: { id: string; name: string; dueTasks: Task[] }) => (
                      <li key={_case.id}>
                        <div>
                          {_case.name} :{" "}
                          {_case.dueTasks.map((_task, i) => (
                            <span key={i} className="italic font-bold">
                              {_task.name +
                                (i !== _case.dueTasks.length - 1 ? ", " : ". ")}
                            </span>
                          ))}
                        </div>
                      </li>
                    )
                  )}
              </ul>
            </div>
            <div className="mt-6 mb-2 mx-4 space-y-4">
              {data.length !== 0 && (
                <div>
                  <Link href="/dashboard/tasks">
                    <ButtonPrimary label="View Tasks" onClick={() => ""} />
                  </Link>
                </div>
              )}
              <div>
                <Link href="/dashboard/cases">
                  <ButtonSecondary label="New Case" onClick={() => ""} />
                </Link>
              </div>
            </div>
          </>
        ) : (
          <div className="w-fit m-auto mt-6 p-2">
            {Object.entries(entities).map(
              ([key, value]: [key: string, value: any]) => (
                <div
                  key={key}
                  className="flex w-fit border-b mb-2 hover:bg-backg-raised dark:hover:bg-backg-dark-raised"
                >
                  <span className="text-sm pl-2 w-32">
                    {key.replace(/Brief$/, "")} :
                  </span>
                  <span className="text-sm pr-2">{value.length || 0}</span>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
