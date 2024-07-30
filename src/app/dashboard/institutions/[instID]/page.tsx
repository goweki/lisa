"use client";
import { useContext, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DataContext } from "@/app/dashboard/providers";
import { useSession } from "next-auth/react";
import {
  SVGbuilding,
  SVGcell,
  SVGdoc,
  SVGemail,
  SVGpenscilSquare,
  SVGuser,
} from "@/components/atoms/svgs";
import {
  ButtonPrimary,
  ButtonSecondary,
  ButtonDestructive,
} from "@/components/atoms/buttons";
import { InputText } from "@/components/atoms/inputs";
import toast from "react-hot-toast";
import { useEdgeStore } from "@/lib/edgestore";
import { Loader1 } from "@/components/atoms/loader";
import {
  emailValidator,
  nameValidator,
  telValidator,
} from "@/helpers/inputValidators";
import { httpCodes } from "@/lib/configs";
import { User, Institution } from "@/lib/prisma/types";
import { isKeyOf } from "@/lib/utils";
import { TemplateObj } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InputImage } from "./_components/inputs";

interface InstitutionEdit {
  name: string;
  email: string;
  tel: string;
  location: string;
  imageFile: File | null;
}

export default function InstitutionView({ params }: { params: any }) {
  const { instID } = params;
  const {
    data: { institutions, users },
    refreshData,
  } = useContext(DataContext);

  const { edgestore } = useEdgeStore();
  const router = useRouter();
  const [selected, setSelected] = useState<Institution>();
  const [instEdit, setInstEdit] = useState<InstitutionEdit>({
    name: "",
    email: "",
    tel: "",
    location: "",
    imageFile: null,
  });
  const [instIsUpdated, setInstIsUpdated] = useState(false);
  const [UIstate, setUIstate] = useState("");

  // get institution by instID
  useEffect(() => {
    if (instID) {
      setSelected(institutions.find(({ id }: { id: string }) => id === instID));
    } else {
      setUIstate("OK");
    }
  }, [institutions, instID]);

  // UIstate OK after updating selected
  useEffect(() => {
    if (selected) {
      setUIstate("OK");
    }
  }, [selected]);

  // UIstate OK on UI error
  useEffect(() => {
    if (UIstate && UIstate !== "OK" && UIstate !== "loading") {
      toast.error(UIstate);
      setUIstate("OK");
    }
  }, [UIstate]);

  //check if any edits to institution
  useEffect(() => {
    if (selected) {
      //&& Object.keys(instEdit).length > 0
      const userIsUpdated = ((selected_: Institution, editObj: TemplateObj) => {
        // if no values in editObj
        if (Object.values(instEdit).filter(Boolean).length === 0) return false;
        if (instEdit.imageFile) return true;
        for (const key in editObj) {
          if (selected_.hasOwnProperty(key)) {
            // console.log("Updates");
            if (isKeyOf<Institution>(key, selected_ as Institution)) {
              if (
                editObj[key] &&
                selected_.hasOwnProperty(key) &&
                selected_[key] !== editObj[key]
              ) {
                // console.log(
                //   `${key} has changed from ${selected_[key]} to ${editObj[key]}`
                // );
                return true;
              }
            }
          }
        }
        // console.log("NO updates");
        return false;
      })(selected as Institution, instEdit);
      setInstIsUpdated(userIsUpdated);
    }
  }, [selected, instEdit]);

  //handleUpdateInstitution
  async function handleUpdateInstitution(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();

    if (!selected) {
      toast.error("No institution selected");
      return;
    }

    //if input error

    const inputErrors = {
      nameError_: "",
      emailError_: "",
      locationError_: "",
      telError_: "",
    };

    if (instEdit.name) {
      inputErrors.nameError_ = nameValidator(instEdit.name);
    }
    if (instEdit.email) {
      inputErrors.emailError_ = emailValidator(instEdit.email);
    }
    if (instEdit.tel) {
      inputErrors.telError_ = telValidator(instEdit.tel);
    }
    if (instEdit.location) {
      inputErrors.locationError_ = nameValidator(instEdit.location);
    }

    if (Object.values(inputErrors).filter(Boolean).length !== 0) {
      const errors = Object.values(inputErrors).filter(Boolean);
      errors.forEach((error) => {
        toast.error(error);
      });
      return;
    }

    setUIstate("loading");

    // api call
    try {
      console.log("editing institution: ", instEdit);

      // const { email, location, name, photoFile_ } = instEdit;
      //upload image and retain url
      let logoUrl_: string | null = null;
      if (instEdit.imageFile) {
        // console.log("New logo to be uploaded");

        // upload file using edgestore- edgestore returns:
        // const res: {
        //   url: string;
        //   size: number;
        //   uploadedAt: Date;
        //   metadata: Record<string, never>;
        //   path: Record<string, never>;
        //   pathOrder: string[];
        // }
        const uploadOptions: { replaceTargetUrl: string } | undefined =
          !selected.logoUrl
            ? undefined
            : {
                replaceTargetUrl: selected.logoUrl,
              };

        const logoEdgeUpload = await edgestore.publicFiles.upload({
          file: instEdit.imageFile,
          options: uploadOptions,
          // onProgressChange: (progress) => {
          //   // you can use this to show a progress bar
          //   console.log(progress);
          // },
        });

        // console.log("edge File - ", logoEdgeUpload);
        logoUrl_ = logoEdgeUpload.url;
        setInstEdit((prev) => {
          return { ...prev, imageFile: null };
        });
        if (!logoUrl_) console.error("image upload failed");
      }

      const fetchBody = {
        id: selected.id,
        name: instEdit.name || selected.name,
        email: instEdit.email || selected.email,
        location: instEdit.location || selected.location,
        logoUrl: logoUrl_ || selected.logoUrl,
        tel: instEdit.tel || selected.tel,
      };

      const fetchOptions = {
        method: "PUT",
        body: JSON.stringify(fetchBody),
      };

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
      //res is truthy
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
    } catch (error) {
      if (error instanceof Error) {
        console.log("fetch failed:", error.message);
      } else {
        console.log("fetch failed:", error);
      }
      setUIstate("Error: Institution NOT updated");
    }
  }

  //func to Delete Case
  async function handleDeleteInstit() {
    if (!selected?.id) {
      toast.error("Sorry, institution not found");
      return;
    }
    console.log("Deleting inst: \n > ", selected.id);
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

  //render
  return !UIstate ? null : (
    <Card x-chunk="dashboard-04-chunk-1">
      <CardHeader>
        {/* <CardTitle>Create New</CardTitle> */}
        <CardDescription className="text-lg text-muted-foreground font-semibold">
          {selected?.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className=" flex flex-col gap-4">
          <div id="nameWrapper" className="grid w-full items-center gap-1.5">
            <Label htmlFor="institutionnName" className="opacity-75">
              Name *
            </Label>
            <Input
              type="text"
              id="institutionnName"
              placeholder="Institution Name"
              className="placeholder:italic"
              value={instEdit.name || selected?.name}
              onChange={(e) =>
                setInstEdit((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
            />
          </div>
          <div id="emailWrapper" className="grid w-full items-center gap-1.5">
            <Label htmlFor="institutionnName" className="opacity-75">
              Email *
            </Label>
            <Input
              type="email"
              id="email"
              placeholder="official email"
              className="placeholder:italic"
              value={instEdit.email || selected?.email}
              onChange={(e) =>
                setInstEdit((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
            />
          </div>
          <div
            id="locationWrapper"
            className="grid w-full items-center gap-1.5"
          >
            <Label htmlFor="location" className="opacity-75">
              Location
            </Label>
            <Input
              type="text"
              id="location"
              placeholder="city / town"
              className="placeholder:italic"
              value={instEdit.location || (selected?.location as string) || ""}
              onChange={(e) =>
                setInstEdit((prev) => ({
                  ...prev,
                  location: e.target.value,
                }))
              }
            />
          </div>
          <div id="phoneWrapper" className="grid w-full items-center gap-1.5">
            <Label htmlFor="institutionnName" className="opacity-75">
              Phone No.
            </Label>
            <Input
              type="phone"
              id="phone"
              placeholder="official Phone No."
              className="placeholder:italic"
              value={instEdit.tel || (selected?.tel as string)}
              onChange={(e) =>
                setInstEdit((prev) => ({
                  ...prev,
                  tel: e.target.value,
                }))
              }
            />
          </div>
          <div id="dpWrapper" className="py-4">
            <InputImage
              _photo={selected?.logoUrl ?? ""}
              setPhoto={async (_imageFile: File | null) => {
                setInstEdit((prev_) => ({ ...prev_, imageFile: _imageFile }));
              }}
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="border-t px-6 py-4 min-h-20">
        {UIstate === "loading" ? (
          <Loader1 />
        ) : (
          <div
            className="flex flex-row justify-between w-full items-center"
            id="buttonWrapper"
          >
            <Button onClick={handleUpdateInstitution} disabled={!instIsUpdated}>
              Update Institution
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteInstit}
              disabled={
                !selected ||
                !institutions.some(
                  (inst: Institution) => inst.name === "Lisa"
                ) ||
                selected?.name === "Lisa"
              }
            >
              Delete Institution
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

// async function fetchInst(instId: string) {
//   try {
//     const res = await fetch(`/api/dashboard/institution?id=${instId}`, {
//       method: "GET",
//     });
//     if (res.ok) {
//       const resData = await res.json();
//       console.log("resJson 2:", JSON.stringify(resData.success));
//       return resData.success;
//     } else {
//       console.error("ERROR:", res.status, res.statusText);
//       return null;
//     }
//   } catch (error) {
//     if (error instanceof Error) {
//       console.log("fetch failed:", error.message);
//     } else {
//       console.log("fetch failed:", error);
//     }
//     return null;
//   }
// }

/** VERSION 0
 *
 * This is version 0 of my code: optimized and standardized to develop the above
 */
// "use client";
// import { useContext, useState, useEffect } from "react";
// import Link from "next/link";
// // import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { DataContext } from "@/app/dashboard/providers";
// import {
//   SVGbuilding,
//   SVGcell,
//   SVGemail,
//   SVGpenscilSquare,
//   SVGuser,
// } from "@/components/atoms/svgs";
// import {
//   ButtonPrimary,
//   ButtonSecondary,
//   ButtonDestructive,
// } from "@/components/atoms/buttons";
// import { InputText } from "@/components/atoms/inputs";
// import { strPascalcase } from "@/helpers/stringHandlers";
// import toast from "react-hot-toast";
// import { Loader1 } from "@/components/atoms/loader";
// import ViewInstitution from "./_components/viewInstitut";
// import { nameValidator, telValidator } from "@/helpers/inputValidators";
// import { httpCodes } from "@/lib/configs";

// export default function InstitutionsPage({ params }) {
//   const defaultInstitution = {
//     name: { value: "", error: "" },
//     email: { value: "", error: "" },
//     tel: { value: "", error: "" },
//   };
//   const { instIDuser } = params;
//   const {
//     data: { institutions, users },
//     refreshData,
//   } = useContext(DataContext);
//   // state Objects
//   const router = useRouter();
//   const [selected, setSelected] = useState("");
//   const [UIstate, setUIstate] = useState("");
//   const [newInstitution, setNewInstitution] = useState(defaultInstitution);
//   //

//   // check slug and update selected
//   useEffect(() => {
//     if (instIDuser[0] !== "new") {
//       setSelected(institutions.find(({ id }) => id === instIDuser[0]));
//     } else setUIstate("OK");
//   }, [institutions, instIDuser]);

//   // UIstate OK after updating selected
//   useEffect(() => {
//     if (selected) {
//       setUIstate("OK");
//     }
//   }, [selected, router]);

//   // UIstate OK on UI error
//   useEffect(() => {
//     if (UIstate && UIstate !== "OK" && UIstate !== "loading") {
//       toast.error(UIstate);
//       setUIstate("OK");
//     }
//   }, [UIstate]);

//   // toast on input error
//   useEffect(() => {
//     if (newInstitution.email.error) toast.error(newInstitution.email.error);
//     if (newInstitution.name.error) toast.error(newInstitution.name.error);
//     if (newInstitution.tel.error) toast.error(newInstitution.tel.error);
//     setNewInstitution((prev) => ({
//       ...prev,
//       email: { ...prev.email, error: "" },
//       name: { ...prev.name, error: "" },
//       tel: { ...prev.tel, error: "" },
//     }));
//   }, [
//     newInstitution.email.error,
//     newInstitution.name.error,
//     newInstitution.tel.error,
//   ]);

//   //submit new institution
//   async function initializeInstitution(e) {
//     e.preventDefault();
//     //validate email
//     const emailError_ = nameValidator(newInstitution.name.value);
//     if (emailError_) {
//       setNewInstitution((prev) => ({
//         ...prev,
//         email: {
//           ...prev.name,
//           error: emailError_,
//         },
//       }));
//       toast.error(emailError_);
//       return;
//     }
//     //validate name
//     const nameError_ = nameValidator(newInstitution.name.value);
//     if (nameError_) {
//       setNewInstitution((prev) => ({
//         ...prev,
//         name: {
//           ...prev.name,
//           error: emailError_,
//         },
//       }));
//       toast.error(emailError_);
//       return;
//     }
//     //validate tel
//     let telError_ = "";
//     if (tel) {
//       telError_ = telValidator(newInstitution.tel.value);
//     }
//     if (telError_) {
//       setNewInstitution((prev) => ({
//         ...prev,
//         tel: {
//           ...prev.tel,
//           error: telError_,
//         },
//       }));
//       toast.error(telError_);
//       return;
//     }
//     setUIstate("loading");
//     try {
//       // fetch options
//       let fetchOptions = {
//         method: "POST",
//         // headers: {
//         //   "Content-Type": "application/json",
//         //   'Content-Type': 'application/x-www-form-urlencoded',
//         // },
//         body: JSON.stringify({
//           email: newInstitution.email.value,
//           name: newInstitution.name.value,
//           tel: newInstitution.tel.value,
//         }),
//       };
//       // POST request using fetch
//       const _res = await fetch("/api/dashboard/institution", fetchOptions).then(
//         async (res_) => {
//           if (res_?.status === 200) {
//             return await res_.json();
//           } else {
//             console.log(`ERROR: ` + JSON.stringify(res_));
//             setUIstate(httpCodes[res_.status] || "Unknown error");
//           }
//         }
//       );
//       if (_res?.success) {
//         console.log(
//           "SUCCESS: institution initialized successfully\n > " +
//             JSON.stringify(_res.success) +
//             "\n.............."
//         );
//         toast.success("Institution initialized successfully!");
//         await refreshData();
//         router.replace(`/dashboard/institutions/${_res.success.id}`);
//       } else {
//         console.error(
//           "ERROR: failed to initialize institution at /dashboard/institutions/new /page\n > " +
//             JSON.stringify(_res) +
//             "\n.............."
//         );
//         setUIstate(_res?.failed ?? "No Response, check internet connection");
//       }
//     } catch (error) {
//       console.log("fetch failed: ", error.message);
//       setUIstate(error.message ?? "No Response, check internet connection");
//     }
//   }

//   //render
//   return !UIstate ? (
//     <Loader1 />
//   ) : (
//     <main className="flex flex-col flex-grow items-center px-4">
//       <div className="flex flex-col flex-grow max-w-screen-lg mx-auto px-4 sm:px-4 lg:px-6 w-full">
//         {/* header */}
//         <div className="space-y-1 pt-6 md:space-y-2">
//           {/* heading */}
//           <h1 className="text-center uppercase">
//             {instIDuser[0] === "new"
//               ? "New Institution"
//               : selected?.name ?? "ERROR"}
//           </h1>
//           {/* Inputs */}
//           {instIDuser[0] === "new" ? (
//             <div className="px-6 sm:px-20 md:px-12">
//               <form
//                 id="new-institution"
//                 // className="bg-background-surface dark:bg-background-dark-surface rounded space-y-6 md:space-y-6 p-8 shadow-[6px_6px_4px_#ecf0f4,-6px_-6px_4px_#f6fafe] dark:shadow-[1px_1px_2px_#0c1221,-1px_-1px_2px_#121c33]"
//                 className={`relative max-w-lg mx-auto grid grid-cols-1 gap-4 card p-6`}
//                 onSubmit={initializeInstitution}
//               >
//                 <InputText
//                   valObj={newInstitution.name}
//                   setValue={(nameObj) =>
//                     setNewInstitution((prev) => ({ ...prev, name: nameObj }))
//                   }
//                   name="name"
//                   label="Institution Name *"
//                   valValidator={nameValidator}
//                   placeholder="Name of Institution"
//                   icon={SVGbuilding}
//                 />
//                 <InputText
//                   valObj={newInstitution.email}
//                   setValue={(emailObj) =>
//                     setNewInstitution((prev) => ({
//                       ...prev,
//                       email: emailObj,
//                     }))
//                   }
//                   name="email"
//                   label="Email *"
//                   valValidator={nameValidator}
//                   placeholder="Official email of institution"
//                   icon={SVGemail}
//                 />
//                 <InputText
//                   valObj={newInstitution.tel}
//                   setValue={(telObj) =>
//                     setNewInstitution((prev) => ({ ...prev, tel: telObj }))
//                   }
//                   name="tel"
//                   label="Phone No."
//                   valValidator={telValidator}
//                   placeholder="Official PhoneNo. of Institution"
//                   icon={SVGcell}
//                 />
//                 <div className="my-8">
//                   <ButtonPrimary
//                     label="Create Institution"
//                     loading={UIstate === "loading"}
//                     onClick={() => ""}
//                     disabled={
//                       !newInstitution.name.value || !newInstitution.email.value
//                     }
//                     type="submit"
//                   />
//                 </div>
//               </form>
//             </div>
//           ) : selected ? (
//             <ViewInstitution
//               selected={selected}
//               refreshData={refreshData}
//               instUsers={users.filter(({ institutionIDs }) => {
//                 for (const id of institutionIDs) {
//                   if (id === instIDuser[0]) return true;
//                 }
//               })}
//               selectedUser={
//                 instIDuser[1]
//                   ? users.find(({ id }) => id === instIDuser[1]) || "new"
//                   : null
//               }
//             />
//           ) : (
//             <div>
//               <p className="text-center">
//                 There was an error loading the contents of this page. Check
//                 internet connectivity
//               </p>
//               <p className="text-center">
//                 <Link
//                   href="/dashboard/institutions"
//                   className="text-red-800 dark:text-red-400 underline"
//                 >
//                   {" "}
//                   click here{" "}
//                 </Link>
//                 to view all institutions
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </main>
//   );
// }

// function inputSelect(
//   optionArr,
//   value,
//   onChange = () => "",
//   name = "inputName"
//   // defaultOption = "type"
// ) {
//   return (
//     <div className="relative mb-6">
//       <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
//         <SVGpenscilSquare className="w-4 h-4 text-emerald-800 dark:text-emerald-500" />
//       </div>
//       <select
//         name={name}
//         id={name}
//         className={`border-transparent dark:border-transparent focus:ring-emerald-800 focus:border-emerald-800 dark:focus:ring-emerald-800 dark:focus:border-emerald-800 border shadow dark:shadow-dak dark:focus:shadow-dpressed focus:shadow-pressed text-gray-900 text-sm rounded-lg  block w-full pl-10 p-2.5  dark:bg-gray-700  dark:placeholder-gray-400 placeholder:italic dark:text-white `}
//         value={value}
//         onChange={onChange}
//       >
//         <option value="" className="italic font-light">
//           Select {name}...
//         </option>
//         {optionArr.map((option, i) => (
//           <option key={optionArr.key} value={optionArr.value}>
//             {option}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// }

// async function fetchInst(instId) {
//   const resRaw = await fetch(`/api/dashboard/institution?id=${instId}`, {
//     method: "GET",
//   });
//   if (resRaw.ok) {
//     const res = await resRaw.json();
//     console.log("resJson 2: ", JSON.stringify(res.success));
//     return res.success;
//   }
// }

// // const caseTypes = [{ value: "petition", text: "✍🏾 petition" }];
