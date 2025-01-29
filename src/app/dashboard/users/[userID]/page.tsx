"use client";
import { useContext, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DataContext } from "@/app/dashboard/providers";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "next-auth/react";
import {
  SVGbuilding,
  SVGcell,
  SVGdoc,
  SVGemail,
  SVGpenscilSquare,
  SVGuser,
} from "@/components/atoms/svgs";
import toast from "react-hot-toast";
import { useEdgeStore } from "@/lib/edgestore";
import { Loader1 } from "@/components/atoms/loader";
import {
  emailValidator,
  nameValidator,
  telValidator,
} from "@/helpers/inputValidators";
import { httpCodes, roleLabels } from "@/lib/configs";
import { userRole as userRoles } from "@prisma/client";
import { User, Institution } from "@/lib/prisma/types";
import { arraysEqual, isKeyOf } from "@/lib/utils";
import { TemplateObj } from "@/lib/types";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InputImage } from "./_components/inputs";
import MultipleSelector, {
  Option as MultiSelectOption,
} from "@/components/atoms/multiSelect";

interface UserEdit {
  name: string;
  email: string;
  tel: string;
  role: string;
  institutionIDs: string[];
  photoFile: File | null;
}

const def_UserEdit = {
  name: "",
  email: "",
  tel: "",
  role: "",
  institutionIDs: [],
  photoFile: null,
};

export default function UserView({ params }: { params: any }) {
  const { userID } = params;
  const {
    data: { users, institutions },
    refreshData,
  } = useContext(DataContext);

  const { edgestore } = useEdgeStore();
  const router = useRouter();
  const [selected, setSelected] = useState<User>();
  const [userEdit, setUserEdit] = useState<UserEdit>(def_UserEdit);
  const [userIsUpdated, setUserIsUpdated] = useState(false);
  const [UIstate, setUIstate] = useState("");

  // setSelected, get user by userID and update selected
  useEffect(() => {
    if (userID) {
      const _selected = users.find(({ id }: { id: string }) => id === userID);
      setSelected(_selected);
      setUserEdit((prev) => ({
        ...prev,
        institutionIDs: _selected?.institutionIDs,
      }));
    }
    setUIstate("OK");
  }, [users, userID]);

  // // UIstate OK after updating selected
  // useEffect(() => {
  //   if (selected) {
  //     setUIstate("OK");
  //   }
  // }, [selected]);

  // UIstate OK on UI error
  useEffect(() => {
    if (UIstate && UIstate !== "OK" && UIstate !== "loading") {
      toast.error(UIstate);
      setUIstate("OK");
    }
  }, [UIstate]);

  //check if any edits to user
  useEffect(() => {
    if (selected) {
      //&& Object.keys(instEdit).length > 0
      const userIsUpdated = ((selected_: User, editObj: TemplateObj) => {
        // if no values in editObj
        if (Object.values(userEdit).filter(Boolean).length === 0) return false;
        if (userEdit.photoFile) return true;
        // if (userEdit.photoFile) return true;
        for (const key in editObj) {
          if (selected_.hasOwnProperty(key)) {
            // console.log("Updates");
            //
            if (isKeyOf<User>(key, selected_ as User)) {
              if (
                (Array.isArray(editObj[key])
                  ? editObj[key].length > 0
                  : editObj[key]) &&
                (Array.isArray(editObj[key])
                  ? !arraysEqual(editObj[key], selected_[key] as string[])
                  : selected_[key] !== editObj[key]) &&
                selected_.hasOwnProperty(key)
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
      })(selected as User, userEdit);
      setUserIsUpdated(userIsUpdated);
    }
  }, [selected, userEdit]);

  //handleUpdateUser
  async function handleUpdateUser(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();

    if (!selected?.id) {
      toast.error("No user selected");
      return;
    }

    //if input error
    const inputErrors = {
      nameError_: "",
      emailError_: "",
      telError_: "",
    };

    if (userEdit.name) {
      inputErrors.nameError_ = nameValidator(userEdit.name);
    }
    if (userEdit.email) {
      inputErrors.emailError_ = emailValidator(userEdit.email);
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
      console.log("EDITS: ", userEdit);

      // const { email, location, name, photoFile_ } = instEdit;
      //upload image and retain url
      let photoUrl_: string | null = null;
      if (userEdit.photoFile) {
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
          !selected.photoUrl
            ? undefined
            : {
                replaceTargetUrl: selected.photoUrl,
              };

        const photoEdgeUpload = await edgestore.publicFiles.upload({
          file: userEdit.photoFile,
          options: uploadOptions,
          // onProgressChange: (progress) => {
          //   // you can use this to show a progress bar
          //   console.log(progress);
          // },
        });

        // console.log("edge File - ", logoEdgeUpload);
        photoUrl_ = photoEdgeUpload.url;
        setUserEdit((prev) => {
          return { ...prev, photoFile: null };
        });
        if (!photoUrl_) console.error("image upload failed");
      }

      //Updated User
      const updatedUserObj = {
        id: selected.id,
        name: userEdit.name || selected.name,
        email: userEdit.email || selected.email,
        photoUrl: photoUrl_ || selected.photoUrl,
        tel: userEdit.tel || selected.tel,
        role: userEdit.role || selected.role,
        institutionIDs: userEdit.institutionIDs,
      };
      // console.log("Updated User: ", fetchBody);

      const fetchOptions = {
        method: "PUT",
        body: JSON.stringify(updatedUserObj),
      };

      // PUT request using fetch
      const res = await fetch("/api/dashboard/user", fetchOptions).then(
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
          "SUCCESS: User updated\n > ",
          res.success,
          "\n.............."
        );
        toast.success("user updated");
        setUserEdit(def_UserEdit);
        await refreshData();
      } else {
        console.log("FAILED: User not updated\n > ", res, "\n..............");
        toast.error(res.failed ?? res.error ?? "Unknown error");
      }
      setUIstate("OK");
    } catch (error) {
      if (error instanceof Error) {
        console.log("fetch failed:", error.message);
      } else {
        console.log("fetch failed:", error);
      }
      setUIstate("Error: User NOT updated");
    }
  }

  // handle onSelect Institutions
  function updateNewUserInstits(selections: MultiSelectOption[]) {
    // console.log("Changed D1: ", selections);
    setUserEdit((prev) => {
      return {
        ...prev,
        institutionIDs: selections.map(({ value }) => value),
      };
    });
  }

  //func to Delete Case
  async function handleDeleteUser() {
    if (!selected?.id) {
      toast.error("Sorry, user not found");
      return;
    }
    // console.log("Deleting user: \n > ", selected.id);
    // fetch options
    let fetchOptions = {
      method: "DELETE",
      body: JSON.stringify({
        id: selected.id,
      }),
    };
    setUIstate("loading");
    // DELETE api-call using fetch
    const res = await fetch("/api/dashboard/user", fetchOptions).then(
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
        "SUCCESS: user deleted\n > ",
        res.success,
        "\n.............."
      );

      //if had a logo
      if (selected.photoUrl) {
        await edgestore.publicFiles.delete({
          url: selected.photoUrl,
        });
      }
      toast.success("user deleted");
      await refreshData();
      router.replace(`/dashboard/users/`);
    } else {
      console.log("FAILED: user not deleted\n > ", res, "\n..............");
      toast.error(res.failed ?? res.error ?? "Unknown error");
    }
    setUIstate("OK");
  }

  //render
  return !UIstate ? null : (
    <Card x-chunk="dashboard-04-chunk-1">
      <CardHeader>
        <CardTitle className="font-light">
          <span>{selected?.name}</span>
          {
            <Button
              variant="ghost"
              className={`ml-4 ${
                selected?.status !== "INACTIVE"
                  ? "text-red-500"
                  : "text-emerald-500"
              }`}
              onClick={() => null}
            >
              inactivate
            </Button>
          }
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className=" flex flex-col gap-4">
          <div id="nameWrapper" className="grid w-full items-center gap-1.5">
            <Label htmlFor="userName" className="opacity-75">
              Name *
            </Label>
            <Input
              type="text"
              id="userName"
              placeholder="user's Name"
              className="placeholder:italic"
              value={userEdit.name || selected?.name}
              onChange={(e) =>
                setUserEdit((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
            />
          </div>
          <div id="emailWrapper" className="grid w-full items-center gap-1.5">
            <Label htmlFor="email" className="opacity-75">
              Email *
            </Label>
            <Input
              type="email"
              id="email"
              placeholder="official email"
              className="placeholder:italic"
              value={userEdit.email || selected?.email}
              onChange={(e) =>
                setUserEdit((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
            />
          </div>
          <div id="roleWrapper" className="grid w-full items-center gap-1.5">
            <Label htmlFor="role" className="opacity-75">
              Role *
            </Label>
            <Select
              name="role"
              value={userEdit.role || selected?.role}
              onValueChange={(value) => {
                setUserEdit((prev) => ({
                  ...prev,
                  role: value,
                }));
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select user's role" />
              </SelectTrigger>
              <SelectContent>
                {/* <SelectItem value="admin">Administrator</SelectItem> */}
                {/* <SelectItem value="lawyer">Lawyer</SelectItem> */}
                {Object.keys(userRoles).map((key) => (
                  <SelectItem key={key} value={key}>
                    {roleLabels[key]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div id="telWrapper" className="grid w-full items-center gap-1.5">
            <Label htmlFor="tel" className="opacity-75">
              Phone No.
            </Label>
            <Input
              type="tel"
              id="tel"
              placeholder="user's Phone No."
              className="placeholder:italic"
              value={userEdit.tel || (selected?.tel as string)}
              onChange={(e) =>
                setUserEdit((prev) => ({
                  ...prev,
                  tel: e.target.value,
                }))
              }
            />
          </div>
          <div id="instWrapper" className="grid w-full items-center gap-1.5">
            <Label htmlFor="roleWrapper" className="opacity-75">
              Institutions *
            </Label>
            <MultipleSelector
              value={userEdit.institutionIDs.map((_id: string) => ({
                value: _id,
                label: institutions.find(({ id }: { id: string }) => id === _id)
                  ?.name,
              }))}
              onChange={(newVals) => updateNewUserInstits(newVals)}
              //
              defaultOptions={institutions.map(
                ({ id, name }: { id: string; name: string }) => ({
                  value: id,
                  label: name,
                })
              )}
              //
              placeholder="Select Institutions..."
              emptyIndicator={
                <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                  no results found.
                </p>
              }
            />
          </div>
          <div id="dpWrapper" className="py-4">
            <InputImage
              _photo={selected?.photoUrl ?? ""}
              setPhoto={async (_imageFile: File | null) => {
                setUserEdit((prev_) => ({ ...prev_, photoFile: _imageFile }));
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
            <Button onClick={handleUpdateUser} disabled={!userIsUpdated}>
              Update User
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={!selected?.id || selected?.role === "admin"}
            >
              Delete User
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
