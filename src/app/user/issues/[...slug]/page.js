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

export default function IssuePage({ params }) {
  const { data: session } = useSession();
  const { slug } = params;
  const {
    data: { issues, templates },
  } = useContext(DataContext);
  const router = useRouter();
  const [menuItems, setMenuItems] = useState({});
  const [selected, setSelected] = useState("");
  const [tab, setTab] = useState("profile");
  const [UIstate, setUIstate] = useState("loading");
  const [newIssue, setNewIssue] = useState({
    type: { type: "", category: "" },
    name: { value: "", error: "" },
    source: { value: "", error: "" },
    institution: {
      value: session.user.role.lisa ? "" : Object.keys(session.user.role)[0],
      error: "",
    },
  });
  // check slug and update selected
  useEffect(() => {
    if (slug[0] !== "new") {
      let issue_ = issues.find(({ _id }) => _id === slug[0]);
      if (issue_) {
        setSelected(issue_);
      } else {
        const fetchOptions = {
          method: "GET",
        };
        (async () => {
          const resRaw = await fetch(
            `/api/user/issue?id=${slug[0]}`,
            fetchOptions
          );
          if (resRaw.ok) {
            const res = await resRaw.json();
            console.log("resJson: ", JSON.stringify(res.success));
            setSelected(res.success);
          }
        })();
      }
    }
    setUIstate("OK");
  }, [issues, slug]);
  //update Categories after issue-type is updates
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
  //submit new issue
  async function initializeIssue() {
    if (
      !newIssue.name.value ||
      !newIssue.source.value ||
      !newIssue.institution.value
    ) {
      if (!newIssue.name.value) {
        setNewIssue((prev) => ({
          ...prev,
          name: { value: "", error: "Please provide a name" },
        }));
      } else if (!newIssue.source.value) {
        setNewIssue((prev) => ({
          ...prev,
          source: { value: "", error: "Please provide a source" },
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
          source: { name: newIssue.source.value },
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
          "SUCCESS: issue initialized\n > " +
            JSON.stringify(_res.success) +
            "\n.............."
        );
        toast.success("Issue initialized!");
        router.push(`/user/issues/${_res.success.insertedId}`);
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
  //
  function newIssueFieldsUpdateFunc(field) {}
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
                          newIssue.type.type === "petition"
                            ? "Petitioner*"
                            : "Source*"
                        }
                        name="source"
                        placeholder={
                          newIssue.type.type === "petition"
                            ? "Petitioner"
                            : "Source"
                        }
                        value={newIssue.source}
                        setValue={({ value, error }) =>
                          setNewIssue((prev) => ({
                            ...prev,
                            source: { value, error },
                          }))
                        }
                      />
                      {session.user.role.lisa && (
                        <InputText
                          label="Institution"
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
                          source: { value: "", error: "" },
                          institution: { value: "", error: "" },
                        });
                      }}
                    />
                  </>
                )}
              </div>
            </div>
          ) : selected ? (
            <div>
              <ul className="items-center justify-center flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                <li className="me-2">
                  <div
                    className={`${
                      tab === "profile"
                        ? "border-gray-300 text-gray-600 dark:text-gray-300"
                        : "border-transparent"
                    } cursor-pointer inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group`}
                  >
                    <svg
                      className="w-4 h-4 me-2 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M5 11.424V1a1 1 0 1 0-2 0v10.424a3.228 3.228 0 0 0 0 6.152V19a1 1 0 1 0 2 0v-1.424a3.228 3.228 0 0 0 0-6.152ZM19.25 14.5A3.243 3.243 0 0 0 17 11.424V1a1 1 0 0 0-2 0v10.424a3.227 3.227 0 0 0 0 6.152V19a1 1 0 1 0 2 0v-1.424a3.243 3.243 0 0 0 2.25-3.076Zm-6-9A3.243 3.243 0 0 0 11 2.424V1a1 1 0 0 0-2 0v1.424a3.228 3.228 0 0 0 0 6.152V19a1 1 0 1 0 2 0V8.576A3.243 3.243 0 0 0 13.25 5.5Z" />
                    </svg>
                    Issue Profile
                  </div>
                </li>
                <li className="me-2">
                  <div
                    className={`${
                      tab === "documents"
                        ? "border-gray-300 text-gray-600 dark:text-gray-300"
                        : "border-transparent"
                    } cursor-pointer inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group`}
                  >
                    <svg
                      className="w-4 h-4 me-2 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 18 20"
                    >
                      <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
                    </svg>
                    Documents
                  </div>
                </li>
              </ul>
            </div>
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
                  click here{" "}
                </Link>
                to go view all issues
              </p>
            </div>
          )}
        </div>
        {/* content */}
        <form className="mx-4 my-6">
          <div class="grid gap-6 mb-6 md:grid-cols-2">
            {/* <InputText /> */}
            <div>
              <label
                for="last_name"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Last name
              </label>
              <input
                type="text"
                id="last_name"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Doe"
                required
              />
            </div>
            <div>
              <label
                for="company"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Company
              </label>
              <input
                type="text"
                id="company"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Flowbite"
                required
              />
            </div>
            <div>
              <label
                for="phone"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Phone number
              </label>
              <input
                type="tel"
                id="phone"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="123-45-678"
                pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
                required
              />
            </div>
            <div>
              <label
                for="website"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Website URL
              </label>
              <input
                type="url"
                id="website"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="flowbite.com"
                required
              />
            </div>
            <div>
              <label
                for="visitors"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Unique visitors (per month)
              </label>
              <input
                type="number"
                id="visitors"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder=""
                required
              />
            </div>
          </div>
          <div class="mb-6">
            <label
              for="email"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Email address
            </label>
            <input
              type="email"
              id="email"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="john.doe@company.com"
              required
            />
          </div>
          <div class="mb-6">
            <label
              for="password"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="•••••••••"
              required
            />
          </div>
          <div class="mb-6">
            <label
              for="confirm_password"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Confirm password
            </label>
            <input
              type="password"
              id="confirm_password"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="•••••••••"
              required
            />
          </div>
          <div class="flex items-start mb-6">
            <div class="flex items-center h-5">
              <input
                id="remember"
                type="checkbox"
                value=""
                class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
                required
              />
            </div>
            <label
              for="remember"
              class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              I agree with the{" "}
              <a
                href="#"
                class="text-blue-600 hover:underline dark:text-blue-500"
              >
                terms and conditions
              </a>
              .
            </label>
          </div>
          <button
            type="submit"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Submit
          </button>
        </form>
      </div>
    </main>
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

const issueTypes = [{ value: "petition", text: "✍🏾 petition" }];

const initMessage = "Hello you, provide a name for the issue to initialize it.";

const replyMessage =
  "Im ok what about you. Im ok what about you. Im ok what about you. Im ok what about you. Im ok what about you. Im ok what about you. Im ok what about you?";
