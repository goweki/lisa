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
        {renderProfileCard()}
      </div>
      <div className="bg-background-surface dark:bg-background-dark-surface rounded space-y-6 p-4 sm:p-12 md:p-4 shadow-[6px_6px_4px_#ecf0f4,-6px_-6px_4px_#f6fafe] dark:shadow-[1px_1px_2px_#0c1221,-1px_-1px_2px_#121c33] col-span-2 md:col-span-1">
        {renderIssuesCard()}
      </div>
    </div>
  );
  function renderProfileCard() {
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
  function renderIssuesCard() {
    return (
      <>
        <div class="flex items-center justify-between mb-4">
          <h5 class="text-xl font-bold leading-none">Active Issues</h5>
          <a
            href="#"
            class="text-sm text-blue-600 hover:underline dark:text-blue-500"
          >
            View all
          </a>
        </div>
        <table class="w-full text-xs text-left text-gray-500 dark:text-gray-400">
          <thead class="text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3">
                Issue
              </th>
              <th scope="col" class="px-6 py-3">
                Client
              </th>
              <th scope="col" class="px-6 py-3">
                Category
              </th>
              <th scope="col" class="px-6 py-3">
                Start
              </th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
              <th
                scope="row"
                class="px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
              >
                div-Andeyo-2305
              </th>
              <td class="px-6 py-4">Betty Andeyo</td>
              <td class="px-6 py-4">Marital</td>
              <td class="px-6 py-4">23-05-2023</td>
            </tr>
            <tr class="border-b bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
              <th
                scope="row"
                class="px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
              >
                land-Onyeiti-2305
              </th>
              <td class="px-6 py-4">Onyeiti</td>
              <td class="px-6 py-4">Property</td>
              <td class="px-6 py-4">15-06-2023</td>
            </tr>
          </tbody>
        </table>
      </>
    );
  }
}
