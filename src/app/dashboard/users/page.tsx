"use client";

import { Loader1 } from "@/components/atoms/loader";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  emailValidator,
  nameValidator,
  telValidator,
} from "@/helpers/inputValidators";
import { useCallback, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { DataContext } from "../providers";
import { httpCodes, roleLabels } from "@/lib/configs";
import MultiSelect, {
  Option as MultiSelectOption,
} from "@/components/atoms/multiSelect";
import { TemplateObj } from "@/types/custom";
import { userRole as userRoles } from "@prisma/client";
import parsePhoneNumber from "libphonenumber-js";

type newUserType = {
  names: TemplateObj;
  email: TemplateObj;
  role: string;
  tel: TemplateObj;
  institutionIds: string[];
};

const _defaultUser: newUserType = {
  names: { value: "", error: "" },
  email: { value: "", error: "" },
  role: "lawyer",
  tel: { value: "", error: "" },
  institutionIds: [],
};

export default function UsersPage() {
  const {
    data: { institutions, users },
    refreshData,
  } = useContext(DataContext);

  const router = useRouter();

  const [UIstate, setUIstate] = useState("");
  const [newUser, setNewUser] = useState(_defaultUser);

  // handle Institutions edits
  function updateSelectionUserInstits(selections: MultiSelectOption[]) {
    // console.log("Changed selection: ", selections);
    setNewUser((prev) => {
      return {
        ...prev,
        institutionIds: selections.map(({ value }) => value),
      };
    });
  }

  //handle user initialization
  async function initializeUser(e: React.MouseEvent<HTMLElement>) {
    const nameError_ = nameValidator(newUser.names.value);
    if (nameError_) {
      setNewUser((prev) => ({
        ...prev,
        names: {
          ...prev.names,
          error: nameError_,
        },
      }));
      toast.error(nameError_);
      return;
    }

    const emailError_ = emailValidator(newUser.email.value);
    if (emailError_) {
      setNewUser((prev) => ({
        ...prev,
        email: {
          ...prev.email,
          error: emailError_,
        },
      }));
      toast.error(emailError_);
      return;
    }

    if (newUser.institutionIds.length === 0) {
      toast.error("No institution assigned!");
      return;
    }
    //new user obj
    const body_ = {
      names: newUser.names.value,
      email: newUser.email.value,
      tel: newUser.tel.value || null,
      institutionIds: newUser.institutionIds,
    };
    console.log("body_", body_);

    const fetchOptions = {
      method: "POST",
      body: JSON.stringify(body_),
    };

    setUIstate("loading");

    try {
      // API call, using fetch
      const response = await fetch("/api/dashboard/user", fetchOptions).then(
        async (res_) => {
          if (res_?.ok) {
            return await res_.json();
          } else {
            const error_ =
              (await res_.json()) ||
              `ERROR: ` + res_.status + " - Unknown error";
            console.error(error_);
            toast.error(error_);
            return null;
          }
        }
      );
      if (!response) {
        setUIstate("OK");
        return;
      }
      // response is truthy
      if (response.message)
        toast.custom(
          <div className="bg-orange-200 text-orange-800 px-4 py-2 rounded-lg">
            {response.message}
          </div>
        );

      console.log(
        "SUCCESS: user created\n > ",
        response.email,
        "\n.............."
      );

      toast.success("User created!");
      await refreshData();

      router.push(`/dashboard/users/${response.id}`);
    } catch (error: any) {
      const error_ = error.message;
      console.error("error creating user - ", error_);
      toast.error("User NOT initialized, try again later.");
      setUIstate("OK");
    }
  }

  return (
    <Card x-chunk="dashboard-04-chunk-1">
      <CardHeader>
        <CardTitle className="font-light">Create New User</CardTitle>
        {/* <CardDescription className="text-lg text-muted-foreground font-semibold">
          Create New User
        </CardDescription> */}
      </CardHeader>
      <CardContent>
        <form className=" flex flex-col gap-4 w-full">
          <div id="nameWrapper" className="grid w-full items-center gap-1.5">
            <Label htmlFor="name" className="opacity-75">
              Names *
            </Label>
            <Input
              type="text"
              id="name"
              placeholder="user's Names"
              className="placeholder:italic"
              value={newUser.names.value}
              onChange={(e) =>
                setNewUser((prev) => ({
                  ...prev,
                  names: { error: "", value: e.target.value },
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
              placeholder="user's Email"
              className="placeholder:italic"
              value={newUser.email.value}
              onChange={(e) =>
                setNewUser((prev) => ({
                  ...prev,
                  email: { error: "", value: e.target.value },
                }))
              }
            />
          </div>

          <div id="instWrapper" className="grid w-full items-center gap-1.5">
            <Label htmlFor="roleWrapper" className="opacity-75">
              Institutions *
            </Label>
            <MultiSelect
              // value={instOptions}

              onChange={updateSelectionUserInstits}
              //
              defaultOptions={institutions?.map(
                ({ id, name }: { id: string; name: string }) => ({
                  value: id,
                  label: name,
                })
              )}
              //
              placeholder="Select Institutions..."
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        {UIstate === "loading" ? (
          <Loader1 />
        ) : (
          <Button onClick={initializeUser}>Create User</Button>
        )}
      </CardFooter>
    </Card>
  );
}
