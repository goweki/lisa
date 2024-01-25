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
                {lisaMessage(chatText)}

                {/* <div className="clearfix">
                  <div className="bg-gray-300 w-3/4 mx-4 my-2 p-2 rounded-lg clearfix">
                    It will be used for a full tutorial about building a chat
                    app with vue, tailwind and firebase.
                  </div>
                </div>
                <div className="clearfix">
                  <div className="bg-green-300 float-right w-3/4 mx-4 my-2 p-2 rounded-lg clearfix">
                    check my twitter to see when it will be released.
                  </div>
                </div> */}
              </div>
            </div>
            <div id="prompt-input" className="flex">
              <textarea
                className="outline-none flex-grow m-2 py-2 px-4 mr-1 rounded-full border border-gray-300 bg-gray-200 resize-none"
                rows="1"
                placeholder="Message..."
              ></textarea>
              <button className="m-2 outline-none">
                <svg
                  className="svg-inline--fa text-green-400 fa-paper-plane fa-w-16 w-12 h-12 py-2 mr-2"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="paper-plane"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="currentColor"
                    d="M476 3.2L12.5 270.6c-18.1 10.4-15.8 35.6 2.2 43.2L121 358.4l287.3-253.2c5.5-4.9 13.3 2.6 8.6 8.3L176 407v80.5c0 23.6 28.5 32.9 42.5 15.8L282 426l124.6 52.2c14.2 6 30.4-2.9 33-18.2l72-432C515 7.8 493.3-6.8 476 3.2z"
                  />
                </svg>
              </button>
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
    <div className="clearfix">
      <div className="card inline-block mx-4 my-2 p-2 rounded-lg overflow-hidden">
        <p
          className={`font-mono animate-[typing_2s_steps(${message.length})_forwards] overflow-hidden whitespace-nowrap`}
        >
          {message}
        </p>
      </div>
    </div>
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

const chatText = "Provide a name for the issue to initialize it";
