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

const _defaultInstitution = {
  name: { value: "", error: "" },
  email: { value: "", error: "" },
  tel: { value: "", error: "" },
};

export default function InstitutionsPage() {
  const {
    data: { institutions, users },
    refreshData,
  } = useContext(DataContext);

  const router = useRouter();

  const [UIstate, setUIstate] = useState("");
  const [filtInstitutions, setFiltInstitutions] = useState([]);
  const [searchPhrase, setSearchPhrase] = useState({ value: "", error: "" });
  const [newInstitution, setNewInstitution] = useState(_defaultInstitution);

  //handle inititution initialization
  async function initializeInstitution(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();

    const nameError_ = nameValidator(newInstitution.name.value);
    if (nameError_) {
      setNewInstitution((prev) => ({
        ...prev,
        name: {
          ...prev.name,
          error: nameError_,
        },
      }));
      toast.error(nameError_);
      return;
    }
    const emailError_ = emailValidator(newInstitution.email.value);
    if (emailError_) {
      setNewInstitution((prev) => ({
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
    if (newInstitution.tel.value) {
      telError_ = telValidator(newInstitution.tel.value);
    }
    if (telError_) {
      setNewInstitution((prev) => ({
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
          email: newInstitution.email.value,
          name: newInstitution.name.value,
          tel: newInstitution.tel.value,
          logoUrl: null,
        }),
      };
      const res = await fetch("/api/dashboard/institution", fetchOptions);
      const resData = await res.json();
      if (res.ok) {
        toast.success("Institution initialized successfully!");
        await refreshData();
        router.replace(`/dashboard/institutions/${resData.success.id}`);
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
      setUIstate("Error: Institution was not initialized");
    }
  }

  return (
    <Card x-chunk="dashboard-04-chunk-1">
      <CardHeader>
        {/* <CardTitle>Create New</CardTitle> */}
        <CardDescription className="text-lg text-muted-foreground font-semibold">
          Create new institution
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className=" flex flex-col gap-4">
          <div id="nameWrapper" className="grid w-full items-center gap-1.5">
            <Label htmlFor="institutionName" className="opacity-75">
              Name *
            </Label>
            <Input
              type="text"
              id="institutionName"
              placeholder="Institution Name"
              className="placeholder:italic"
              value={newInstitution.name.value}
              onChange={(e) =>
                setNewInstitution((prev) => ({
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
              placeholder="official email"
              className="placeholder:italic"
              value={newInstitution.email.value}
              onChange={(e) =>
                setNewInstitution((prev) => ({
                  ...prev,
                  email: { error: "", value: e.target.value },
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
              placeholder="official Phone No."
              className="placeholder:italic"
              value={newInstitution.tel.value}
              onChange={(e) =>
                setNewInstitution((prev) => ({
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
          <Button onClick={initializeInstitution}>Create Institution</Button>
        )}
      </CardFooter>
    </Card>
  );
}
