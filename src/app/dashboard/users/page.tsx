"use client";
import { useContext, useState, useEffect } from "react";
import Link from "next/link";
import { DataContext } from "../providers";
import { CardCase, CardTable } from "@/components/mols/cards";
import {
  SVGbriefcase,
  SVGpenscilSquare,
  SVGsearch,
} from "@/components/atoms/svgs";
import { InputText } from "@/components/atoms/inputs";
import { ButtonPrimary, ButtonSecondary } from "@/components/atoms/buttons";
import { InstitutionType, UserType, CaseType } from "@/types/models";
interface series {
  id: string;
  email: string;
  name: string;
  institutions?: { [key: string]: string } | undefined; // institutions is optional
  cases: number;
}

export default function UsersPage() {
  const { data } = useContext(DataContext);
  const cases: CaseType[] = data.cases;
  const institutions: InstitutionType[] = data.institutions;
  const [filtUsers, setFiltUsers] = useState<series[]>([]);
  const [searchPhrase, setSearchPhrase] = useState({ value: "", error: "" });
  //filter cases by searchPhrase
  useEffect(() => {
    const users_: series[] = institutions
      .map((inst) => inst.users)
      .flat()
      .map((user_) => {
        return {
          id: user_?.id ?? "",
          email: user_?.email ?? "",
          name: user_?.name ?? "",
          institutions: user_?.institutions?.reduce(
            (acc_, curr) => ({ ...acc_, name: curr.name }),
            {}
          ),
          cases: user_?.cases?.length ?? 0,
        };
      });
    // console.log("USERS: ", users_);
    if (users_.length < 1) return;
    const filteredUsers_ = users_.filter(
      ({ email, name }) =>
        email.toLowerCase().includes(searchPhrase.value?.toLowerCase()) ||
        name.toLowerCase().includes(searchPhrase.value?.toLowerCase())
    );
    // console.log("FILTERED USERS: ", filteredUsers_);
    setFiltUsers(filteredUsers_);
  }, [searchPhrase, cases, institutions]);

  //render
  return (
    <main className="flex flex-col flex-grow items-center px-4">
      <div className="max-w-screen-lg mx-auto px-4 sm:px-4 lg:px-6">
        <div className="space-y-2 pt-6 md:space-y-5 mb-4">
          <h1 className="text-center uppercase">Users</h1>
          <div className="relative max-w-lg mx-auto grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 card pt-3 pb-6 px-12">
            <InputText
              name="searchPhrase"
              valObj={searchPhrase}
              setValue={setSearchPhrase}
              placeholder="Search for users"
              icon={SVGsearch}
            />
            <Link className="mt-2" href="/dashboard/users/new">
              <ButtonPrimary
                label="+new User"
                onClick={() => ""}
                loading={false}
                disabled={false}
              />
            </Link>
          </div>
        </div>
        {filtUsers.length > 0 ? (
          <div>
            <CardTable
              title={""}
              data={{
                headings: ["Email", "Name", "Institution", "Cases"],
                series: filtUsers,
              }}
              linkRows={false}
              baseLink={"/dashboard/users"}
              showViewAll={false}
            />
          </div>
        ) : (
          <div className="text-center py-6 italic">No existing users found</div>
        )}
      </div>
    </main>
  );
}
