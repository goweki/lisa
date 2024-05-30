"use client";
import { useContext, useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { DataContext } from "../../providers";
import { SVGpenscilSquare } from "@/components/atoms/svgs";
import { ButtonPrimary, ButtonSecondary } from "@/components/atoms/buttons";
import { InputText } from "@/components/atoms/inputs";
import { strPascalcase } from "@/helpers/stringHandlers";
import toast from "react-hot-toast";
import { Loader1 } from "@/components/atoms/loader";
import { ViewIssue } from "./compo";

export default function IssuePage({ params }) {
  const { data: session } = useSession();
  const { slug } = params;
  const {
    data: { issues, templates },
    refreshData,
  } = useContext(DataContext);
  const router = useRouter();
  const [menuItems, setMenuItems] = useState({});
  const [selected, setSelected] = useState("");
  const [UIstate, setUIstate] = useState("loading");
  const [newIssue, setNewIssue] = useState({
    type: { type: "", category: "" },
    name: { value: "", error: "" },
    client: { party: "", value: "", error: "" },
    institution: {
      value: session.user.role.lisa ? "" : Object.keys(session.user.role)[0],
      error: "",
    },
  });
  // check slug and update selected
  useEffect(() => {
    if (slug[0] !== "new") {
      let issue_ = issues.find(({ _id }) => _id === slug[0]);
      setSelected(issue_);
    } else setUIstate("OK");
  }, [issues, slug]);
  // UIstate OK after updating selected
  useEffect(() => {
    if (selected) {
      setUIstate("OK");
    }
  }, [selected]);
  //update Categories after issue-type is updates
  useEffect(() => {
    if (newIssue.type.type)
      setMenuItems((prev) => {
        return {
          ...prev,
          categories: templates.find((v) => v.type === newIssue.type.type)
            .categories,
          parties: templates.find((v) => v.type === newIssue.type.type).parties,
        };
      });
  }, [newIssue.type.type, templates]);
  //submit new issue
  async function initializeIssue() {
    if (
      !newIssue.name.value ||
      !newIssue.client.value ||
      !newIssue.institution.value
    ) {
      if (!newIssue.name.value) {
        setNewIssue((prev) => ({
          ...prev,
          name: { value: "", error: "Please provide a name" },
        }));
      } else if (!newIssue.client.value) {
        setNewIssue((prev) => ({
          ...prev,
          client: {
            ...prev.client,
            value: "",
            error: "Please provide a client name",
          },
        }));
      } else {
        setNewIssue((prev) => ({
          ...prev,
          institution: { value: "", error: "Please provide an institution" },
        }));
      }
    } else {
      // fetch options
      let fetchOptions = {
        method: "POST",
        // headers: {
        //   "Content-Type": "application/json",
        //   'Content-Type': 'application/x-www-form-urlencoded',
        // },
        body: JSON.stringify({
          type: newIssue.type,
          name: newIssue.name.value,
          client: { party: newIssue.client.party, name: newIssue.client.value },
          institution: newIssue.institution.value,
          status: { status: "open" },
          dueDates: [],
        }),
      };
      setUIstate("loading");
      // POST request using fetch
      const _res = await fetch("/api/user/issue", fetchOptions).then(
        async (res_) => {
          if (res_.ok) {
            return await res_.json();
          } else {
            console.log(`ERROR: ` + JSON.stringify(res_));
            setUIstate(httpCodes[res_.status]);
          }
        }
      );
      if (_res?.success) {
        console.log(
          "SUCCESS: issue initialized successfully\n > " +
            JSON.stringify(_res.success) +
            "\n.............."
        );
        toast.success("Issue initialization successful!");
        await refreshData();
        router.replace(`/user/issues/${_res.success.insertedId}`);
      } else {
        console.error(
          "ERROR: failed to initialize issue at /user/issues/new /page\n > " +
            JSON.stringify(_res) +
            "\n.............."
        );
        setUIstate(_res?.error ?? "No Response, check internet connection");
      }
    }
  }
  //render
  return UIstate === "loading" ? (
    <Loader1 />
  ) : (
    <main className="flex flex-col flex-grow items-center px-4">
      <div className="flex flex-col flex-grow max-w-screen-lg mx-auto px-4 sm:px-4 lg:px-6 w-full">
        {/* header */}
        <div className="space-y-1 pt-6 md:space-y-2">
          {/* heading */}
          <h1 className="text-center uppercase">
            {slug[0] === "new" ? "New Issue" : selected?.name ?? "ERROR"}
          </h1>
          {/* Inputs */}
          {slug[0] === "new" ? (
            <div className="px-6 sm:px-20 md:px-12">
              <div
                className={`relative max-w-lg mx-auto grid grid-cols-1 gap-4 card p-6`}
              >
                {!newIssue.type.type ||
                !newIssue.type.category ||
                !newIssue.client.party ? (
                  <>
                    {inputSelect(
                      templates.map((template) => template.type),
                      newIssue.type.type,
                      (e) => {
                        setNewIssue({
                          ...newIssue,
                          type: { type: e.target.value, category: "" },
                        });
                      }
                    )}

                    {newIssue.type.type &&
                      menuItems.categories &&
                      inputSelect(
                        menuItems.categories,
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

                    {newIssue.type.category &&
                      inputSelect(
                        menuItems.parties,
                        newIssue.client.party,
                        (e) => {
                          setNewIssue((prev) => {
                            return {
                              ...prev,
                              client: {
                                ...prev.client,
                                party: e.target.value,
                              },
                            };
                          });
                        },
                        "party-representing",
                        "party to represent"
                      )}
                  </>
                ) : (
                  <>
                    <div className="m-auto">
                      <div className="mr-4">
                        {strPascalcase(newIssue.type.category)} -{" "}
                        {newIssue.type.type}
                      </div>
                    </div>
                    <div className="inline m-auto"></div>
                    <div className="mb-6 space-y-3">
                      <InputText
                        label={`${strPascalcase(newIssue.type.type)} name*`}
                        name="issueName"
                        placeholder={`${strPascalcase(
                          newIssue.type.type
                        )} name`}
                        value={newIssue.name}
                        setValue={({ value, error }) =>
                          setNewIssue((prev) => ({
                            ...prev,
                            name: { value, error },
                          }))
                        }
                      />
                      <InputText
                        label={
                          "Client (" +
                          strPascalcase(newIssue.client.party) +
                          ")*"
                        }
                        name={newIssue.client.party}
                        placeholder={`Name of ${newIssue.client.party}`}
                        value={newIssue.client.value}
                        setValue={({ value, error }) =>
                          setNewIssue((prev) => ({
                            ...prev,
                            client: { ...prev.client, value, error },
                          }))
                        }
                      />
                      {session.user.role.lisa && (
                        <InputText
                          label="Institution*"
                          name="institution"
                          placeholder="Institution"
                          value={newIssue.institution}
                          setValue={({ value, error }) =>
                            setNewIssue((prev) => ({
                              ...prev,
                              institution: { value, error },
                            }))
                          }
                        />
                      )}
                    </div>
                    <ButtonPrimary
                      label={`Initialize ${newIssue.type.type}`}
                      onClick={initializeIssue}
                    />
                    <ButtonSecondary
                      label={`Cancel ${newIssue.type.type}`}
                      onClick={() => {
                        setNewIssue({
                          type: { type: "", category: "" },
                          name: { value: "", error: "" },
                        });
                        setChat([]);
                        setNewIssue({
                          type: { type: "", category: "" },
                          name: { value: "", error: "" },
                          client: { party: "", value: "", error: "" },
                          institution: { value: "", error: "" },
                        });
                      }}
                    />
                  </>
                )}
              </div>
            </div>
          ) : selected ? (
            <ViewIssue
              selectedIssue={selected}
              selectedTaskName={slug[1] ?? null}
              template={templates.find(
                ({ type }) => type === selected.type.type
              )}
              refreshData={refreshData}
            />
          ) : (
            <div>
              <p className="text-center">
                There was an error loading the contents of this page. Check
                internet connectivity
              </p>
              <p className="text-center">
                <Link
                  href="/user/issues"
                  className="text-red-800 dark:text-red-400 underline"
                >
                  {" "}
                  click here{" "}
                </Link>
                to view all issues
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function inputSelect(
  optionItems,
  value,
  onChange = () => "",
  name = "inputName",
  defaultOption = "type"
) {
  return (
    <div className="relative mb-6">
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
        {optionItems.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

async function fetchIssue(issueId) {
  const resRaw = await fetch(`/api/user/issue?id=${issueId}`, {
    method: "GET",
  });
  if (resRaw.ok) {
    const res = await resRaw.json();
    console.log("resJson 2: ", JSON.stringify(res.success));
    return res.success;
  }
}

// const issueTypes = [{ value: "petition", text: "✍🏾 petition" }];
