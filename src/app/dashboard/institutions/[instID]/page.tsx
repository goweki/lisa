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
  locationValidator,
  nameValidator,
  telValidator,
} from "@/helpers/inputValidators";
import { httpCodes } from "@/lib/configs";
import { User, Institution } from "@/types/models";
import { isKeyOf } from "@/lib/utils";
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
import { status } from "@prisma/client";

interface InstitutionEdit {
  name: string;
  location: string;
  logoFile: File | null;
}

export default function InstitutionView({ params }: { params: any }) {
  const { instID } = params;
  const {
    data: { institutions, users },
    refreshData,
  } = useContext(DataContext);

  const { edgestore } = useEdgeStore();
  const router = useRouter();
  const { data: userSession, status: authStatus } = useSession();
  const [selected, setSelected] = useState<Institution>();
  const [instEdit, setInstEdit] = useState<InstitutionEdit>({
    name: "",
    location: "",
    logoFile: null,
  });
  const [instIsUpdated, setInstIsUpdated] = useState(false);
  const [UIstate, setUIstate] = useState("");

  // get institution by instID
  useEffect(() => {
    if (instID) {
      const selectedInst_ = institutions?.find(
        ({ id }: { id: string }) => id === instID
      );
      if (!selectedInst_) return router.push("/dashboard/institutions");
      else setSelected(selectedInst_);
    }
    setUIstate("OK");
  }, [instID, institutions]);

  //check if any edits to institution
  useEffect(() => {
    if (selected) {
      // console.log(`Inspecting change...`);
      const userIsUpdated = ((selected_: Institution, editObj: TemplateObj) => {
        // if no values in editObj
        if (Object.values(instEdit).filter(Boolean).length === 0) return false;
        if (instEdit.logoFile) {
          // console.log(`logo image upload exists...`);
          return true;
        }

        for (const key in editObj) {
          if (selected_.hasOwnProperty(key)) {
            if (isKeyOf<Institution>(key, selected_)) {
              if (
                editObj[key] &&
                selected_.hasOwnProperty(key) &&
                selected_[key] !== editObj[key]
              ) {
                console.log(
                  `${key} has changed from ${selected_[key]} to ${editObj[key]}`
                );
                return true;
              }
            }
          }
        }
        // console.log("NO updates");
        return false;
      })(selected, instEdit);
      setInstIsUpdated(userIsUpdated);
    }
  }, [selected, instEdit]);

  //handleUpdateInstitution
  async function handleUpdateInstitution(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();

    if (!selected) {
      toast.error("No institution selected");
      return router.push("/dashboard/institutions");
    }

    //if input error
    const inputErrors = {
      nameError_: "",
      locationError_: "",
    };

    if (instEdit.name) {
      inputErrors.nameError_ = nameValidator(instEdit.name);
    }
    if (instEdit.location) {
      inputErrors.locationError_ = locationValidator(instEdit.location);
    }

    if (Object.values(inputErrors).filter(Boolean).length !== 0) {
      const errors = Object.values(inputErrors).filter(Boolean);
      errors.forEach((error) => {
        toast.error(error);
      });
      return;
    }

    setUIstate("loading");

    // API CALL
    try {
      console.log("editing institution: ", instEdit);
      //upload image and retain url
      let logoUrl_: string | undefined = undefined;
      try {
        if (instEdit.logoFile) {
          const uploadOptions: { replaceTargetUrl: string } | undefined =
            !selected.logoUrl
              ? undefined
              : {
                  replaceTargetUrl: selected.logoUrl,
                };

          const logoEdgeUpload = await edgestore.publicFiles.upload({
            file: instEdit.logoFile,
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
          logoUrl_ = logoEdgeUpload.url;
          setInstEdit((prev) => {
            return { ...prev, logoFile: null };
          });
          if (!logoUrl_) console.error("image upload failed");
        }
      } catch (error) {
        console.error("couldnt upload logo: ", error);
        if (!instEdit.name || !instEdit.location) throw { code: 500 };
      }

      const _fetchBody = {
        id: selected.id,
        name: instEdit.name || undefined,
        location: instEdit.location || undefined,
        logoUrl: logoUrl_ || undefined,
      };

      const fetchBody = Object.fromEntries(
        Object.entries(_fetchBody).filter(([_, value]) => value !== undefined)
      );

      const fetchOptions = {
        method: "PATCH",
        body: JSON.stringify(fetchBody),
      };

      // PATCH request using fetch
      const res = await fetch("/api/dashboard/institution", fetchOptions).then(
        async (res_) => {
          if (res_?.ok) {
            return await res_.json();
          } else {
            const error_ = `Error ${res_.status}: ${await res_.json()}`;
            console.log(`ERROR: ` + JSON.stringify(res_));
            return toast.error(error_);
          }
        }
      );
      if (!res) return;
      //res is truthy
      console.log(
        "SUCCESS: Institution updated\n > ",
        res.data,
        "\n.............."
      );
      toast.success("Institution updated");
      await refreshData();
    } catch (error: any) {
      const error_ = `Error 6bg: ${error.message || error}`;
      console.log(error_);
      if (error.code === 500) toast.error("SERVER ERROR: Try again later");
      else toast.error("Error: Institution NOT updated");
    } finally {
      setUIstate("OK");
    }
  }

  //handleUpdateInstitution
  async function toggleInstitutionStatus(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();

    if (!selected) {
      toast.error("No institution selected");
      return;
    }
    setUIstate("loading");

    // api call
    try {
      console.log("INFO: toggling status of institution");
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
      const res = await fetch("/api/dashboard/institution", fetchOptions).then(
        async (res_) => {
          if (res_?.ok) {
            return await res_.json();
          } else {
            const error_ = `Error ${res_.status}: ${await res_.json()}`;
            console.log(`ERROR: ` + JSON.stringify(res_));
            return toast.error(error_);
          }
        }
      );
      if (!res) return;
      //res is truthy
      console.log(
        "SUCCESS: Institution deactivated\n > ",
        res,
        "\n.............."
      );
      toast.success("Institution updated");
      await refreshData();
    } catch (error: any) {
      const error_ = error.message || "Unknown error";
      console.error("fetch failed: ", error_);
    } finally {
      setUIstate("OK");
    }
  }

  //func to Delete Case
  async function handleDeleteInstit() {
    if (!selected?.id) {
      toast.error("Sorry, institution not found");
      return;
    }
    console.log("Deleting inst: \n > ", selected.id);

    //delete logo first
    try {
      if (selected.logoUrl) {
        await edgestore.publicFiles.delete({
          url: selected.logoUrl,
        });
      }
    } catch (error) {
      console.error("couldn't delete logo: ", error);
      throw new Error("failed deleting logo from edgestore");
    }

    let fetchOptions = {
      method: "DELETE",
      body: JSON.stringify({
        id: selected.id,
      }),
    };
    setUIstate("loading");
    try {
      // DELETE api-call using fetch
      const res = await fetch("/api/dashboard/institution", fetchOptions).then(
        async (res_) => {
          if (res_?.ok) {
            return await res_.json();
          } else {
            const error_ = `Error ${res_.status}: ${await res_.json()}`;
            console.log(`ERROR: `, JSON.stringify(res_));
            toast.error(error_);
            return null;
          }
        }
      );

      if (!res) return;

      console.log("RESPONSE", res);

      console.log("SUCCESS: Institution deleted\n > ", res, "\n..............");

      toast.success("Institution deleted");
      await refreshData();
      router.replace(`/dashboard/institutions/`);
    } catch (err: any) {
      const error_ = `Error 8bh: ${err.message || err}`;
      console.error(error_);
      toast.error("Error: Institution NOT updated");
    } finally {
      setUIstate("OK");
    }
  }

  //render
  return UIstate && selected ? (
    <Card x-chunk="dashboard-04-chunk-1">
      <CardHeader>
        <CardTitle className="font-light">
          <span>{selected?.name}</span>
          {userSession?.user?.role === "system" && (
            <Button
              variant="ghost"
              className={`ml-4 ${
                selected.status !== "INACTIVE"
                  ? "text-red-500"
                  : "text-emerald-500"
              }`}
              onClick={toggleInstitutionStatus}
            >
              {selected.status === "INACTIVE" ? "activate" : "inactivate"}
            </Button>
          )}
        </CardTitle>

        <CardDescription className="text-lg text-muted-foreground font-semibold">
          Details of the New Institution
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
          <div id="dpWrapper" className="py-4">
            <InputImage
              _photo={selected?.logoUrl ?? ""}
              setPhoto={async (_imageFile: File | null) => {
                setInstEdit((prev_) => ({ ...prev_, logoFile: _imageFile }));
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
              disabled={!selected}
            >
              Delete Institution
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  ) : null;
}
