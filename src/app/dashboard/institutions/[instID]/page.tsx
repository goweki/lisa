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
  CardTitle,
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
  const { data: userSession, status: authStatus } = useSession();
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

      const _fetchBody = {
        id: selected.id,
        name: instEdit.name || undefined,
        email: instEdit.email || undefined,
        location: instEdit.location || undefined,
        logoUrl: logoUrl_ || undefined,
        tel: instEdit.tel || undefined,
      };

      const fetchBody = Object.fromEntries(
        Object.entries(_fetchBody).filter(([_, value]) => value !== undefined)
      );

      const fetchOptions = {
        method: "PATCH",
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

      //if had a logo
      if (selected.logoUrl) {
        await edgestore.publicFiles.delete({
          url: selected.logoUrl,
        });
      }
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
  return UIstate && selected ? (
    <Card x-chunk="dashboard-04-chunk-1">
      <CardHeader>
        <CardTitle className="font-light">
          <span>{selected?.name}</span>
          {
            <Button
              variant="ghost"
              className={`ml-4 ${
                selected.status !== "INACTIVE"
                  ? "text-red-500"
                  : "text-emerald-500"
              }`}
              onClick={toggleInstitutionStatus}
            >
              inactivate
            </Button>
          }
        </CardTitle>
        {/* <CardDescription className="text-lg text-muted-foreground font-semibold">
          {selected?.name}
        </CardDescription> */}
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
  ) : null;
}
