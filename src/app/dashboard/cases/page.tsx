"use client";

import { Loader1 } from "@/components/atoms/loader";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
import { httpCodes } from "@/lib/configs";
import MultiSelect, {
  Option as MultiSelectOption,
} from "@/components/atoms/multiSelect";
import { TemplateObj } from "@/lib/types";
import { Institution as InstitutionType } from "@/lib/prisma/types";

type newUserType = {
  name: TemplateObj;
  email: TemplateObj;
  role: string;
  tel: TemplateObj;
  institutionIds: string[];
};

const _defaultUser: newUserType = {
  name: { value: "", error: "" },
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

  //
  function updateNewUserInstits(selections: MultiSelectOption[]) {
    // console.log("Changed D1: ", selections);
    setNewUser((prev) => {
      return {
        ...prev,
        institutionIds: selections.map(({ value }) => value),
      };
    });
  }

  //handle user initialization
  async function initializeUser(e: React.MouseEvent<HTMLElement>) {
    // validate
    // if (session.user.role !== "admin") {
    //   toast.error("User validation failed");
    //   return;
    // }
    const inputErrors_ = {
      tel: telValidator(newUser.tel.value),
      email: emailValidator(newUser.email.value),
      name: nameValidator(newUser.name.value),
    };
    //
    const errors_ = Object.values(inputErrors_).filter(Boolean);
    if (errors_.length > 0) {
      errors_.forEach((error) => {
        toast.error(error);
      });
      return;
    }
    //
    if (newUser.institutionIds.length === 0) {
      toast.error("No institution assigned!");
      return;
    }
    //new user obj
    const body_ = {
      name: newUser.name.value,
      email: newUser.email.value,
      role: newUser.role || null,
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
          if (res_?.status === 200) {
            return await res_.json();
          } else {
            console.log(`ERROR: ` + JSON.stringify(res_));
            toast.error(httpCodes[res_?.status] ?? "Unknown error");
            setUIstate("OK");
            return;
          }
        }
      );
      if (!response) return;
      // response is truthy
      if (response.success) {
        console.log(
          "SUCCESS: user created\n > ",
          response.success.email,
          "\n.............."
        );
        toast.success("User created!");
        await refreshData();
        return router.push(`/dashboard/users/${response.success.id}`);
      } else {
        console.log(
          "FAILED: User not created\n > ",
          response,
          "\n.............."
        );
        toast.error(response.failed ?? response.error ?? "Unknown error");
        setUIstate("OK");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("User initialization failed:", error.message);
      } else {
        console.error("User initialization failed:", error);
      }
      // setUIstate("Error: Institution was not initialized");
      toast.error("User NOT initialized");
    }
  }

  return (
    <Card x-chunk="dashboard-04-chunk-1">
      <CardHeader>
        {/* <CardTitle>Create New</CardTitle> */}
        <CardDescription className="text-lg text-muted-foreground font-semibold">
          Create New User
        </CardDescription>
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
              value={newUser.name.value}
              onChange={(e) =>
                setNewUser((prev) => ({
                  ...prev,
                  name: { error: "", value: e.target.value },
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
          <div id="roleWrapper" className="grid w-full items-center gap-1.5">
            <Label htmlFor="role" className="opacity-75">
              Role *
            </Label>
            <Select
              name="role"
              value={newUser.role}
              onValueChange={(value) => {
                setNewUser((prev) => ({
                  ...prev,
                  role: value,
                }));
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select user's role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrator</SelectItem>
                <SelectItem value="lawyer">Lawyer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div id="phoneWrapper" className="grid w-full items-center gap-1.5">
            <Label htmlFor="tel" className="opacity-75">
              Phone No.
            </Label>
            <Input
              type="tel"
              id="tel"
              placeholder="user's Phone No."
              className="placeholder:italic"
              value={newUser.tel.value}
              onChange={(e) =>
                setNewUser((prev) => ({
                  ...prev,
                  tel: { error: "", value: e.target.value },
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

              onChange={updateNewUserInstits}
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
