"use client";
import { useContext, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DataContext } from "@/app/dashboard/providers";
import { Textarea } from "@/components/ui/textarea";
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import toast from "react-hot-toast";
import { useEdgeStore } from "@/lib/edgestore";
import { Loader1 } from "@/components/atoms/loader";
import {
  emailValidator,
  nameValidator,
  telValidator,
} from "@/helpers/inputValidators";
import { httpCodes } from "@/lib/configs";
import { User, Institution, Case } from "@/lib/prisma/types";
import { arraysEqual, isKeyOf } from "@/lib/utils";
import { TemplateObj } from "@/lib/types";
import {
  Card,
  CardTitle,
  CardContent,
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

export default function CaseView({ params }: { params: any }) {
  const { caseID } = params;
  const {
    data: { users, institutions, cases, caseTypes },
    refreshData,
  } = useContext(DataContext);

  const { edgestore } = useEdgeStore();
  const router = useRouter();
  const [selected, setSelected] = useState<Case>();
  const [caseEdit, setCaseEdit] = useState<Partial<Case>>({});
  const [caseIsUpdated, setCaseIsUpdated] = useState(false);
  const [options, setOptions] = useState<{
    caseTypes: TemplateObj[];
    institutions: TemplateObj[];
    clientParties: string[];
    assignees: TemplateObj[];
  }>({
    caseTypes: [],
    institutions: [],
    clientParties: [],
    assignees: [],
  });
  const [UIstate, setUIstate] = useState("");

  // setSelected, get case by caseID and update selected
  useEffect(() => {
    if (caseID) {
      const _selected = cases.find(({ id }: { id: string }) => id === caseID);
      setSelected(_selected);
    }
    setUIstate("OK");
  }, [cases, caseID]);

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
    if (!(caseEdit.caseTypeID || selected?.caseTypeID)) return;
    // console.log("caseTypeId is: ", caseEdit.caseTypeID || selected?.caseTypeID);
    const { primaryParty, secondaryParty } = caseTypes.find(
      ({ id }: { id: string }) =>
        id === (caseEdit.caseTypeID || selected?.caseTypeID)
    );

    setOptions((prev) => ({
      ...prev,
      clientParties: [primaryParty, secondaryParty],
    }));
  }, [caseEdit.caseTypeID, selected?.caseTypeID, caseTypes]);

  // update assignees options
  useEffect(() => {
    setOptions((prev) => ({
      ...prev,
      assignees: users.map(
        ({ id, name, role }: { id: string; name: string; role: string }) => ({
          value: id,
          label: `${role}: ${name}`,
        })
      ),
    }));
  }, [users]);

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

  //check if any edits to case
  useEffect(() => {
    if (selected) {
      //&& Object.keys(instEdit).length > 0
      const caseIsUpdated = ((selected_: Case, editObj: TemplateObj) => {
        // if no values in editObj
        if (Object.values(caseEdit).filter(Boolean).length === 0) return false;

        for (const key in editObj) {
          if (selected_.hasOwnProperty(key)) {
            // console.log("Updates");
            //
            if (isKeyOf<Case>(key, selected_ as Case)) {
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
      })(selected as Case, caseEdit);
      setCaseIsUpdated(caseIsUpdated);
    }
  }, [selected, caseEdit]);

  //func to Update Case
  async function handleUpdateCase(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();

    if (!selected?.id) {
      toast.error("Sorry, case could not be found");
      return;
    }

    //if input error
    const inputErrors = {
      nameError_: "",
      clientNameError_: "",
      clientTelError_: "",
      clientEmailError_: "",
      otherPartyNameError_: "",
      otherPartyTelError_: "",
      otherPartyEmailError_: "",
      courtError_: "",
    };

    if (caseEdit.name) {
      inputErrors.nameError_ = nameValidator(caseEdit.name);
    }
    if (caseEdit.clientName) {
      inputErrors.clientNameError_ = nameValidator(caseEdit.clientName);
    }
    if (caseEdit.clientTel) {
      inputErrors.clientTelError_ = telValidator(caseEdit.clientTel);
    }
    if (caseEdit.clientEmail) {
      inputErrors.clientEmailError_ = emailValidator(caseEdit.clientEmail);
    }
    if (caseEdit.otherPartyName) {
      inputErrors.otherPartyNameError_ = nameValidator(caseEdit.otherPartyName);
    }
    if (caseEdit.otherPartyTel) {
      inputErrors.otherPartyTelError_ = telValidator(caseEdit.otherPartyTel);
    }
    if (caseEdit.otherPartyEmail) {
      inputErrors.otherPartyEmailError_ = emailValidator(
        caseEdit.otherPartyEmail
      );
    }
    if (caseEdit.court) {
      inputErrors.courtError_ = nameValidator(caseEdit.court);
    }

    if (Object.values(inputErrors).filter(Boolean).length !== 0) {
      const errors = Object.values(inputErrors).filter(Boolean);
      errors.forEach((error) => {
        toast.error(error);
      });
      return;
    }

    const updatedCaseObj = {
      id: selected.id,
      name: caseEdit.name || selected.name,
      description: caseEdit.description || selected.description,
      // status: caseEdit.status || selected.status,
      court: caseEdit.court || selected.court,
      userID: caseEdit.userID || selected.userID,
      caseNumber: caseEdit.caseNumber || selected.caseNumber,
      clientParty: caseEdit.clientParty || selected.clientParty,
      clientTel: caseEdit.clientTel || selected.clientTel,
      clientEmail: caseEdit.clientEmail || selected.clientEmail,
      clientName: caseEdit.clientName || selected.clientName,
      otherPartyName: caseEdit.otherPartyName || selected.otherPartyName,
      otherPartyTel: caseEdit.otherPartyTel || selected.otherPartyTel,
      otherPartyEmail: caseEdit.otherPartyEmail || selected.otherPartyEmail,

      otherPartyDescription:
        caseEdit.otherPartyDescription || selected.otherPartyDescription,
    };
    console.log("Initializing case", updatedCaseObj);

    setUIstate("loading");

    try {
      // fetch options
      let fetchOptions = {
        method: "PUT",
        body: JSON.stringify(updatedCaseObj),
      };

      // PUT request using fetch
      const _res = await fetch("/api/dashboard/case", fetchOptions).then(
        async (res_) => {
          if (res_.ok) {
            return await res_.json();
          } else {
            console.log(`ERROR: ` + JSON.stringify(res_));
            toast.error("OOPS: case not updated");
          }
        }
      );
      if (_res?.success) {
        console.log(
          "SUCCESS: Case updated successfully\n > " +
            JSON.stringify(_res.success) +
            "\n.............."
        );
        await refreshData();
        toast.success("Case updated successfully!");
        setUIstate("OK");
      } else {
        console.error(
          "ERROR: failed to update case - ih6\n" +
            JSON.stringify(_res) +
            "\n.............."
        );
        toast.error(_res?.error ?? "No Response, check internet connection");
      }
      setUIstate("OK");
    } catch (error) {}
  }

  // handle onSelect Institutions
  function updateNewUserInstits(selections: MultiSelectOption[]) {
    // console.log("Changed D1: ", selections);
    setCaseEdit((prev) => {
      return {
        ...prev,
        institutionIDs: selections.map(({ value }) => value),
      };
    });
  }

  //func to Delete Case
  async function handleDeleteCase() {
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
    const res = await fetch("/api/dashboard/case", fetchOptions).then(
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
        "SUCCESS: case deleted\n > ",
        res.success,
        "\n.............."
      );

      toast.success("case deleted");
      await refreshData();
      router.replace(`/dashboard/cases/`);
    } else {
      console.log("FAILED: case not deleted\n > ", res, "\n..............");
      toast.error(res.failed ?? res.error ?? "Unknown error");
    }
    setUIstate("OK");
  }

  //render
  return UIstate && selected ? (
    <Card x-chunk="dashboard-04-chunk-1">
      <CardHeader>
        <CardTitle className="font-light">{selected.name}</CardTitle>
        {/* <CardDescription className="text-lg text-muted-foreground font-semibold">
          {selected.name}
        </CardDescription> */}
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4">
          <div id="nameWrapper" className="grid w-full items-center gap-1.5">
            <Label htmlFor="name" className="opacity-75">
              Case Name *
            </Label>
            <Input
              type="text"
              id="name"
              placeholder="case Name"
              className="placeholder:italic"
              value={caseEdit.name || selected.name}
              onChange={(e) =>
                setCaseEdit((prev) => ({
                  ...prev,
                  name: e.target.value,
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
              value={caseEdit.caseTypeID || selected.caseTypeID}
              onValueChange={(value) => {
                setCaseEdit((prev) => ({
                  ...prev,
                  caseTypeID: value,
                }));
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select case type" />
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
          <div id="caseNoWrapper" className="grid w-full items-center gap-1.5">
            <Label htmlFor="caseNo" className="opacity-75">
              Case No.
            </Label>
            <Input
              type="text"
              id="caseNo"
              placeholder="case Number (court filed)"
              className="placeholder:italic"
              value={caseEdit.caseNumber || (selected.caseNumber as string)}
              onChange={(e) =>
                setCaseEdit((prev) => ({
                  ...prev,
                  caseNumber: e.target.value,
                }))
              }
            />
          </div>
          <div id="lawyerWrapper" className="grid w-full items-center gap-1.5">
            <Label htmlFor="lawyer" className="opacity-75">
              Assignee
            </Label>
            <Select
              name="lawyer"
              value={caseEdit.userID || (selected.userID as string) || ""}
              onValueChange={(value) => {
                setCaseEdit((prev) => ({
                  ...prev,
                  userID: value,
                }));
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an assignee" />
              </SelectTrigger>
              <SelectContent className="bg-muted">
                {options.assignees.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="clientDetails">
              <AccordionTrigger>Client</AccordionTrigger>
              <AccordionContent className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4 gap-x-8">
                <div
                  id="clientPartyWrapper"
                  className="grid w-full items-center gap-1.5"
                >
                  <Label htmlFor="clientParty" className="opacity-75">
                    client Party *
                  </Label>
                  <Select
                    name="clientParty"
                    value={caseEdit.clientParty || selected.clientParty || ""}
                    // disabled={!newCase.caseTypeID}
                    onValueChange={(value) => {
                      setCaseEdit((prev) => ({
                        ...prev,
                        clientParty: value,
                      }));
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={"Select a party..."} />
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
                    placeholder="client Name"
                    className="placeholder:italic"
                    value={caseEdit.clientName || selected.clientName}
                    onChange={(e) =>
                      setCaseEdit((prev) => ({
                        ...prev,
                        clientName: e.target.value,
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
                    placeholder="client Pnone Number"
                    className="placeholder:italic"
                    value={caseEdit.clientTel || selected.clientTel}
                    onChange={(e) =>
                      setCaseEdit((prev) => ({
                        ...prev,
                        clientTel: e.target.value,
                      }))
                    }
                  />
                </div>
                <div
                  id="clientEmailWrapper"
                  className="grid w-full items-center gap-1.5"
                >
                  <Label htmlFor="clientEmail" className="opacity-75">
                    client Email
                  </Label>
                  <Input
                    type="email"
                    id="clientEmail"
                    placeholder="client Email"
                    className="placeholder:italic"
                    value={
                      caseEdit.clientEmail || (selected.clientEmail as string)
                    }
                    onChange={(e) =>
                      setCaseEdit((prev) => ({
                        ...prev,
                        clientEmail: e.target.value,
                      }))
                    }
                  />
                </div>
                <div id="clientID" className="grid w-full items-center gap-1.5">
                  <Label htmlFor="clientEmail" className="opacity-75">
                    client ID/Passport
                  </Label>
                  <Input
                    type="numeric"
                    id="id-passport"
                    placeholder="client ID / passport No."
                    className="placeholder:italic"
                    value={
                      caseEdit.clientEmail || (selected.clientEmail as string)
                    }
                    onChange={(e) =>
                      setCaseEdit((prev) => ({
                        ...prev,
                        clientEmail: e.target.value,
                      }))
                    }
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="otherPartyDetails">
              <AccordionTrigger>Opposing Party</AccordionTrigger>
              <AccordionContent className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4 gap-x-8">
                <div
                  id="otherPartyWrapper"
                  className="grid w-full items-center gap-1.5"
                >
                  <Label htmlFor="otherParty" className="opacity-75">
                    opposing Party *
                  </Label>
                  <Select
                    name="otherParty"
                    value={
                      !(caseEdit.clientParty || selected.clientParty)
                        ? ""
                        : options.clientParties.find(
                            (party) =>
                              party !==
                              (caseEdit.clientParty || selected.clientParty)
                          )
                    }
                    // disabled={!newCase.caseTypeID}
                    disabled={true}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={"Not found"} />
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
                  id="otherPartyNameWrapper"
                  className="grid w-full items-center gap-1.5"
                >
                  <Label htmlFor="otherPartyName" className="opacity-75">
                    opposing-party Name
                  </Label>
                  <Input
                    type="text"
                    id="otherPartyName"
                    placeholder="opposing-party Name"
                    className="placeholder:italic"
                    value={
                      caseEdit.otherPartyName ||
                      (selected.otherPartyName as string)
                    }
                    onChange={(e) =>
                      setCaseEdit((prev) => ({
                        ...prev,
                        otherPartyName: e.target.value,
                      }))
                    }
                  />
                </div>
                <div
                  id="otherPartyTelWrapper"
                  className="grid w-full items-center gap-1.5"
                >
                  <Label htmlFor="otherPartyTel" className="opacity-75">
                    opposing-party Phone No.
                  </Label>
                  <Input
                    type="tel"
                    id="otherPartyTel"
                    placeholder="opposing-party Pnone Number"
                    className="placeholder:italic"
                    value={
                      caseEdit.otherPartyTel ||
                      (selected.otherPartyTel as string)
                    }
                    onChange={(e) =>
                      setCaseEdit((prev) => ({
                        ...prev,
                        otherPartyTel: e.target.value,
                      }))
                    }
                  />
                </div>
                <div
                  id="otherPartyEmailWrapper"
                  className="grid w-full items-center gap-1.5"
                >
                  <Label htmlFor="otherPartyEmail" className="opacity-75">
                    opposing-party Email
                  </Label>
                  <Input
                    type="email"
                    id="otherPartyEmail"
                    placeholder="opposing-party Email"
                    className="placeholder:italic"
                    value={
                      caseEdit.otherPartyEmail ||
                      (selected.otherPartyEmail as string)
                    }
                    onChange={(e) =>
                      setCaseEdit((prev) => ({
                        ...prev,
                        otherPartyEmail: e.target.value,
                      }))
                    }
                  />
                </div>
                <div
                  id="otherPartyDescriptionWrapper"
                  className="grid w-full items-center gap-1.5"
                >
                  <Label htmlFor="otherPartyDescription" className="opacity-75">
                    Advocate&apos;s Information
                  </Label>

                  <Textarea
                    value={
                      caseEdit.otherPartyDescription ||
                      (selected.otherPartyDescription as string)
                    }
                    className="placeholder:italic "
                    onChange={(e) =>
                      setCaseEdit((prev) => ({
                        ...prev,
                        otherPartyDescription: e.target.value,
                      }))
                    }
                    placeholder="opposing-party's representation details"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          {/* <div id="emailWrapper" className="grid w-full items-center gap-1.5">
            <Label htmlFor="email" className="opacity-75">
              Email *
            </Label>
            <Input
              type="email"
              id="email"
              placeholder="official email"
              className="placeholder:italic"
              value={caseEdit.email || selected?.email}
              onChange={(e) =>
                setCaseEdit((prev) => ({
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
              value={caseEdit.role || selected?.role}
              onValueChange={(value) => {
                setCaseEdit((prev) => ({
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
          <div id="telWrapper" className="grid w-full items-center gap-1.5">
            <Label htmlFor="tel" className="opacity-75">
              Phone No.
            </Label>
            <Input
              type="tel"
              id="tel"
              placeholder="user's Phone No."
              className="placeholder:italic"
              value={caseEdit.tel || (selected?.tel as string)}
              onChange={(e) =>
                setCaseEdit((prev) => ({
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
              value={caseEdit.institutionIDs.map((_id) => ({
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
          </div> */}
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
            <Button onClick={handleUpdateCase} disabled={!caseIsUpdated}>
              Update Case
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteCase}
              disabled={!selected?.id}
            >
              Delete Case
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  ) : null;
}
