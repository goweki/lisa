"use client";
import { ButtonSecondary } from "@/components/atoms/buttons";
import { SVGtime } from "@/components/atoms/svgs";
import { useDate } from "@/components/datetime";
import { useRouter } from "next/navigation";

export default function Portal() {
  const router = useRouter();
  const { date, time } = useDate();
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* <h1 className="col-span-2">Ujenzi unaendelea...</h1> */}
      <div className="bg-background-surface dark:bg-background-dark-surface rounded space-y-6 p-4 sm:p-12 md:p-4 shadow-[6px_6px_4px_#ecf0f4,-6px_-6px_4px_#f6fafe] dark:shadow-[1px_1px_2px_#0c1221,-1px_-1px_2px_#121c33] col-span-2 md:col-span-1">
        {renderProfile()}
      </div>
      <div className="col-span-2 md:col-span-1 bg-emerald-500 ">card 2</div>
    </div>
  );
  function renderProfile() {
    return (
      <div className="max-w-lg m-auto w-full lg:max-w-full lg:flex">
        <div
          className="bg-[url('/logos/symbol.png')] bg-center lg:bg-right h-48 lg:h-auto lg:w-48 flex-none bg-contain bg-no-repeat rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden"
          title="Profile"
        ></div>
        <div className="bg-gradient-to-b from-background-surface to-background-raised dark:from-background-dark-surface dark:to-background-dark-raised border-r border-b border-l border-gray-300 dark:border-gray-800 lg:border-l-0 lg:border-t rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal lg:bg-gradient-to-r">
          <div className="mb-6">
            <p className="text-sm flex items-center">
              <SVGtime className="w-4 h-4 mr-2 text-emerald-500" />
              {date()} {time()}
            </p>
            <div className="font-bold text-xl mt-2 mb-4">
              Your schedule is clean
            </div>
            <p className="text-base text-font-faded dark:text-font-dark-faded">
              <p>3 pending issues</p>
              <ul className="list-disc text-sm pl-6 pt-1">
                {[
                  "i231023-divorce",
                  "i231027-electoral",
                  "i231031-property",
                ].map((v, i) => {
                  return <li key={i}>{v}</li>;
                })}
              </ul>
            </p>
          </div>
          <ButtonSecondary label="view schedule" />
        </div>
      </div>
    );
  }
}
