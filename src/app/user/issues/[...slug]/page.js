"use client";
import { useContext, useState, useEffect } from "react";
import Link from "next/link";
import { DataContext } from "../../providers";
import { SVGpenscilSquare } from "@/components/atoms/svgs";
import { ButtonPrimary, ButtonText } from "@/components/atoms/buttons";
import { InputText } from "@/components/atoms/inputs";
import { nameValidator } from "@/helpers/inputValidators";

export default function IssueForm({ params }) {
  const { slug } = params;
  const { issues, templates } = useContext(DataContext);
  const [menuItems, setMenuItems] = useState({});
  const [selected, setSelected] = useState("");
  const [newIssue, setNewIssue] = useState({
    type: { type: "", category: "" },
    name: { value: "", error: "" },
  });
  const [searchPhrase, setSearchPhrase] = useState("");
  // check slug and update selected
  useEffect(() => {
    if (slug[0] !== "new")
      setSelected(issues.find(({ _id }) => _id === slug[0]));
  }, [issues, slug]);
  // check issue-type select
  useEffect(() => {
    if (newIssue.type.type)
      setMenuItems((prev) => {
        return {
          ...prev,
          categories: templates.find((v) => v.type === newIssue.type.type)
            .categories,
        };
      });
  }, [newIssue.type.type, templates]);
  //render
  return slug[0] === "new" ? (
    <main className="flex flex-col flex-grow items-center px-4">
      <div className="flex flex-col flex-grow max-w-screen-lg mx-auto px-4 sm:px-4 lg:px-6 w-full">
        {/* heading */}
        <div className="space-y-2 pt-6 md:space-y-5 mb-4">
          <h1 className="text-center uppercase">New Issue</h1>
          {/* Inputs */}
          <div
            className={`relative max-w-lg mx-auto grid grid-cols-1 gap-4 ${
              menuItems.categories ? "md:grid-cols-2 md:gap-6" : ""
            } card pt-3 pb-6 px-12`}
          >
            {!newIssue.type.type || !newIssue.type.category ? (
              <>
                {inputSelect(issueTypes, newIssue.type.type, (e) => {
                  setNewIssue({
                    ...newIssue,
                    type: { type: e.target.value, category: "" },
                  });
                })}
                {newIssue.type.type &&
                  menuItems.categories &&
                  inputSelect(
                    menuItems.categories.map((v) => {
                      return { value: v, text: v };
                    }),
                    newIssue.type.category,
                    (e) => {
                      setNewIssue((prev) => {
                        return {
                          ...prev,
                          type: { ...prev.type, category: e.target.value },
                        };
                      });
                    },
                    "category",
                    "category"
                  )}
              </>
            ) : (
              <>
                <div className="m-auto">
                  <div className="mr-4">
                    <p className="italic">issue:</p>
                    {newIssue.type.category} - {newIssue.type.type}
                  </div>
                </div>
                <div className="text-red-800 dark:text-red-300 inline m-auto">
                  <ButtonText
                    label="Cancel issue creation"
                    onClick={() =>
                      setNewIssue({
                        type: { type: "", category: "" },
                        name: { value: "", error: "" },
                      })
                    }
                  />
                </div>
              </>
            )}
          </div>
        </div>
        {/* chat */}
        {newIssue.type.type && newIssue.type.category && (
          <div id="prompt" className="flex flex-col flex-grow min-h-[400px]">
            <div
              id="prompt-log"
              className="overscroll-none flex flex-col flex-grow"
            >
              <div className="flex-grow">
                {/* prompt container */}
                <div class="flex h-screen antialiased text-gray-800">
                  <div class="flex flex-row h-full w-full overflow-x-hidden">
                    <div class="flex flex-col flex-auto h-full p-6">
                      <div class="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4">
                        <div class="flex flex-col h-full overflow-x-auto mb-4">
                          <div class="flex flex-col h-full">
                            <div class="grid grid-cols-12 gap-y-2">
                              {lisaMessage(initMessage)}
                              <div class="col-start-1 col-end-8 p-3 rounded-lg">
                                <div class="flex flex-row items-center">
                                  <div class="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                                    A
                                  </div>
                                  <div class="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                                    <div>
                                      Lorem ipsum dolor sit amet, consectetur
                                      adipisicing elit. Vel ipsa commodi illum
                                      saepe numquam maxime asperiores voluptate
                                      sit, minima perspiciatis.
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div class="col-start-6 col-end-13 p-3 rounded-lg">
                                <div class="flex items-center justify-start flex-row-reverse">
                                  <div class="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                                    A
                                  </div>
                                  <div class="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
                                    <div>Im ok what about you?</div>
                                  </div>
                                </div>
                              </div>
                              <div class="col-start-6 col-end-13 p-3 rounded-lg">
                                <div class="flex items-center justify-start flex-row-reverse">
                                  <div class="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                                    A
                                  </div>
                                  <div class="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
                                    <div>
                                      Lorem ipsum dolor sit, amet consectetur
                                      adipisicing. ?
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div class="col-start-1 col-end-8 p-3 rounded-lg">
                                <div class="flex flex-row items-center">
                                  <div class="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                                    A
                                  </div>
                                  <div class="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                                    <div>Lorem ipsum dolor sit amet !</div>
                                  </div>
                                </div>
                              </div>
                              <div class="col-start-6 col-end-13 p-3 rounded-lg">
                                <div class="flex items-center justify-start flex-row-reverse">
                                  <div class="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                                    A
                                  </div>
                                  <div class="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
                                    <div>
                                      Lorem ipsum dolor sit, amet consectetur
                                      adipisicing. ?
                                    </div>
                                    <div class="absolute text-xs bottom-0 right-0 -mb-5 mr-2 text-gray-500">
                                      Seen
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div class="col-start-1 col-end-8 p-3 rounded-lg">
                                <div class="flex flex-row items-center">
                                  <div class="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                                    A
                                  </div>
                                  <div class="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                                    <div>
                                      Lorem ipsum dolor sit amet consectetur
                                      adipisicing elit. Perspiciatis, in.
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div class="col-start-1 col-end-8 p-3 rounded-lg">
                                <div class="flex flex-row items-center">
                                  <div class="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                                    A
                                  </div>
                                  <div class="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                                    <div class="flex flex-row items-center">
                                      <button class="flex items-center justify-center bg-indigo-600 hover:bg-indigo-800 rounded-full h-8 w-10">
                                        <svg
                                          class="w-6 h-6 text-white"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="1.5"
                                            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                          ></path>
                                          <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="1.5"
                                            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                          ></path>
                                        </svg>
                                      </button>
                                      <div class="flex flex-row items-center space-x-px ml-4">
                                        <div class="h-2 w-1 bg-gray-500 rounded-lg"></div>
                                        <div class="h-2 w-1 bg-gray-500 rounded-lg"></div>
                                        <div class="h-4 w-1 bg-gray-500 rounded-lg"></div>
                                        <div class="h-8 w-1 bg-gray-500 rounded-lg"></div>
                                        <div class="h-8 w-1 bg-gray-500 rounded-lg"></div>
                                        <div class="h-10 w-1 bg-gray-500 rounded-lg"></div>
                                        <div class="h-10 w-1 bg-gray-500 rounded-lg"></div>
                                        <div class="h-12 w-1 bg-gray-500 rounded-lg"></div>
                                        <div class="h-10 w-1 bg-gray-500 rounded-lg"></div>
                                        <div class="h-6 w-1 bg-gray-500 rounded-lg"></div>
                                        <div class="h-5 w-1 bg-gray-500 rounded-lg"></div>
                                        <div class="h-4 w-1 bg-gray-500 rounded-lg"></div>
                                        <div class="h-3 w-1 bg-gray-500 rounded-lg"></div>
                                        <div class="h-2 w-1 bg-gray-500 rounded-lg"></div>
                                        <div class="h-2 w-1 bg-gray-500 rounded-lg"></div>
                                        <div class="h-2 w-1 bg-gray-500 rounded-lg"></div>
                                        <div class="h-10 w-1 bg-gray-500 rounded-lg"></div>
                                        <div class="h-2 w-1 bg-gray-500 rounded-lg"></div>
                                        <div class="h-10 w-1 bg-gray-500 rounded-lg"></div>
                                        <div class="h-8 w-1 bg-gray-500 rounded-lg"></div>
                                        <div class="h-8 w-1 bg-gray-500 rounded-lg"></div>
                                        <div class="h-1 w-1 bg-gray-500 rounded-lg"></div>
                                        <div class="h-1 w-1 bg-gray-500 rounded-lg"></div>
                                        <div class="h-2 w-1 bg-gray-500 rounded-lg"></div>
                                        <div class="h-8 w-1 bg-gray-500 rounded-lg"></div>
                                        <div class="h-8 w-1 bg-gray-500 rounded-lg"></div>
                                        <div class="h-2 w-1 bg-gray-500 rounded-lg"></div>
                                        <div class="h-2 w-1 bg-gray-500 rounded-lg"></div>
                                        <div class="h-2 w-1 bg-gray-500 rounded-lg"></div>
                                        <div class="h-2 w-1 bg-gray-500 rounded-lg"></div>
                                        <div class="h-4 w-1 bg-gray-500 rounded-lg"></div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4">
                          <div>
                            <button class="flex items-center justify-center text-gray-400 hover:text-gray-600">
                              <svg
                                class="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                ></path>
                              </svg>
                            </button>
                          </div>
                          <div class="flex-grow ml-4">
                            <div class="relative w-full">
                              <input
                                type="text"
                                class="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                              />
                              <button class="absolute flex items-center justify-center h-full w-12 right-0 top-0 text-gray-400 hover:text-gray-600">
                                <svg
                                  class="w-6 h-6"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                  ></path>
                                </svg>
                              </button>
                            </div>
                          </div>
                          <div class="ml-4">
                            <button class="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0">
                              <span>Send</span>
                              <span class="ml-2">
                                <svg
                                  class="w-4 h-4 transform rotate-45 -mt-px"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                  ></path>
                                </svg>
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  ) : (
    <>Selected an Issue</>
  );
}

function lisaMessage(message) {
  return (
    <div class="col-start-1 col-end-8 p-3 rounded-lg">
      <div class="flex flex-row items-center">
        <div class="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
          A
        </div>
        <div class="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
          <div
            className={`font-mono overflow-hidden animate-[typing_2s_steps(${message.length})_forwards] whitespace-nowrap`}
          >
            {message}
          </div>
        </div>
      </div>
    </div>
    // <div className="clearfix">
    //   <div className="card inline-block ml-2 mr-4 p-2 rounded-lg overflow-hidden">
    //     <p
    //       className={`font-mono animate-[typing_2s_steps(${message.length})_forwards] overflow-hidden whitespace-nowrap`}
    //     >
    //       {message}
    //     </p>
    //   </div>
    // </div>
  );
}

function inputSelect(
  optionItems_,
  value,
  onChange = () => "",
  name = "inputName",
  defaultOption = "type"
) {
  return (
    <div className="space-y-2">
      <div className="no-wrap"></div>
      <div className="relative mb-6 mt-0">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
          <SVGpenscilSquare className="w-4 h-4 text-emerald-800 dark:text-emerald-500" />
        </div>
        <select
          name={name}
          id={name}
          className={`border-transparent dark:border-transparent focus:ring-emerald-800 focus:border-emerald-800 dark:focus:ring-emerald-800 dark:focus:border-emerald-800 border shadow dark:shadow-dak dark:focus:shadow-dpressed focus:shadow-pressed text-gray-900 text-sm rounded-lg  block w-full pl-10 p-2.5  dark:bg-gray-700  dark:placeholder-gray-400 placeholder:italic dark:text-white `}
          value={value}
          onChange={onChange}
        >
          <option value="" className="italic font-light">
            Select a {defaultOption}...
          </option>
          {optionItems_.map((option) => (
            <option key={option.value} value={option.value}>
              {option.text}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

const issueTypes = [{ value: "petition", text: "✍🏾 petition" }];

const initMessage = "Provide a name for the issue to initialize it";
