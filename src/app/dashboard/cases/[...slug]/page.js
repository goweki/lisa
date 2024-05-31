"use client";
import { useContext, useState, useEffect } from "react";
import Link from "next/link";
// import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { DataContext } from "../../providers";
import { SVGpenscilSquare } from "@/components/atoms/svgs";
import { ButtonPrimary, ButtonSecondary } from "@/components/atoms/buttons";
import { InputText } from "@/components/atoms/inputs";
import { strPascalcase } from "@/helpers/stringHandlers";
import toast from "react-hot-toast";
import { Loader1 } from "@/components/atoms/loader";
import { ViewCase } from "./compo";
import { telValidator } from "@/helpers/inputValidators";

export default function CasePage({ params }) {
  // const { data: session } = useSession();
  const { slug } = params;
  const {
    data: { cases, caseTypes, institutions: userInstitutions },
    refreshData,
  } = useContext(DataContext);
  const router = useRouter();
  const [caseType, setCaseType] = useState("");
  const [selected, setSelected] = useState("");
  const [UIstate, setUIstate] = useState("loading");
  //empty case Object
  const emptyCase = {
    type: "",
    name: { value: "", error: "" },
    client: {
      party: "",
      name: { value: "", error: "" },
      tel: { value: "", error: "" },
    },
    institution: {
      value: userInstitutions.some((inst) => inst.name === "Lisa")
        ? ""
        : userInstitutions.length === 1
        ? userInstitutions[0].id
        : "",
    },
  };
  // case state Object
  const [newCase, setNewCase] = useState(emptyCase);
  // check slug and update selected
  useEffect(() => {
    if (slug[0] !== "new") {
      setSelected(cases.find(({ id }) => id === slug[0]));
    } else setUIstate("OK");
  }, [cases, slug]);
  // UIstate OK after updating selected
  useEffect(() => {
    if (selected) {
      setUIstate("OK");
    }
  }, [selected]);
  //update Categories after case-type is updates
  useEffect(() => {
    if (newCase.type)
      setCaseType(caseTypes.find((v) => v.name === newCase.type));
  }, [newCase.type, caseTypes]);
  //submit new case
  async function initializeCase() {
    try {
      // fetch options
      let fetchOptions = {
        method: "POST",
        // headers: {
        //   "Content-Type": "application/json",
        //   'Content-Type': 'application/x-www-form-urlencoded',
        // },
        body: JSON.stringify({
          type: newCase.type,
          name: newCase.name.value,
          clientParty: newCase.client.party,
          clientName: newCase.client.name.value,
          clientTel: newCase.client.tel.value,
          caseTypeID: caseType.id,
          institutionID: userInstitutions.find(
            (inst) => inst.name === newCase.institution
          ).id,
        }),
      };
      setUIstate("loading");
      // POST request using fetch
      const _res = await fetch("/api/dashboard/case", fetchOptions).then(
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
          "SUCCESS: case initialized successfully\n > " +
            JSON.stringify(_res.success) +
            "\n.............."
        );
        toast.success("Case initialized successfully!");
        await refreshData();
        router.replace(`/dashboard/cases/${_res.success.id}`);
      } else {
        console.error(
          "ERROR: failed to initialize case at /dashboard/cases/new /page\n > " +
            JSON.stringify(_res) +
            "\n.............."
        );
        setUIstate(_res?.error ?? "No Response, check internet connection");
      }
    } catch (error) {
      console.log("fetch failed: ", error.message);
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
            {slug[0] === "new" ? "New Case" : selected?.name ?? "ERROR"}
          </h1>
          {/* Inputs */}
          {slug[0] === "new" ? (
            <div className="px-6 sm:px-20 md:px-12">
              <div
                className={`relative max-w-lg mx-auto grid grid-cols-1 gap-4 card p-6`}
              >
                {!newCase.type || !newCase.client.party ? (
                  <>
                    {(userInstitutions.some((inst) => inst.name === "Lisa") ||
                      userInstitutions.length > 1) &&
                      inputSelect(
                        userInstitutions.map((inst) => inst.name),
                        newCase.institution,
                        (e) => {
                          setNewCase((prev) => {
                            return {
                              ...prev,
                              institution: e.target.value,
                            };
                          });
                        },
                        "user-institution",
                        "target institution"
                      )}
                    {inputSelect(
                      caseTypes.map((template) => template.name),
                      newCase.type,
                      (e) => {
                        setNewCase({
                          ...newCase,
                          type: e.target.value,
                        });
                      },
                      "case-type",
                      "case type"
                    )}
                    {newCase.type &&
                      inputSelect(
                        [caseType.primaryParty, caseType.secondaryParty],
                        newCase.client.party,
                        (e) => {
                          setNewCase((prev) => {
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
                        "party you represent"
                      )}
                  </>
                ) : (
                  <>
                    <div className="m-auto">
                      <div className="mr-4">{strPascalcase(newCase.type)}</div>
                    </div>
                    <div className="inline m-auto"></div>
                    <div className="mb-6 space-y-3">
                      <InputText
                        label={`${strPascalcase(
                          newCase.type.split(" ").pop()
                        )} name *`}
                        name="case-name"
                        placeholder={`Name of ${strPascalcase(
                          newCase.type.split(" ").pop()
                        )}`}
                        valObj={newCase.name}
                        setValue={({ value, error }) =>
                          setNewCase((prev) => ({
                            ...prev,
                            name: { value, error },
                          }))
                        }
                      />
                      <InputText
                        label={
                          "Client (" +
                          strPascalcase(newCase.client.party) +
                          ") name *"
                        }
                        name="client-name"
                        placeholder={`Name of ${newCase.client.party}`}
                        valObj={newCase.client.name}
                        setValue={({ value, error }) =>
                          setNewCase((prev) => ({
                            ...prev,
                            client: { ...prev.client, name: { value, error } },
                          }))
                        }
                      />
                      <InputText
                        label={
                          "Client (" +
                          strPascalcase(newCase.client.party) +
                          ") Phone number *"
                        }
                        name="client-phone-number"
                        type="tel"
                        placeholder={`Phone number of ${newCase.client.party}`}
                        valObj={newCase.client.tel}
                        valValidator={telValidator}
                        setValue={({ value, error }) =>
                          setNewCase((prev) => ({
                            ...prev,
                            client: { ...prev.client, tel: { value, error } },
                          }))
                        }
                      />
                    </div>
                    <ButtonPrimary
                      label={`Initialize ${strPascalcase(
                        newCase.type.split(" ").pop()
                      )}`}
                      onClick={initializeCase}
                      disabled={
                        !newCase.type ||
                        !newCase.name.value ||
                        !newCase.client.party ||
                        !newCase.client.name.value ||
                        !newCase.client.tel.value
                      }
                    />
                    <ButtonSecondary
                      label={`Clear`}
                      onClick={() => {
                        setNewCase(emptyCase);
                        setCaseType("");
                      }}
                    />
                  </>
                )}
              </div>
            </div>
          ) : selected ? (
            <ViewCase
              selectedCase={selected}
              selectedTaskName={slug[1] ?? null}
              template={caseTypes.find(({ id }) => id === selected.caseTypeID)}
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
                  href="/dashboard/cases"
                  className="text-red-800 dark:text-red-400 underline"
                >
                  {" "}
                  click here{" "}
                </Link>
                to view all cases
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
        {optionItems.map((option, i) => (
          <option key={i} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

async function fetchCase(caseId) {
  const resRaw = await fetch(`/api/dashboard/case?id=${caseId}`, {
    method: "GET",
  });
  if (resRaw.ok) {
    const res = await resRaw.json();
    console.log("resJson 2: ", JSON.stringify(res.success));
    return res.success;
  }
}

// const caseTypes = [{ value: "petition", text: "✍🏾 petition" }];
