"use client";
import { useContext, useState, useEffect } from "react";
import Link from "next/link";
import { DataContext } from "../providers";
import CardIssue from "@/components/mols/cards";
import {
  SVGbriefcase,
  SVGpenscilSquare,
  SVGsearch,
} from "@/components/atoms/svgs";
import { InputText } from "@/components/atoms/inputs";
import { ButtonPrimary, ButtonSecondary } from "@/components/atoms/buttons";

export default function IssuesPage() {
  const {
    data: { issues },
  } = useContext(DataContext);
  const [filtIssues, setFiltIssues] = useState([]);
  const [searchPhrase, setSearchPhrase] = useState({ value: "", error: "" });
  //filter issues by searchPhrase
  useEffect(() => {
    setFiltIssues(
      issues?.filter(
        ({ name, source }) =>
          name.toLowerCase().includes(searchPhrase.value?.toLowerCase()) ||
          client.name.toLowerCase().includes(searchPhrase.value?.toLowerCase())
      )
    );
  }, [searchPhrase, issues]);

  //render
  return (
    <main className="flex flex-col flex-grow items-center px-4">
      <div className="max-w-screen-lg mx-auto px-4 sm:px-4 lg:px-6">
        <div className="space-y-2 pt-6 md:space-y-5 mb-4">
          <h1 className="text-center uppercase">Issues</h1>
          <div className="relative max-w-lg mx-auto grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 card pt-3 pb-6 px-12">
            <InputText
              name="searchPhrase"
              value={searchPhrase}
              setValue={setSearchPhrase}
              placeholder="Search for issues"
              icon={SVGsearch}
            />
            <Link className="mt-2" href="/user/issues/new">
              <ButtonPrimary label="+new Issue" onClick={() => ""} />
            </Link>
          </div>
        </div>
        {filtIssues.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:gap-12 p-6 md:p-10">
            {filtIssues.map((v) => (
              <div key={v._id}>
                <CardIssue
                  item={v}
                  icon={
                    v.type.type === "petition" ? SVGpenscilSquare : SVGbriefcase
                  }
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 italic">
            No existing issues found
          </div>
        )}
      </div>
    </main>
  );
}
