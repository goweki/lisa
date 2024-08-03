"use client";
import { useContext, useState, useEffect } from "react";
import Link from "next/link";
import { DataContext } from "../providers";
import { useSession } from "next-auth/react";
import { CardCase } from "@/components/mols/cards";
import {
  SVGbriefcase,
  SVGpenscilSquare,
  SVGsearch,
} from "@/components/atoms/svgs";
import { InputText } from "@/components/atoms/inputs";
import { ButtonPrimary, ButtonSecondary } from "@/components/atoms/buttons";

export default function CasesPage() {
  const {
    data: { cases },
  } = useContext(DataContext);
  const { data: session } = useSession();
  const [filtCases, setFiltCases] = useState([]);
  const [searchPhrase, setSearchPhrase] = useState({ value: "", error: "" });
  //filter cases by searchPhrase
  useEffect(() => {
    setFiltCases(
      cases?.filter(
        ({ clientName, name }) =>
          clientName
            .toLowerCase()
            .includes(searchPhrase.value?.toLowerCase()) ||
          name.toLowerCase().includes(searchPhrase.value?.toLowerCase())
      )
    );
  }, [searchPhrase, cases]);

  //render
  return (
    <main className="flex flex-col flex-grow items-center px-4">
      <div className="max-w-screen-lg mx-auto px-4 sm:px-4 lg:px-6">
        <div className="space-y-2 pt-6 md:space-y-5 mb-4">
          <h1 className="text-center uppercase">Cases</h1>
          <div className="relative max-w-lg mx-auto grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 card pt-3 pb-6 px-12">
            <InputText
              name="searchPhrase"
              valObj={searchPhrase}
              setValue={setSearchPhrase}
              placeholder="Search for cases"
              icon={SVGsearch}
            />
            {session.user.role === "admin" && (
              <Link className="mt-2" href="/dashboard/cases/new">
                <ButtonPrimary label="+new Case" onClick={() => ""} />
              </Link>
            )}
          </div>
        </div>
        {filtCases.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:gap-12 p-6 md:p-10">
            {filtCases.map((v) => (
              <div key={v.id}>
                <CardCase
                  item={v}
                  icon={v.type === "petition" ? SVGpenscilSquare : SVGbriefcase}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 italic">No existing cases found</div>
        )}
      </div>
    </main>
  );
}
