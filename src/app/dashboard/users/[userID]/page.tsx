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
import { Loader } from "@/components/atoms/loader";
import {
  emailValidator,
  nameValidator,
  telValidator,
} from "@/helpers/inputValidators";
import { httpCodes, roleLabels } from "@/lib/configs";
import { EntityStatus, UserRole as UserRoles } from "@prisma/client";
import { User, Institution } from "@/types/models";
import { arraysEqual, isKeyOf } from "@/lib/utils";
import { TemplateObj } from "@/types/custom";
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
import { InputImage } from "@/components/atoms/inputs";
import MultiSelect, {
  Option as MultiSelectOption,
  Option,
} from "@/components/atoms/multiSelect";
import { deepEqual } from "@/helpers/dataHandlers";
import { Switch } from "@/components/ui/switch";

interface SelectedEditUser {
  id?: string;
  names: string;
  email: string;
  tel: string | null;
  status?: EntityStatus;
  photoUrl: string | null;
  photoFile?: File | undefined;
}

const default_UserEdit: SelectedEditUser = {
  names: "",
  email: "",
  tel: null,
  photoUrl: null,
};

export default function UserView({ params }: { params: any }) {
  const { userID } = params;
  const {
    data: { users, institutions },
    refreshData,
  } = useContext(DataContext);

  const { edgestore } = useEdgeStore();
  const router = useRouter();
  const { data: userSession, status: authStatus } = useSession();

  const [selected, setSelected] = useState<
    SelectedEditUser & { institutionIDs: string[] }
  >();
  const [userEdit, setUserEdit] = useState<SelectedEditUser>(default_UserEdit);
  const [userIsUpdated, setUserIsUpdated] = useState(false);
  const [userInstitutions, setUserInstitutions] = useState<Option[]>();
  const [UIstate, setUIstate] = useState("");

  // check form edits
  useEffect(() => {
    if (!selected) {
      return;
    }

    const userIsUpdated = (
      selected_: SelectedEditUser,
      editObj: SelectedEditUser
    ): boolean => {
      const newInstIDS_ = userInstitutions?.map(({ value }) => value);
      console.log(
        "comparing - ",
        selected?.institutionIDs,
        " and ",
        newInstIDS_
      );
      if (!deepEqual(selected?.institutionIDs, newInstIDS_)) {
        console.log(
          "comparing - ",
          selected?.institutionIDs,
          " and ",
          newInstIDS_
        );
        return true;
      }

      // ditObj has no values
      const hasAnyChanges = Object.values(editObj).some((val) => Boolean(val));
      if (!hasAnyChanges) return false;
      // If photoFile is present
      if (editObj.photoFile) return true;
      // Compare each key in editObj to selected_
      for (const key in editObj) {
        const typedKey = key as keyof SelectedEditUser;
        if (editObj[typedKey] && editObj[typedKey] !== selected_[typedKey]) {
          console.log(
            `${selected_[typedKey]} has changed to ${editObj[typedKey]}`
          );
          return true;
        }
      }

      return false;
    };
    setUserIsUpdated(userIsUpdated(selected, userEdit));
  }, [selected, userEdit, userInstitutions]);

  // setSelected, get user by userID and update selected
  useEffect(() => {
    if (userID) {
      const foundUser_ = users.find(({ id }: { id: string }) => id === userID);

      if (!foundUser_) {
        toast.error("User not found");
        router.push("/dashboard/users");
        return;
      }

      const mapSelectedUser_toState = {
        id: foundUser_.id,
        names: foundUser_.names,
        photoUrl: foundUser_.photoUrl,
        email: foundUser_.email,
        tel: foundUser_.tel,
        status: foundUser_.status,
        institutionIDs:
          foundUser_.institutions?.map(({ institutionId }) => institutionId) ||
          [],
      };

      console.log("found user - ", foundUser_);
      setSelected(mapSelectedUser_toState);

      // selected?.institutionIDs
      const seletedsInsts = foundUser_.institutions?.map(
        ({ institutionId: institutionId_found }) => {
          const _institution = institutions?.find(
            ({ id }) => institutionId_found === id
          );
          return {
            value: _institution?.id,
            label: _institution?.name,
          } as Option;
        }
      );

      setUserInstitutions(seletedsInsts);
    }
    setUIstate("OK");
  }, [userID, users]);

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

    if (userEdit.names) {
      inputErrors.nameError_ = nameValidator(userEdit.names);
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
      // const { email, location, name, photoFile_ } = instEdit;
      //upload image and retain url
      let photoUrl_: string | null = null;
      if (userEdit.photoFile) {
        // console.log("New logo to be uploaded");

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
        // upload file using edgestore- edgestore returns:
        // const res: {
        //   url: string;
        //   size: number;
        //   uploadedAt: Date;
        //   metadata: Record<string, never>;
        //   path: Record<string, never>;
        //   pathOrder: string[];
        // }

        // console.log("edge File - ", logoEdgeUpload);
        photoUrl_ = photoEdgeUpload.url;
        setUserEdit((prev) => {
          return { ...prev, photoFile: undefined };
        });
        if (!photoUrl_) console.error("image upload failed");
      }

      //Updated User
      const updatedUserObj = {
        id: selected.id,
        name: userEdit.names || undefined,
        email: userEdit.email || undefined,
        tel: userEdit.tel || undefined,
        institutionIDs: userInstitutions?.map(({ value }) => value),
        photoUrl: photoUrl_ || undefined,
      };

      const fetchOptions = {
        method: "PATCH",
        body: JSON.stringify(updatedUserObj),
      };

      // PATCH request using fetch
      const res = await fetch("/api/dashboard/user", fetchOptions).then(
        async (res_) => {
          if (res_?.ok) {
            return await res_.json();
          } else {
            const error_ =
              (await res_.json()).message ||
              `ERROR: ` + res_.status + "Unknown error";
            console.error(error_);
            setUIstate(error_);
            return null;
          }
        }
      );
      if (!res) return;
      //res is truthy
      console.log("SUCCESS: User updated\n > ", res, "\n..............");
      toast.success("user updated");
      setUserEdit(default_UserEdit);
      await refreshData();
    } catch (error) {
      console.error("fetch failed:", error);
      toast.error("FAILED to update user. Try again later");
    } finally {
      setUIstate("OK");
    }
  }

  //handleUpdateInstitution
  async function toggleUserStatus(e: boolean) {
    if (!selected) {
      toast.error("No user selected");
      return;
    }
    setUIstate("loading");

    // api call
    try {
      console.log("INFO: toggling status of user");
      const newStatus = selected.status === "INACTIVE" ? "ACTIVE" : "INACTIVE";
      const fetchBody = {
        id: selected.id,
        status: newStatus,
      };
      const fetchOptions = {
        method: "PATCH",
        body: JSON.stringify(fetchBody),
      };
      // PATCH request using fetch
      const res = await fetch("/api/dashboard/user", fetchOptions).then(
        async (res_) => {
          if (res_?.ok) {
            return await res_.json();
          } else {
            const error_ = `Error ${res_.status}: ${await res_.json()}`;
            console.log(`ERROR: ` + JSON.stringify(res_));
            toast.error(error_);
            return null;
          }
        }
      );
      if (!res) return;
      //res is truthy
      console.log("SUCCESS: user status toggled\n > ", res, "\n..............");
      toast.success("User Status updated");
      await refreshData();
    } catch (error: any) {
      const error_ = error.message || "Unknown error";
      console.error("fetch failed: ", error_);
    } finally {
      setUIstate("OK");
    }
  }

  //func to Delete Case
  async function handleDeleteUser() {
    if (!selected || !selected?.id) {
      toast.error("Sorry, no user selected");
      return router.push("/dashboard/users");
    }

    setUIstate("loading");
    // DELETE api-call using fetch
    let fetchOptions = {
      method: "DELETE",
      body: JSON.stringify({
        id: selected.id,
      }),
    };

    const res = await fetch("/api/dashboard/user", fetchOptions).then(
      async (res_) => {
        if (res_?.ok) {
          return await res_.json();
        } else {
          const error_ =
            (await res_.json()) || `ERROR: ` + res_.status + "Unknown error";
          console.error(error_);
          setUIstate(error_);
          return null;
        }
      }
    );

    if (!res) return;

    //if had a logo
    if (selected.photoUrl) {
      await edgestore.publicFiles.delete({
        url: selected.photoUrl,
      });
    }
    toast.success("user deleted");
    await refreshData();
    router.replace(`/dashboard/users/`);
  }

  //render
  return !UIstate ? null : (
    <Card x-chunk="dashboard-04-chunk-1">
      <CardHeader>
        <CardTitle className="font-light flex flex-row">
          <span>{selected?.names}</span>
          {userSession?.user?.role === "system" && (
            <div className="ml-4 px-4 w-fit">
              {UIstate === "loading" ? (
                <Loader />
              ) : (
                <Switch
                  checked={selected?.status === "ACTIVE"}
                  onCheckedChange={toggleUserStatus}
                />
              )}
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className=" flex flex-col gap-4">
          <div id="nameWrapper" className="grid w-full items-center gap-1.5">
            <Label htmlFor="names" className="opacity-75">
              Name *
            </Label>
            <Input
              type="text"
              id="names"
              placeholder="user's Name"
              className="placeholder:italic"
              value={userEdit?.names || selected?.names}
              onChange={(e) =>
                setUserEdit((prev) => ({
                  ...prev,
                  names: e.target.value,
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
          <div id="telWrapper" className="grid w-full items-center gap-1.5">
            <Label htmlFor="tel" className="opacity-75">
              Phone No.
            </Label>
            <Input
              type="tel"
              id="tel"
              placeholder="user's Phone No."
              className="placeholder:italic"
              value={userEdit.tel || selected?.tel || ""}
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
            <MultiSelect
              value={userInstitutions}
              onChange={setUserInstitutions}
              //
              options={institutions?.map(
                ({ id, name }: { id: string; name: string }) => ({
                  value: id,
                  label: name,
                })
              )}
              //
              placeholder="Select Institutions..."
            />
          </div>
          <div id="dpWrapper" className="py-4">
            <InputImage
              _photo={selected?.photoUrl ?? ""}
              setPhoto={async (_imageFile: File | null) => {
                setUserEdit((prev_) => ({
                  ...prev_,
                  photoFile: _imageFile || undefined,
                }));
              }}
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="border-t px-6 py-4 min-h-20">
        {UIstate === "loading" ? (
          <Loader />
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
              disabled={!selected?.id}
            >
              Delete User
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
