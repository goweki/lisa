"use client";

import { Loader } from "@/components/atoms/loader";
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
  emailValidator,
  nameValidator,
  telValidator,
} from "@/lib/utils/inputValidators";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { DataContext } from "@/app/dashboard/providers";
import { httpCodes } from "@/lib/configs";
import { useSession } from "next-auth/react";
import { InputImage } from "@/components/atoms/inputs";
import { useEdgeStore } from "@/lib/edgestore";

interface NewInst {
  name: { value: string; error: string };
  location: { value: string; error: string };
  photoFile: File | null;
  status: string;
}

const _defaultInstitution: NewInst = {
  name: { value: "", error: "" },
  location: { value: "", error: "" },
  photoFile: null,
  status: "DORMANT",
};

export default function InstitutionsPage() {
  const {
    data: { institutions, users },
    refreshData,
  } = useContext(DataContext);
  const { edgestore } = useEdgeStore();
  const router = useRouter();

  const [UIstate, setUIstate] = useState("");
  const [newInstitution, setNewInstitution] =
    useState<NewInst>(_defaultInstitution);
  const { data: userSession, status: authStatus } = useSession();

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
    const locationError_ = nameValidator(newInstitution.location.value);
    if (locationError_) {
      setNewInstitution((prev) => ({
        ...prev,
        email: {
          ...prev.location,
          error: locationError_,
        },
      }));
      toast.error(locationError_);
      return;
    }

    console.log("editing institution: ", newInstitution);
    setUIstate("loading");

    try {
      //upload image and retain url
      let logoUrl_: string | null = null;
      if (newInstitution.photoFile) {
        console.log("New logo to be uploaded");

        const logoEdgeUpload = await edgestore.publicFiles.upload({
          file: newInstitution.photoFile,
          // options: uploadOptions,
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
        logoUrl_ = logoEdgeUpload.url;
        setNewInstitution((prev) => {
          return { ...prev, photoFile: null };
        });
        if (!logoUrl_) console.error("logo upload failed");
      }

      // fetch body
      const _fetchBody = {
        name: newInstitution.name.value,
        location: newInstitution.location.value,
        status: newInstitution.status,
        logoUrl: logoUrl_ || null,
      };

      const fetchBody = Object.fromEntries(
        Object.entries(_fetchBody).filter(([_, value]) => value !== undefined),
      );

      // API call, using fetch
      const fetchOptions = {
        method: "POST",
        body: JSON.stringify(fetchBody),
      };
      const res = await fetch("/api/dashboard/institution", fetchOptions).then(
        async (res_) => {
          if (res_?.ok) {
            return await res_.json();
          } else {
            console.log(`ERROR: ` + JSON.stringify(res_));
            toast.error(httpCodes[res_?.status] ?? "Unknown error");
            setUIstate("OK");
            return;
          }
        },
      );
      if (!res) return;
      // res is truthy
      if (res.success) {
        console.log(
          "SUCCESS: institution created\n > ",
          res.success.name,
          "\n..............",
        );
        toast.success("Institution initialized");
        await refreshData();
        return router.push(`/dashboard/institutions/${res.success.id}`);
      } else {
        console.error("Institution NOT created\n > ", res, "\n..............");
        toast.error(res.failed ?? res.error ?? "Unknown error");
        setUIstate("OK");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("fetch failed:", error.message);
      } else {
        console.error("fetch failed:", error);
      }
      toast.error("Institution NOT initialized");
      setUIstate("OK");
    }
  }
  //render
  return (
    <Card x-chunk="dashboard-04-chunk-1">
      {userSession?.user?.role === "system" ? (
        <>
          <CardHeader>
            <CardTitle className="font-light">Create New Institution</CardTitle>
            <CardDescription className="text-lg text-muted-foreground font-semibold">
              Details of the New Institution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className=" flex flex-col gap-4">
              <div
                id="nameWrapper"
                className="grid w-full items-center gap-1.5"
              >
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
              <div
                id="locationWrapper"
                className="grid w-full items-center gap-1.5"
              >
                <Label htmlFor="location" className="opacity-75">
                  Location *
                </Label>
                <Input
                  type="location"
                  id="location"
                  placeholder="eg. Nairobi, Kenya"
                  className="placeholder:italic"
                  value={newInstitution.location.value}
                  onChange={(e) =>
                    setNewInstitution((prev) => ({
                      ...prev,
                      location: { error: "", value: e.target.value },
                    }))
                  }
                />
              </div>
              <div id="logoWrapper" className="py-4">
                <InputImage
                  label="Logo *"
                  _photo={""}
                  setPhoto={async (_imageFile: File | null) => {
                    setNewInstitution((prev_) => ({
                      ...prev_,
                      photoFile: _imageFile,
                    }));
                  }}
                />
              </div>
            </form>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            {UIstate === "loading" ? (
              <Loader />
            ) : (
              <Button onClick={initializeInstitution}>
                Create Institution
              </Button>
            )}
          </CardFooter>
        </>
      ) : (
        <div className="my-8 mx-4 text-muted italic">
          Select an institution to view details
        </div>
      )}
    </Card>
  );
}
