import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEdgeStore } from "@/lib/edgestore";
import { ButtonPrimary, ButtonDestructive } from "@/components/atoms/buttons";
import toast from "react-hot-toast";
import {
  SVGbuilding,
  SVGdoc,
  SVGfilter,
  SVGuser,
} from "@/components/atoms/svgs";
import UserViewArea from "./viewUser";
import { httpCodes } from "@/lib/configs";

import {
  emailValidator,
  nameValidator,
  telValidator,
} from "@/helpers/inputValidators";
import { InputSelect, InputText, InputDate } from "./inputs";
import Link from "next/link";

export default function ViewInstitution({
  instUsers,
  selected,
  selectedUser,
  refreshData,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [filterPhrase, setFilterPhrase] = useState(searchParams.get("filter"));

  // states
  const [userEdit, setUserEdits] = useState({});
  const [instEdit, setInstEdit] = useState({});
  const [filtUsers, setFiltUsers] = useState([]);
  const [errFields, setErrFields] = useState(new Set());
  const [UIstate, setUIstate] = useState("");

  // load filt-Users
  useEffect(() => {
    setFiltUsers(
      filterPhrase
        ? instUsers.filter(({ role }) => role === filterPhrase)
        : instUsers
    );
  }, [filterPhrase, instUsers]);

  // render
  return (
    <div id="view-institution">
      {/* header */}
      <ul className="items-center justify-center flex flex-wrap -mb-px font-medium text-sm text-center">
        <li className="me-2">
          <Link
            href={`/dashboard/institutions/${selected.id}`}
            className={`${
              !selectedUser
                ? "card m-0 mt-2"
                : "border-transparent from-transparent to-transparent text-gray-500 dark:text-gray-400"
            } min-w-48 rounded-lg m-0 mt-2 cursor-pointer inline-flex border border-transparent items-center justify-center p-4 hover:border-emerald-700 dark:hover:border-emerald-200 group`}
            // onClick={() => {
            //   setTab("profile");
            //   // resetStates()
            // }}
          >
            <SVGdoc className="w-4 h-4 me-2 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300" />
            Details
          </Link>
        </li>
        <li className="me-2">
          <Link
            href={`/dashboard/institutions/${selected.id}/new`}
            className={`${
              selectedUser
                ? "card m-0 mt-2"
                : "border-transparent from-transparent to-transparent text-gray-500 dark:text-gray-400"
            } min-w-48 rounded-lg m-0 mt-2 cursor-pointer inline-flex border border-transparent items-center justify-center p-4 hover:border-emerald-700 dark:hover:border-emerald-200 group`}
            // onClick={() => {
            //   setTab("users");
            //   // resetStates();
            // }}
          >
            <SVGuser className="w-4 h-4 me-2 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300" />
            Users
          </Link>
        </li>
      </ul>
      {/* content */}
      <form className="card p-6 overflow-x-auto">
        {!selectedUser ? (
          <>
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center h-5">
                <input
                  id="edit-profile"
                  type="checkbox"
                  // // defaultChecked={edit === "profile"}
                  // checked={edit === "profile"}
                  // onChange={(e) => {
                  //   if (e.target.checked) setEdit("profile");
                  //   else {
                  //     setEdit("");
                  //     resetCaseProfileStates();
                  //   }
                  // }}
                  className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
                />
              </div>
              <label
                htmlFor="edit-profile"
                className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                edit
              </label>
            </div>
            <div id="name-details" className="mb-4">
              {/* <InputText
                label={`Client (${client.party})`}
                name="client-name"
                placeholder="Client name"
                value={client.name}
                setValue={(val) =>
                  setClient((prev) => ({ ...prev, name: val }))
                }
                errFields={errFields}
                setErrFields={setErrFields}
                valValidator={nameValidator}
                readOnly={edit !== "profile"}
              /> */}
              Inputs Here
              <div id="name-dropdown-button" className="mx-6">
                <button
                  type="button"
                  className="flex items-center justify-between w-full font-medium text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400 gap-3"
                  // onClick={() => {
                  //   setExpanded((prev) =>
                  //     prev === "client-name" ? "" : "client-name"
                  //   );
                  // }}
                >
                  <span className="text-xs">more fields</span>
                  <svg
                    data-accordion-icon
                    // className={`w-3 h-3 shrink-0 ${
                    //   expandedField !== "client-name" ? "rotate-180" : ""
                    // }`}
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5 5 1 1 5"
                    />
                  </svg>
                </button>
              </div>
              <div
                id="client-more-fields"
                // className={`${
                //   expandedField === "client-name" ? "" : "hidden"
                // } mx-6 md:mx-8`}
              >
                <div className="py-5 border-b border-gray-200 dark:border-gray-700">
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* <InputText
                      name="client-tel"
                      placeholder="Telephone number"
                      value={client.tel}
                      setValue={(val) =>
                        setClient((prev) => ({ ...prev, tel: val }))
                      }
                      errFields={errFields}
                      setErrFields={setErrFields}
                      valValidator={telValidator}
                      readOnly={edit !== "profile"}
                    />
                    <InputText
                      name="client-email"
                      placeholder="Email address"
                      value={client.email}
                      setValue={(val) =>
                        setClient((prev) => ({ ...prev, email: val }))
                      }
                      errFields={errFields}
                      setErrFields={setErrFields}
                      valValidator={emailValidator}
                      readOnly={edit !== "profile"}
                    /> */}{" "}
                    Inputs here
                  </div>
                </div>
              </div>
            </div>
            {/* {otherParty.party && ( */}
            <div id="otherParty-details" className="mb-4">
              {/* <InputText
                  label={strPascalcase(otherParty.party)}
                  name="otherParty-name"
                  placeholder={`${otherParty.party} name`}
                  value={otherParty.name}
                  setValue={(val) =>
                    setOtherParty((prev) => ({ ...prev, name: val }))
                  }
                  errFields={errFields}
                  setErrFields={setErrFields}
                  valValidator={nameValidator}
                  readOnly={edit !== "profile"}
                /> */}
              Input here
              <div id="otherParty-dropdown-button" className="mx-6">
                <button
                  type="button"
                  className="flex items-center justify-between w-full font-medium text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400 gap-3"
                  // onClick={() => {
                  //   setExpanded((prev) =>
                  //     prev === "otherParty-name" ? "" : "otherParty-name"
                  //   );
                  // }}
                >
                  <span className="text-xs">more fields</span>
                  <svg
                    data-accordion-icon
                    // className={`w-3 h-3 shrink-0 ${
                    //   expandedField !== "otherParty-name" ? "rotate-180" : ""
                    // }`}
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5 5 1 1 5"
                    />
                  </svg>
                </button>
              </div>
              <div
                id="otherParty-more-fields"
                // className={`${
                //   expandedField === "otherParty-name" ? "" : "hidden"
                // } mx-6 md:mx-8`}
              >
                <div className="py-5 border-b border-gray-200 dark:border-gray-700">
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* <InputText
                      name="otherParty-tel"
                      placeholder="Telephone number"
                      value={otherParty.tel}
                      setValue={(val) =>
                        setOtherParty((prev) => ({ ...prev, tel: val }))
                      }
                      errFields={errFields}
                      setErrFields={setErrFields}
                      valValidator={telValidator}
                      readOnly={edit !== "profile"}
                    /> */}
                    {/* <InputText
                        name="otherParty-email"
                        placeholder="Email address"
                        value={otherParty.email}
                        setValue={(val) =>
                          setOtherParty((prev) => ({ ...prev, email: val }))
                        }
                        errFields={errFields}
                        setErrFields={setErrFields}
                        valValidator={emailValidator}
                        readOnly={edit !== "profile"}
                      /> */}
                    Input here
                  </div>
                </div>
              </div>
            </div>
            {/* )} */}
            <div id="case-lawyer" className="mb-4 space-y-2">
              <label htmlFor="lawyer" className="px-2">
                Lawyer
              </label>
              {/* <InputSelect
                name="lawyer"
                optionItems={[
                  { value: "overdue", text: "❗ overdue" },
                  { value: "due", text: "✍🏾 due" },
                  { value: "done", text: "✔️ Done" },
                ]}
                value={lawyer}
                onChange={(e) => {
                  setLawyer(e.target.value);
                }}
                icon={SVGuser}
                defaultOption="lawyer"
              /> */}
              Inputs here 324
            </div>
            <div id="court-name" className="mb-4">
              {/* <InputText
                label="Court"
                name="court"
                placeholder="Court name"
                value={court}
                setValue={(val) => setCourt(val)}
                errFields={errFields}
                setErrFields={setErrFields}
                valValidator={nameValidator}
                readOnly={edit !== "profile"}
              /> */}{" "}
              Input here court
            </div>
            <div className="flex items-center mb-4 pl-4">
              <div className="flex items-center h-5">
                <input
                  id="case-status"
                  type="checkbox"
                  // checked={status === "open"}
                  // onChange={(e) => {
                  //   if (e.target.checked) setStatus("open");
                  //   else setStatus("closed");
                  // }}
                  className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
                  // disabled={edit !== "profile"}
                />
              </div>
              <label
                htmlFor="case-status"
                className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Active
              </label>
              <div className="ml-6 mt-4">
                {/* <InputText
                  name="description"
                  placeholder="Status description"
                  value={description}
                  setValue={(val) => setDescription(val)}
                  errFields={errFields}
                  setErrFields={setErrFields}
                  readOnly={edit !== "profile"}
                /> */}{" "}
                Input here 32r
              </div>
            </div>
            {/* {edit === "profile" && ( */}
            <div className="max-w-lg mx-auto">
              <div className="mb-4">
                <ButtonPrimary
                  label="Submit Case changes"
                  loading={UIstate === "loading"}
                  onClick={handleEditInstit}
                />
              </div>
              <div className="flex justify-center">
                <ButtonDestructive
                  label="Delete Case"
                  loading={UIstate === "loading"}
                  onClick={handleDeleteInstit}
                />
              </div>
            </div>
            {/* )} */}
          </>
        ) : selectedUser ? (
          <>
            <div className="max-w-xs mb-4 mr-auto">
              <InputSelect
                name="filterPhrase"
                optionItems={[
                  { value: "lawyer", text: "✍🏾 lawyer" },
                  { value: "admin", text: "💼 administrator" },
                ]}
                value={filterPhrase}
                onChange={(e) => {
                  setFilterPhrase(e.target.value);
                }}
                icon={SVGfilter}
                defaultOption="filter"
              />
            </div>

            <div className="md:flex">
              <ul className="flex-column space-y space-y-4 text-sm font-medium text-gray-500 dark:text-gray-400 md:me-4 mb-4 md:mb-0">
                <li
                // onClick={() => {
                //   setTask({
                //     type: "new",
                //     item: {
                //       type: "",
                //       name: "",
                //       description: "",
                //       dueDate: "",
                //       reminders: [],
                //     },
                //   });
                //   setDocAttachment("");
                // }}
                >
                  <Link
                    href={`/dashboard/institutions/${selected.id}/new?filter=${filterPhrase}`}
                    // onClick={() => {
                    //   setTab({
                    //     type: "new",
                    //   });
                    //   setDocAttachment("");
                    // }}
                    className={`${
                      selectedUser === "new"
                        ? "text-emerald-700 bg-emerald-100 dark:bg-emerald-700 dark:text-white border-transparent dark:border-transparent"
                        : ""
                    } min-w-[124px] inline-flex items-center px-4 py-3 rounded-lg w-full border border-neutral-400 dark:border-neutral-500 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white hover:border-transparent dark:hover:border-transparent cursor-pointer`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4 me-2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                    New User
                  </Link>
                  {/* <div
                    className={`${
                      selectedUser === "new"
                        ? "text-emerald-700 bg-emerald-100 dark:bg-emerald-700 dark:text-white border-transparent dark:border-transparent"
                        : ""
                    } min-w-[124px] inline-flex items-center px-4 py-3 rounded-lg w-full border border-neutral-400 dark:border-neutral-500 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white hover:border-transparent dark:hover:border-transparent cursor-pointer`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4 me-2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                    New task
                  </div> */}
                </li>
                {filtUsers?.map((users_) => (
                  <li key={users_.id}>
                    <Link
                      href={`/dashboard/institutions/${selected.id}/${users_.id}?filter=${filterPhrase}`}
                      // onClick={() => {
                      //   setTask({
                      //     type: "task",
                      //     item: selectedCase.tasks.find(
                      //       ({ id }) => id === taskItem.id
                      //     ),
                      //   });
                      //   setDocAttachment("");
                      // }}
                      className={`${
                        selectedUser.id === users_.id
                          ? "text-emerald-700 bg-gray-100 dark:bg-gray-700 dark:text-emerald-200"
                          : ""
                      } min-w-[124px] inline-flex items-center px-4 py-3 rounded-lg  bg-slate-50 w-full dark:bg-gray-800 hover:text-emerald-700 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-emerald-200 cursor-pointer`}
                    >
                      <SVGuser
                        className={`${
                          selectedUser.id === users_.id
                            ? "text-emerald-600"
                            : "text-gray-500 dark:text-gray-400"
                        } w-4 h-4 me-2 `}
                      />

                      {users_.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <UserViewArea
                selectedUser={selectedUser}
                userEdits={{ userEdit, setUserEdits }}
                handleCreateUser={handleCreateUser}
                handleEditUser={handleEditUser}
                handleDeleteUser={handleDeleteUser}
                errFields={errFields}
                setErrFields={setErrFields}
                UIstate={UIstate}
              />
            </div>
          </>
        ) : null}
      </form>
    </div>
  );

  //func to reset case-states
  function resetCaseProfileStates() {
    setClient(defaultClient);
    setOtherParty(defaultOtherParty);
    setCourt(selected.court ?? "");
    setStatus(selected.status ?? "");
  }
  //func to reset task-state
  function resetTaskStates() {
    setFilterPhrase("");
    setTask({ type: "", item: "" });
    setDocAttachment("");
  }
  //func to Update Case
  async function handleEditInstit() {
    if (!selected.id) {
      toast.error("Sorry, case could not be found");
      return;
    }
    console.log("EDIT: \n > ", instEdit);
    // const { name, email, role, institutions } = instEdit;
    return;
    //validate fields
    const err_clientName = client.name ? nameValidator(client.name) : "";
    const err_clientTel = client.tel ? telValidator(client.tel) : "";
    const err_clientEmail = client.email ? emailValidator(client.email) : "";
    const err_otherPartyName = otherParty.name
      ? nameValidator(otherParty.name)
      : "";
    const err_otherPartyTel = otherParty.tel
      ? telValidator(otherParty.tel)
      : "";
    const err_otherPartyEmail = otherParty.email
      ? emailValidator(otherParty.email)
      : "";
    if (
      err_clientName ||
      err_clientTel ||
      err_clientEmail ||
      err_otherPartyName ||
      err_otherPartyTel ||
      err_otherPartyEmail
    ) {
      if (err_clientName) {
        setErrFields((prev) => new Set([...prev, "client-name"]));
        toast.error("Invalid client name");
      }
      if (err_clientTel) {
        setErrFields((prev) => new Set([...prev, "client-tel"]));
        toast.error("Invalid client Telephone No.");
      }
      if (err_clientEmail) {
        setErrFields((prev) => new Set([...prev, "client-email"]));
        toast.error("Invalid client email");
      }
      if (err_otherPartyName) {
        setErrFields((prev) => new Set([...prev, "otherParty-name"]));
        toast.error("Invalid name for the other party");
      }
      if (err_otherPartyTel) {
        setErrFields((prev) => new Set([...prev, "otherParty-tel"]));
        toast.error("Invalid Telephone No. for the other party");
      }
      if (err_otherPartyEmail) {
        setErrFields((prev) => new Set([...prev, "otherParty-email"]));
        toast.error("Invalid email for the other party");
      }
      return;
    }
    // fetch options
    let fetchOptions = {
      method: "PUT",
      body: JSON.stringify({
        id: selected.id,
        clientName: client.name,
        clientTel: client.tel,
        clientEmail: client.email,
        otherPartyName: otherParty.name,
        otherPartyTel: otherParty.tel,
        otherPartyEmail: otherParty.email,
        court,
        status,
        description,
      }),
    };
    setUIstate("loading");
    // PUT request using fetch
    const _res = await fetch("/api/dashboard/case", fetchOptions).then(
      async (res_) => {
        if (res_.ok) {
          return await res_.json();
        } else {
          console.log(`ERROR: ` + JSON.stringify(res_));
          toast.error("OOPS: case not updated");
        }
      }
    );
    if (_res?.success) {
      console.log(
        "SUCCESS: Case updated successfully\n > " +
          JSON.stringify(_res.success) +
          "\n.............."
      );
      await refreshData();
      toast.success("Case updated successfully!");
      setUIstate("OK");
    } else {
      console.error(
        "ERROR: failed to update case at /dashboard/institutions/[...instIDuser] - viewCase.js iAA \n > " +
          JSON.stringify(_res) +
          "\n.............."
      );
      toast.error(_res?.error ?? "No Response, check internet connection");
    }
  }
  //func to Delete Case
  async function handleDeleteInstit() {
    if (!selected.id) {
      toast.error("Sorry, case could not be found");
      return;
    }
    console.log("To delete: \n > ", selected);
    // fetch options
    let fetchOptions = {
      method: "DELETE",
      body: JSON.stringify({
        id: selected.id,
      }),
    };
    setUIstate("loading");
    // PUT request using fetch
    const _res = await fetch("/api/dashboard/case", fetchOptions).then(
      async (res_) => {
        if (res_.ok) {
          return await res_.json();
        } else {
          console.error(`ERROR: ` + JSON.stringify(res_));
          toast.error("OOPS: case not deleted");
        }
      }
    );
    if (_res?.success) {
      console.log(
        "SUCCESS: case deleted\n > " +
          JSON.stringify(_res.success) +
          "\n.............."
      );
      await refreshData();
      toast.success("Institution");
      router.replace("/dashboard/institutions");
    } else {
      console.error(
        "ERROR: failed to delete case at /dashboard/Institution/[...instIDuser] - viewCase.js iBB\n > " +
          JSON.stringify(_res) +
          "\n.............."
      );
      toast.error(_res?.error ?? "No Response, check internet connection");
    }
  }
  //func to Create User
  async function handleCreateUser() {
    // validate
    if (session.user.role !== "admin") {
      toast.error("User validation failed");
      return;
    }
    // fetch options
    let fetchOptions = {
      method: "POST",
      body: JSON.stringify({
        ...userEdit,
        institutionId: selected.id,
      }),
    };
    setUIstate("loading");
    // POST request using fetch
    const response = await fetch("/api/dashboard/user", fetchOptions).then(
      async (res_) => {
        if (res_?.status === 200) {
          return await res_.json();
        } else {
          setUIstate("OK");
          console.log(`ERROR: ` + JSON.stringify(res_));
          toast.error(httpCodes[res_?.status] ?? "Unknown error");
          return;
        }
      }
    );
    if (!response) return;
    if (response.success) {
      console.log(
        "SUCCESS: user created\n > ",
        response.success,
        "\n.............."
      );
      toast.success("User created!");
      await refreshData();
      router.push(
        `/dashboard/institutions/${selected.id}/${response.success.id}`
      );
    } else {
      console.log(
        "FAILED: User not created\n > ",
        response,
        "\n.............."
      );
      toast.error(response.failed ?? response.error ?? "Unknown error");
    }
    setUIstate("OK");
  }
  //func to Edit User
  async function handleEditUser() {
    if (session.user.role !== "admin") {
      toast.error("User validation failed");
      return;
    }

    console.log("UPDATES: \n > ", userEdit);
    // const { name, email, role, institutions } = userEdit;
    return;
    //loading
    setUIstate("loading");
    try {
      //fetch options
      const fetchOptions = {
        method: "PUT",
        body: JSON.stringify({
          id: selectedTask.item.id,
          completedByID: session.user.id,
        }),
      };
      // PUT request using fetch
      const _resComplete = await fetch(
        "/api/dashboard/task",
        fetchOptions
      ).then(async (res_) => {
        if (res_.status === 200) {
          return await res_.json();
        } else {
          console.error(`ERROR: ` + JSON.stringify(res_));
          toast.error("OOPS: task not initialized");
        }
      });
      if (_resComplete?.success) {
        console.log(
          "SUCCESS: task completed\n > " +
            JSON.stringify(_resComplete.success) +
            "\n.............."
        );
        await refreshData();
        toast.success("Upser Info updated!");
        // router.push(
        //   `/dashboard/institution/${selectedCase.id}/${_resComplete.success.id}`
        // );
        router.refresh();
      } else {
        if (_resComplete?.failed) toast.error(_resComplete?.failed);
        else
          toast.error(
            _resComplete?.error ?? "No Response, check internet connection"
          );
      }
    } catch (error) {
      console.error("ERROR: ", error.message);
    }
    setUIstate("OK");
  }
  //func to Delete User
  async function handleDeleteUser() {
    if (!selectedUser) {
      toast.error("Selected user not found");
    }

    console.log("Delete: \n > ", selectedUser);
    // const { name, email, role, institutions } = userEdit;
    return;

    //loading
    setUIstate("loading");
    //fetch options
    let fetchOptions = {
      method: "DELETE",
      body: JSON.stringify({
        instiID: selected.id,
        userD: selectedUser.id,
      }),
    };
    // POST request using fetch
    const _res = await fetch("/api/dashboard/user", fetchOptions).then(
      async (res_) => {
        if (res_.ok) {
          return await res_.json();
        } else {
          console.error(`ERROR: ` + JSON.stringify(res_));
          toast.error("OOPS: user not deleted");
        }
      }
    );
    if (_res?.success) {
      console.log(
        "SUCCESS: user deleted\n > " +
          JSON.stringify(_res.success) +
          "\n.............."
      );
      toast.success("User deleted!");
      await refreshData();
      router.push(`/dashboard/institution/${selected.id}/new`);
    } else {
      if (_res?.failed) toast.error(_res?.failed);
      else toast.error(_res?.error ?? "No Response, check internet connection");
    }
    setUIstate("OK");
  }
}
