/**VERSION 0
 * This is version 0 of my code: optimized and standardized to develop the above
 */
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
import { InputSelect, InputText, InputDate, InputImage } from "./inputs";
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
  const { edgestore } = useEdgeStore();

  // states
  const [filterPhrase, setFilterPhrase] = useState(
    searchParams.get("filter") ?? ""
  );
  const [userEdit, setUserEdits] = useState({});
  const [instEdit, setInstEdit] = useState({});
  const [isInstUpdated, setIsInstUpdated] = useState(false);
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
  //check if any updates
  useEffect(() => {
    if (Object.keys(instEdit).length > 0) {
      const userIsUpdated = ((selected__, editObj) => {
        for (const key in editObj) {
          if (
            (selected__.hasOwnProperty(key) &&
              selected__[key] !== editObj[key]) ||
            editObj.hasOwnProperty("photoFile_")
          ) {
            console.log("Updates");
            return true;
          }
        }
        console.log("NO updates");
        return false;
      })(selected, instEdit);
      setIsInstUpdated(userIsUpdated);
    }
  }, [selected, instEdit]);

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
          <div className="flex flex-col space-y-4">
            <InputText
              label="Institution Name"
              name="inst-name"
              placeholder="Institution Name"
              value={instEdit.name ?? selected.name}
              setValue={(name_) =>
                setInstEdit((prev) => ({ ...prev, name: name_ }))
              }
              errFields={errFields}
              setErrFields={setErrFields}
              valValidator={nameValidator}
              // readOnly={edit !== "profile"}
            />

            <InputText
              label="Email Address"
              name="email-address"
              placeholder={`Email address of Institution`}
              value={instEdit.email ?? selected.email}
              setValue={(email_) =>
                setInstEdit((prev) => ({ ...prev, email: email_ }))
              }
              errFields={errFields}
              setErrFields={setErrFields}
              valValidator={emailValidator}
              // readOnly={edit !== "profile"}
            />

            <InputText
              label="Location"
              name="location"
              placeholder={`Location of Institution`}
              value={instEdit.location ?? selected.location ?? ""}
              setValue={(location_) =>
                setInstEdit((prev) => ({ ...prev, location: location_ }))
              }
              errFields={errFields}
              setErrFields={setErrFields}
              valValidator={nameValidator}
              // readOnly={edit !== "profile"}
            />
            <InputText
              label="Phone No."
              name="tel"
              placeholder={`Phone number of Institution`}
              value={instEdit.tel ?? selected.tel ?? ""}
              setValue={(tel_) =>
                setInstEdit((prev) => ({ ...prev, tel: tel_ }))
              }
              errFields={errFields}
              setErrFields={setErrFields}
              valValidator={telValidator}
              // readOnly={edit !== "profile"}
            />
            <div id="image-container" className="py-4">
              <InputImage
                _photo={selected.logoUrl ?? ""}
                setPhoto={async (photoFile_) => {
                  setInstEdit((prev_) => ({ ...prev_, photoFile_ }));
                }}
              />
            </div>

            <div className="max-w-lg mx-auto">
              <div className="mb-4">
                <ButtonPrimary
                  label="Submit Institution changes"
                  loading={UIstate === "loading"}
                  onClick={handleEditInstit}
                  disabled={!isInstUpdated}
                />
              </div>
              <div className="flex justify-center">
                <ButtonDestructive
                  label="Delete Institution"
                  loading={UIstate === "loading"}
                  onClick={handleDeleteInstit}
                />
              </div>
            </div>
            {/* )} */}
          </div>
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
                userEdits={{ userEdit: userEdit, setUserEdits }}
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
      toast.error("Sorry, institution could not be found");
      return;
    }
    console.log("EDIT: \n > ", instEdit);
    // const { email, location, name, photoFile_ } = instEdit;
    //upload image and retain url
    let photoUrl = null;
    if (instEdit.photoFile_) {
      photoUrl = await edgestore.publicFiles.upload({
        file: instEdit.photoFile_,
        // onProgressChange: (progress) => {
        //   // you can use this to show a progress bar
        //   console.log(progress);
        // },
      });
    }
    // console.log("photoUrl - ", photoUrl?.url || "NO LINK");
    // const { photoFile_, ...instEditWithoutPhotoFile_ } = instEdit;
    //Inst Object fields
    const fetchBody = {
      id: selected.id,
      name: instEdit.name || selected.name,
      email: instEdit.email || selected.email,
      location: instEdit.location || selected.location,
      logoUrl: photoUrl?.url || selected.logoUrl,
      tel: instEdit.tel || selected.tel,
    };
    // console.log("fetchBody - ", fetchBody);
    // return;
    // const err_clientName = client.name ? nameValidator(client.name) : "";
    // const err_clientTel = client.tel ? telValidator(client.tel) : "";
    // const err_clientEmail = client.email ? emailValidator(client.email) : "";
    // const err_otherPartyName = otherParty.name
    //   ? nameValidator(otherParty.name)
    //   : "";
    // const err_otherPartyTel = otherParty.tel
    //   ? telValidator(otherParty.tel)
    //   : "";
    // const err_otherPartyEmail = otherParty.email
    //   ? emailValidator(otherParty.email)
    //   : "";
    // if (
    //   err_clientName ||
    //   err_clientTel ||
    //   err_clientEmail ||
    //   err_otherPartyName ||
    //   err_otherPartyTel ||
    //   err_otherPartyEmail
    // ) {
    //   if (err_clientName) {
    //     setErrFields((prev) => new Set([...prev, "client-name"]));
    //     toast.error("Invalid client name");
    //   }
    //   if (err_clientTel) {
    //     setErrFields((prev) => new Set([...prev, "client-tel"]));
    //     toast.error("Invalid client Telephone No.");
    //   }
    //   if (err_clientEmail) {
    //     setErrFields((prev) => new Set([...prev, "client-email"]));
    //     toast.error("Invalid client email");
    //   }
    //   if (err_otherPartyName) {
    //     setErrFields((prev) => new Set([...prev, "otherParty-name"]));
    //     toast.error("Invalid name for the other party");
    //   }
    //   if (err_otherPartyTel) {
    //     setErrFields((prev) => new Set([...prev, "otherParty-tel"]));
    //     toast.error("Invalid Telephone No. for the other party");
    //   }
    //   if (err_otherPartyEmail) {
    //     setErrFields((prev) => new Set([...prev, "otherParty-email"]));
    //     toast.error("Invalid email for the other party");
    //   }
    //   return;
    // }

    // fetch options
    let fetchOptions = {
      method: "PUT",
      body: JSON.stringify(fetchBody),
    };
    setUIstate("loading");
    // PUT request using fetch
    const res = await fetch("/api/dashboard/institution", fetchOptions).then(
      async (res_) => {
        if (res_?.ok) {
          return await res_.json();
        } else {
          setUIstate("OK");
          console.log(`ERROR: ` + JSON.stringify(res_));
          toast.error(httpCodes[res_?.status] ?? "Unknown error");
          return;
        }
      }
    );

    if (!res) return;

    if (res.success) {
      console.log(
        "SUCCESS: Institution updated\n > ",
        res.success,
        "\n.............."
      );
      toast.success("Institution updated");
      await refreshData();
    } else {
      console.log(
        "FAILED: Institution not updated\n > ",
        res,
        "\n.............."
      );
      toast.error(res.failed ?? res.error ?? "Unknown error");
    }
    setUIstate("OK");
  }
  //func to Delete Case
  async function handleDeleteInstit() {
    if (!selected.id) {
      toast.error("Sorry, institution could not be found");
      return;
    }
    console.log("To delete inst: \n > ", selected);
    // fetch options
    let fetchOptions = {
      method: "DELETE",
      body: JSON.stringify({
        id: selected.id,
      }),
    };
    setUIstate("loading");
    // DELETE api-call using fetch
    const res = await fetch("/api/dashboard/institution", fetchOptions).then(
      async (res_) => {
        if (res_?.ok) {
          return await res_.json();
        } else {
          setUIstate("OK");
          console.log(`ERROR: ` + JSON.stringify(res_));
          toast.error(httpCodes[res_?.status] ?? "Unknown error");
          return;
        }
      }
    );

    if (!res) return;

    if (res.success) {
      console.log(
        "SUCCESS: Institution deleted\n > ",
        res.success,
        "\n.............."
      );
      toast.success("Institution deleted");
      await refreshData();
      router.replace(`/dashboard/institutions/`);
    } else {
      console.log(
        "FAILED: Institution not deleted\n > ",
        res,
        "\n.............."
      );
      toast.error(res.failed ?? res.error ?? "Unknown error");
    }
    setUIstate("OK");
  }
  //func to Create User
  async function handleCreateUser() {
    // validate
    if (session.user.role !== "admin") {
      toast.error("User validation failed");
      return;
    }
    setUIstate("loading");
    //upload image and retain url
    let photoUrl = "";
    if (userEdit.photoFile_) {
      photoUrl = await edgestore.publicFiles.upload({
        file: userEdit.photoFile_,
        // onProgressChange: (progress) => {
        //   // you can use this to show a progress bar
        //   console.log(progress);
        // },
      }).url;
    }
    const { photoFile_, ...userEditWithoutPhotoFile } = userEdit;
    // fetch options
    let fetchOptions = {
      method: "POST",
      body: JSON.stringify({
        ...userEditWithoutPhotoFile,
        photoUrl,
        institutionId: selected.id,
      }),
    };
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
        response.success.email,
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

    console.log("UPDATES: \n > ", { ...userEdit, userID: selectedUser.id });
    // return;
    //loading
    setUIstate("loading");
    try {
      //fetch options
      const fetchOptions = {
        method: "PUT",
        body: JSON.stringify({ ...userEdit, userID: selectedUser.id }),
      };
      // PUT request using fetch
      const _resComplete = await fetch(
        "/api/dashboard/user",
        fetchOptions
      ).then(async (res_) => {
        if (res_?.status === 200) {
          return await res_.json();
        } else {
          setUIstate("OK");
          console.log(`ERROR: ` + JSON.stringify(res_));
          toast.error(httpCodes[res_?.status] ?? "Unknown error");
          return;
        }
      });
      if (!_resComplete) return;
      if (_resComplete.success) {
        console.log(
          "SUCCESS: user updated\n > ",
          _resComplete.success,
          "\n.............."
        );
        toast.success("User updated");
        await refreshData();
        // router.push(
        //   `/dashboard/institutions/${selected.id}/${_resComplete.success.id}`
        // );
      } else {
        console.log("FAILED: User NOT updated\n > ", _resComplete);
        toast.error(
          _resComplete.failed || _resComplete.error || "Unknown error"
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

    //loading
    setUIstate("loading");
    //fetch options
    let fetchOptions = {
      method: "DELETE",
      body: JSON.stringify({
        userID: selectedUser.id,
      }),
    };
    // POST request using fetch
    const _res = await fetch("/api/dashboard/user", fetchOptions).then(
      async (res_) => {
        if (res_.ok) {
          return await res_.json();
        } else {
          console.error(`ERROR: ` + JSON.stringify(res_));
          toast.error("user NOT deleted");
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
      // router.replace(`/dashboard/institution/${selected.id}/new`);
    } else {
      toast.error(_res?.failed || _res?.error || "Unknown error");
    }
    setUIstate("OK");
  }
}

/** ONGOING OPTIMIZATION: version2
 *
 *
 */
// import { useState, useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useSession } from "next-auth/react";
// import { useEdgeStore } from "@/lib/edgestore";
// import { ButtonPrimary, ButtonDestructive } from "@/components/atoms/buttons";
// import toast from "react-hot-toast";
// import {
//   SVGbuilding,
//   SVGdoc,
//   SVGfilter,
//   SVGuser,
// } from "@/components/atoms/svgs";
// import UserViewArea from "./viewUser";
// import { httpCodes } from "@/lib/configs";
// import {
//   emailValidator,
//   nameValidator,
//   telValidator,
// } from "@/helpers/inputValidators";
// import { InputSelect, InputText, InputDate, InputImage } from "./inputs";
// import Link from "next/link";

// export default function ViewInstitution({
//   instUsers,
//   selected,
//   selectedUser,
//   refreshData,
// }) {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const { data: session } = useSession();
//   const { edgestore } = useEdgeStore();
//   const [filterPhrase, setFilterPhrase] = useState(searchParams.get("filter"));
//   const [userEdit, setUserEdits] = useState({});
//   const [instEdit, setInstEdit] = useState({});
//   const [isInstUpdated, setIsInstUpdated] = useState(false);
//   const [filtUsers, setFiltUsers] = useState([]);
//   const [errFields, setErrFields] = useState(new Set());
//   const [UIstate, setUIstate] = useState("");

//   useEffect(() => {
//     setFiltUsers(
//       filterPhrase
//         ? instUsers.filter(({ role }) => role === filterPhrase)
//         : instUsers
//     );
//   }, [filterPhrase, instUsers]);

//   useEffect(() => {
//     setIsInstUpdated(checkIfInstUpdated(selected, instEdit));
//   }, [selected, instEdit]);

//   const handleInputChange = (field, value) => {
//     setInstEdit((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleEditInstit = async () => {
//     if (!selected.id) {
//       toast.error("Sorry, institution could not be found");
//       return;
//     }

//     const photoUrl = instEdit.photoFile_
//       ? await edgestore.publicFiles.upload({ file: instEdit.photoFile_ }).url
//       : selected.logoUrl;

//     const fetchBody = {
//       ...selected,
//       ...instEdit,
//       logoUrl: photoUrl,
//     };

//     if (validateInputs(fetchBody)) {
//       setUIstate("loading");

//       const res = await fetch("/api/dashboard/institution", {
//         method: "PUT",
//         body: JSON.stringify(fetchBody),
//       });

//       handleResponse(res, "Institution updated", refreshData, router.refresh);
//     }
//   };

//   const handleDeleteInstit = async () => {
//     if (!selected.id) {
//       toast.error("Sorry, institution could not be found");
//       return;
//     }

//     setUIstate("loading");

//     const res = await fetch("/api/dashboard/institution", {
//       method: "DELETE",
//       body: JSON.stringify({ id: selected.id }),
//     });

//     handleResponse(res, "Institution deleted", () =>
//       router.replace(`/dashboard/institutions/`)
//     );
//   };

//   const handleCreateUser = async () => {
//     if (session.user.role !== "admin") {
//       toast.error("User validation failed");
//       return;
//     }

//     setUIstate("loading");

//     const photoUrl = userEdit.photoFile_
//       ? await edgestore.publicFiles.upload({ file: userEdit.photoFile_ }).url
//       : "";

//     const fetchBody = { ...userEdit, photoUrl, institutionId: selected.id };

//     const res = await fetch("/api/dashboard/user", {
//       method: "POST",
//       body: JSON.stringify(fetchBody),
//     });

//     handleResponse(res, "User created!", refreshData, () =>
//       router.push(`/dashboard/institutions/${selected.id}/${res.success.id}`)
//     );
//   };

//   const handleEditUser = async () => {
//     if (session.user.role !== "admin") {
//       toast.error("User validation failed");
//       return;
//     }

//     setUIstate("loading");

//     const res = await fetch("/api/dashboard/task", {
//       method: "PUT",
//       body: JSON.stringify({
//         id: selectedTask.item.id,
//         completedByID: session.user.id,
//       }),
//     });

//     handleResponse(res, "User Info updated!", refreshData, router.refresh);
//   };

//   const handleDeleteUser = async () => {
//     if (!selectedUser) {
//       toast.error("Selected user not found");
//       return;
//     }

//     setUIstate("loading");

//     const res = await fetch("/api/dashboard/user", {
//       method: "DELETE",
//       body: JSON.stringify({
//         instiID: selected.id,
//         userD: selectedUser.id,
//       }),
//     });

//     handleResponse(res, "User deleted!", refreshData, () =>
//       router.push(`/dashboard/institution/${selected.id}/new`)
//     );
//   };

//   const validateInputs = (inputs) => {
//     const validationErrors = [];

//     if (inputs.name && nameValidator(inputs.name))
//       validationErrors.push("Invalid institution name");
//     if (inputs.email && emailValidator(inputs.email))
//       validationErrors.push("Invalid institution email");
//     if (inputs.tel && telValidator(inputs.tel))
//       validationErrors.push("Invalid institution telephone");

//     validationErrors.forEach((error) => toast.error(error));

//     return validationErrors.length === 0;
//   };

//   const checkIfInstUpdated = (selected, editObj) => {
//     for (const key in editObj) {
//       if (
//         (selected.hasOwnProperty(key) && selected[key] !== editObj[key]) ||
//         editObj.hasOwnProperty("photoFile_")
//       ) {
//         return true;
//       }
//     }
//     return false;
//   };

//   const handleResponse = async (
//     response,
//     successMessage,
//     onSuccess,
//     onFinally
//   ) => {
//     const res = await response.json();
//     setUIstate("OK");

//     if (response.ok && res.success) {
//       toast.success(successMessage);
//       onSuccess();
//       onFinally();
//     } else {
//       toast.error(res.failed || res.error || "Unknown error");
//     }
//   };

//   return (
//     <div id="view-institution">
//       <ul className="items-center justify-center flex flex-wrap -mb-px font-medium text-sm text-center">
//         <li className="me-2">
//           <Link
//             href={`/dashboard/institutions/${selected.id}`}
//             className={linkClass(selectedUser, true)}
//           >
//             <SVGdoc className={svgClass(selectedUser, true)} />
//             Details
//           </Link>
//         </li>
//         <li className="me-2">
//           <Link
//             href={`/dashboard/institutions/${selected.id}/new`}
//             className={linkClass(selectedUser, false)}
//           >
//             <SVGuser className={svgClass(selectedUser, false)} />
//             Users
//           </Link>
//         </li>
//       </ul>
//       <form className="card p-6 overflow-x-auto">
//         {!selectedUser ? (
//           <>
//             <InputText
//               label="Institution Name"
//               name="inst-name"
//               placeholder="Institution Name"
//               value={instEdit.name ?? selected.name}
//               setValue={(val) => handleInputChange("name", val)}
//               errFields={errFields}
//               setErrFields={setErrFields}
//               valValidator={nameValidator}
//             />
//             <InputText
//               label="Email Address"
//               name="email-address"
//               placeholder="Email address of Institution"
//               value={instEdit.email ?? selected.email}
//               setValue={(val) => handleInputChange("email", val)}
//               errFields={errFields}
//               setErrFields={setErrFields}
//               valValidator={emailValidator}
//             />
//             <InputText
//               label="Location"
//               name="location"
//               placeholder="Location of Institution"
//               value={instEdit.location ?? selected.location ?? ""}
//               setValue={(val) => handleInputChange("location", val)}
//               errFields={errFields}
//               setErrFields={setErrFields}
//               valValidator={nameValidator}
//             />
//             <InputText
//               label="Phone No."
//               name="tel"
//               placeholder="Phone number of Institution"
//               value={instEdit.tel ?? selected.tel ?? ""}
//               setValue={(val) => handleInputChange("tel", val)}
//               errFields={errFields}
//               setErrFields={setErrFields}
//               valValidator={telValidator}
//             />
//             <InputImage
//               _photo={selected.logoUrl ?? ""}
//               setPhoto={async (photoFile_) =>
//                 setInstEdit((prev) => ({ ...prev, photoFile_ }))
//               }
//             />

//             <div className="max-w-lg mx-auto">
//               <div className="mb-4">
//                 <ButtonPrimary
//                   label="Submit Institution changes"
//                   loading={UIstate === "loading"}
//                   onClick={handleEditInstit}
//                   disabled={!isInstUpdated}
//                 />
//               </div>
//               <div className="flex justify-center">
//                 <ButtonDestructive
//                   label="Delete Institution"
//                   loading={UIstate === "loading"}
//                   onClick={handleDeleteInstit}
//                 />
//               </div>
//             </div>
//           </>
//         ) : (
//           <InstitutionUsersSection
//             filterPhrase={filterPhrase}
//             filtUsers={filtUsers}
//             setFilterPhrase={setFilterPhrase}
//             selectedUser={selectedUser}
//             selected={selected}
//             handleCreateUser={handleCreateUser}
//             handleEditUser={handleEditUser}
//             handleDeleteUser={handleDeleteUser}
//             userEdit={userEdit}
//             setUserEdits={setUserEdits}
//             errFields={errFields}
//             setErrFields={setErrFields}
//             UIstate={UIstate}
//           />
//         )}
//       </form>
//     </div>
//   );
// }

// const InstitutionUsersSection = ({
//   filterPhrase,
//   filtUsers,
//   setFilterPhrase,
//   selectedUser,
//   selected,
//   handleCreateUser,
//   handleEditUser,
//   handleDeleteUser,
//   userEdit,
//   setUserEdits,
//   errFields,
//   setErrFields,
//   UIstate,
// }) => (
//   <>
//     <div className="max-w-lg mx-auto">
//       <InputSelect
//         name="roles"
//         label="Role Filter"
//         placeholder="filter by role"
//         value={filterPhrase ?? ""}
//         options={[...new Set(instUsers.map(({ role }) => role))]}
//         setValue={setFilterPhrase}
//       />
//       {filtUsers.length > 0 ? (
//         <table className="table w-full mt-4">
//           <thead>
//             <tr>
//               <th>Username</th>
//               <th>Role</th>
//               <th>Created On</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filtUsers.map((user) => (
//               <tr key={user.id}>
//                 <td>
//                   <Link
//                     href={`/dashboard/institutions/${selected.id}/${user.id}`}
//                     className="font-medium whitespace-nowrap hover:text-blue-700"
//                   >
//                     {user.username}
//                   </Link>
//                 </td>
//                 <td>{user.role}</td>
//                 <td>{new Date(user.createdAt).toLocaleDateString()}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       ) : (
//         <p className="text-center text-muted-foreground mt-3">
//           <SVGfilter className="w-6 h-6 inline-block me-2" />
//           No users found with {filterPhrase}
//         </p>
//       )}
//     </div>
//     <UserViewArea
//       selectedUser={selectedUser}
//       userEdit={userEdit}
//       setUserEdits={setUserEdits}
//       errFields={errFields}
//       setErrFields={setErrFields}
//       handleCreateUser={handleCreateUser}
//       handleEditUser={handleEditUser}
//       handleDeleteUser={handleDeleteUser}
//       UIstate={UIstate}
//     />
//   </>
// );

// // Define the linkClass and svgClass functions to conditionally apply styles
// const linkClass = (selectedUser, isDetails) => {
//   return selectedUser && isDetails
//     ? "your-selected-styles"
//     : "your-normal-styles";
// };

// const svgClass = (selectedUser, isDetails) => {
//   return selectedUser && isDetails
//     ? "your-selected-styles-for-svg"
//     : "your-normal-styles-for-svg";
// };
