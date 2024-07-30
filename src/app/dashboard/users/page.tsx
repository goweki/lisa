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
  emailValidator,
  nameValidator,
  telValidator,
} from "@/helpers/inputValidators";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { DataContext } from "../providers";
import { httpCodes } from "@/lib/configs";

const _defaultUser = {
  name: { value: "", error: "" },
  email: { value: "", error: "" },
  role: null,
  tel: { value: "", error: "" },
};

export default function InstitutionsPage() {
  const {
    data: { institutions, users },
    refreshData,
  } = useContext(DataContext);

  const router = useRouter();

  const [UIstate, setUIstate] = useState("");
  const [filtUsers, setFiltUsers] = useState([]);
  const [searchPhrase, setSearchPhrase] = useState({ value: "", error: "" });
  const [newUser, setNewUser] = useState(_defaultUser);

  //handle inititution initialization
  async function initializeInstitution(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();

    const nameError_ = nameValidator(newUser.name.value);
    if (nameError_) {
      setNewUser((prev) => ({
        ...prev,
        name: {
          ...prev.name,
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
    let telError_ = "";
    if (newUser.tel.value) {
      telError_ = telValidator(newUser.tel.value);
    }
    if (telError_) {
      setNewUser((prev) => ({
        ...prev,
        tel: {
          ...prev.tel,
          error: telError_,
        },
      }));
      toast.error(telError_);
      return;
    }
    setUIstate("loading");
    try {
      const fetchOptions = {
        method: "POST",
        body: JSON.stringify({
          email: newUser.email.value,
          name: newUser.name.value,
          role: newUser.role,
          tel: newUser.tel.value,
        }),
      };
      const res = await fetch("/api/dashboard/user", fetchOptions);
      const resData = await res.json();
      if (res.ok) {
        toast.success("User initialized successfully!");
        await refreshData();
        router.replace(`/dashboard/users/${resData.success.id}`);
      } else {
        console.error("ERROR:", resData);
        setUIstate(httpCodes[res.status] || "Unknown error");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log("fetch failed:", error.message);
      } else {
        console.log("fetch failed:", error);
      }
      setUIstate("ERROR: User NOT initialized");
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
        <form className=" flex flex-col gap-4">
          <div id="nameWrapper" className="grid w-full items-center gap-1.5">
            <Label htmlFor="userName" className="opacity-75">
              Names *
            </Label>
            <Input
              type="text"
              id="userName"
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
            <Label htmlFor="institutionnName" className="opacity-75">
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
        </form>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        {UIstate === "loading" ? (
          <Loader1 />
        ) : (
          <Button onClick={initializeInstitution}>Create User</Button>
        )}
      </CardFooter>
    </Card>
  );
}
