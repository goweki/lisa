"use client";

import { Loader } from "@/components/atoms/loader";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardTitle,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { nameValidator, telValidator } from "@/helpers/inputValidators";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { DataContext } from "../providers";
import { httpCodes } from "@/lib/configs";
import { TemplateObj } from "@/types/custom";

type newCaseType = {
  name: TemplateObj;
  description: string;
  caseTypeID: string;
  institutionID: string;
  clientParty: string;
  clientName: TemplateObj;
  clientTel: TemplateObj;
};

const _defaultCase: newCaseType = {
  name: { value: "", error: "" },
  description: "",
  caseTypeID: "",
  institutionID: "",
  clientParty: "",
  clientName: { value: "", error: "" },
  clientTel: { value: "", error: "" },
};

export default function CasesPage() {
  const {
    data: { institutions = [], users = [], cases = [], caseTypes = [] },
    refreshData,
  } = useContext(DataContext);

  const router = useRouter();

  const [UIstate, setUIstate] = useState("");
  const [newCase, setNewCase] = useState({
    ..._defaultCase,
    institutionID: institutions[0].id,
  });
  const [options, setOptions] = useState<{
    caseTypes: TemplateObj[];
    institutions: TemplateObj[];
    clientParties: string[];
  }>({
    caseTypes: [],
    institutions: [],
    clientParties: [],
  });

  // update caseTypes options
  useEffect(() => {
    setOptions((prev) => ({
      ...prev,
      caseTypes: caseTypes.map(
        ({ id, name }: { id: string; name: string }) => ({
          value: id,
          label: name,
        })
      ),
    }));
  }, [caseTypes]);

  // update Institutions options
  useEffect(() => {
    setOptions((prev) => ({
      ...prev,
      institutions: institutions.map(
        ({ id, name }: { id: string; name: string }) => ({
          value: id,
          label: name,
        })
      ),
    }));
  }, [institutions]);

  // update clientParty options
  useEffect(() => {
    if (!newCase.caseTypeID || !caseTypes.length || caseTypes.length < 1)
      return;

    const foundCaseType = caseTypes.find(
      ({ id }: { id: string }) => id === newCase.caseTypeID
    );
    if (!foundCaseType) {
      toast.error("CaseType not found");
      return;
    }
    const { primaryParty, secondaryParty } = foundCaseType;

    setOptions((prev) => ({
      ...prev,
      clientParties: [primaryParty, secondaryParty],
    }));
  }, [newCase.caseTypeID, caseTypes]);

  //handle case initialization
  async function initializeCase(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();

    //validate case name
    const nameError_ = nameValidator(newCase.name.value);
    if (nameError_) {
      setNewCase((prev) => ({
        ...prev,
        name: { ...prev.name, error: nameError_ },
      }));
      toast.error(nameError_);
      return;
    }

    //validate client name
    const clientNameError_ = nameValidator(newCase.clientName.value);
    if (clientNameError_) {
      setNewCase((prev) => ({
        ...prev,
        clientName: { ...prev.clientName, error: nameError_ },
      }));
      toast.error(clientNameError_);
      return;
    }

    //validate tel
    const clientTelError_ = telValidator(newCase.clientTel.value);
    if (clientTelError_) {
      setNewCase((prev) => ({
        ...prev,
        clientTel: { ...prev.clientTel, error: clientTelError_ },
      }));
      toast.error(clientTelError_);
      return;
    }

    const inputErrors_ = {
      name: nameValidator(newCase.name.value),
      // description: "",
      caseTypeID: !newCase.caseTypeID ? "No Case Type provided" : "",
      institutionID: !newCase.institutionID ? "No Institution provided" : "",
      clientParty: !newCase.clientParty ? "No Client Party provided" : "",
    };
    //
    const errors_ = Object.values(inputErrors_).filter(Boolean);
    if (errors_.length > 0) {
      errors_.forEach((error) => {
        toast.error(error);
      });
      return;
    }

    const newCaseObj = {
      name: newCase.name.value,
      description: newCase.description,
      caseTypeID: newCase.caseTypeID,
      institutionID: newCase.institutionID,
      clientParty: newCase.clientParty,
      clientName: newCase.clientName.value,
      clientTel: newCase.clientTel.value,
    };
    console.log("Initializing case", newCaseObj);

    setUIstate("loading");

    try {
      // fetch options
      let fetchOptions = {
        method: "POST",
        // headers: {
        //   "Content-Type": "application/json",
        //   'Content-Type': 'application/x-www-form-urlencoded',
        // },
        body: JSON.stringify(newCaseObj),
      };

      // POST request using fetch
      const _res = await fetch("/api/dashboard/case", fetchOptions).then(
        async (res_) => {
          if (res_.ok) {
            return await res_.json();
          } else {
            console.log(`ERROR: ` + JSON.stringify(res_));
            setUIstate(httpCodes[res_.status]);
          }
        }
      );
      if (_res?.success) {
        console.log(
          "SUCCESS: case initialized successfully\n > " +
            JSON.stringify(_res.success) +
            "\n.............."
        );
        toast.success("Case initialized successfully!");
        await refreshData();
        router.replace(`/dashboard/cases/${_res.success.id}`);
      } else {
        console.error(
          "ERROR: failed to initialize case at /dashboard/cases/new /page\n > " +
            JSON.stringify(_res) +
            "\n.............."
        );
        setUIstate(_res?.error ?? "No Response, check internet connection");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Case initialization failed:", error.message);
      } else {
        console.error("Case initialization failed:", error);
      }
      // setUIstate("Error: Institution was not initialized");
      toast.error("Case NOT initialized");
    }
  }

  return (
    <Card x-chunk="dashboard-04-chunk-1">
      <CardHeader>
        <CardTitle className="font-light">Create New Case</CardTitle>
        {/* <CardDescription className="text-lg text-muted-foreground font-semibold">
          Create New Case
        </CardDescription> */}
      </CardHeader>
      <CardContent>
        <form className=" flex flex-col gap-4 w-full">
          <div id="nameWrapper" className="grid w-full items-center gap-1.5">
            <Label htmlFor="name" className="opacity-75">
              Case Name *
            </Label>
            <Input
              type="text"
              id="name"
              placeholder="case Name"
              value={newCase.name.value}
              onChange={(e) =>
                setNewCase((prev) => ({
                  ...prev,
                  name: { error: "", value: e.target.value },
                }))
              }
            />
          </div>
          <div id="typeWrapper" className="grid w-full items-center gap-1.5">
            <Label htmlFor="type" className="opacity-75">
              Type *
            </Label>
            <Select
              name="type"
              value={newCase.caseTypeID}
              onValueChange={(value) => {
                setNewCase((prev) => ({
                  ...prev,
                  caseTypeID: value,
                }));
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select case type..." />
              </SelectTrigger>
              <SelectContent className="bg-muted">
                {options.caseTypes.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div
            id="institutionWrapper"
            className="grid w-full items-center gap-1.5"
          >
            <Label htmlFor="role" className="opacity-75">
              Institution *
            </Label>
            <Select
              name="institution"
              value={newCase.institutionID}
              onValueChange={(value) => {
                setNewCase((prev) => ({
                  ...prev,
                  institutionID: value,
                }));
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an institution" />
              </SelectTrigger>
              <SelectContent className="bg-muted">
                {options.institutions.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div
            id="clientPartyWrapper"
            className="grid w-full items-center gap-1.5"
          >
            <Label htmlFor="clientParty" className="opacity-75">
              client Party *
            </Label>
            <Select
              name="clientParty"
              value={newCase.clientParty}
              disabled={!newCase.caseTypeID}
              onValueChange={(value) => {
                setNewCase((prev) => ({
                  ...prev,
                  clientParty: value,
                }));
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    !newCase.caseTypeID
                      ? "Fill case type to activate"
                      : "Select a party..."
                  }
                />
              </SelectTrigger>
              <SelectContent className="bg-muted">
                {options.clientParties.map((party) => (
                  <SelectItem key={party} value={party}>
                    {party}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div
            id="clientNameWrapper"
            className="grid w-full items-center gap-1.5"
          >
            <Label htmlFor="clientName" className="opacity-75">
              client Name *
            </Label>
            <Input
              type="text"
              id="clientName"
              placeholder="Client Name"
              className="placeholder:italic"
              value={newCase.clientName.value}
              onChange={(e) =>
                setNewCase((prev) => ({
                  ...prev,
                  clientName: { error: "", value: e.target.value },
                }))
              }
            />
          </div>
          <div
            id="clientTelWrapper"
            className="grid w-full items-center gap-1.5"
          >
            <Label htmlFor="clientTel" className="opacity-75">
              client Phone No. *
            </Label>
            <Input
              type="tel"
              id="clientTel"
              placeholder="client's Phone No."
              className="placeholder:italic"
              value={newCase.clientTel.value}
              onChange={(e) =>
                setNewCase((prev) => ({
                  ...prev,
                  clientTel: { error: "", value: e.target.value },
                }))
              }
            />
          </div>
          <div
            id="descriptionWrapper"
            className="grid w-full items-center gap-1.5"
          >
            <Label htmlFor="description" className="opacity-75">
              Case Description
            </Label>

            <Textarea
              value={newCase.description}
              className="placeholder:italic"
              onChange={(e) =>
                setNewCase((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Type more information about case"
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        {UIstate === "loading" ? (
          <Loader />
        ) : (
          <Button onClick={initializeCase}>Create Case</Button>
        )}
      </CardFooter>
    </Card>
  );
}
