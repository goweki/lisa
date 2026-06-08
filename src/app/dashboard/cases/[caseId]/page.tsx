"use client";
import { useContext, useState, useEffect, use } from "react";
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
import { Loader } from "@/components/atoms/loader";
import {
  emailValidator,
  nameValidator,
  telValidator,
} from "@/helpers/inputValidators";
import { httpCodes } from "@/lib/configs";
import { User, Institution, Case, Task } from "@/types/models";
import { arraysEqual, isKeyOf } from "@/lib/utils";
import { TemplateObj } from "@/types/custom";
import {
  Card,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InputImage } from "@/components/atoms/inputs";
import MultipleSelector, {
  Option as MultiSelectOption,
} from "@/components/atoms/multiSelect";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import TaskModal from "@/components/mols/taskModal";
import { Task as TaskType } from "@/types/models";
import { dateShort, isDatePassed } from "@/helpers/dateHandlers";
import AssignmentRequestComponent from "./_components/assigneeComponent";
import { AssigneeRequest } from "@prisma/client";

export default function CaseView(props: { params: Promise<{ caseId: string }> }) {
  const params = use(props.params);
  const { caseId } = params;
  const {
    data: { users, institutions, cases, caseTypes, assignmentRequests },
    refreshData,
  } = useContext(DataContext);
  const { data: session } = useSession();

  const { edgestore } = useEdgeStore();
  const router = useRouter();
  const [selectedCase, setSelectedCase] = useState<Case>();
  const [caseEdit, setCaseEdit] = useState<Partial<Case>>();
  const [caseIsUpdated, setCaseIsUpdated] = useState(false);
  const [options, setOptions] = useState<{
    caseTypes: TemplateObj[];
    institutions: TemplateObj[];
    clientParties: string[];
    staff: TemplateObj[];
  }>({
    caseTypes: [],
    institutions: [],
    clientParties: [],
    staff: [],
  });
  const [UIstate, setUIstate] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // setSelected, get case by caseID and update selected
  useEffect(() => {
    if (caseId) {
      const selectedCase_ = cases.find(
        ({ id }: { id: string }) => id === caseId
      );
      if (!selectedCase_) {
        console.log("Case not found");
        console.log("all cases ", cases);
        console.log("id - ", caseId);
        return;
      }

      setSelectedCase(selectedCase_);
      setCaseEdit(selectedCase_);
    }
    setUIstate("OK");
  }, [cases, caseId]);

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
    const institutionsOptions =
      institutions?.map(({ id, name }: { id: string; name: string }) => ({
        value: id,
        label: name,
      })) || [];

    setOptions((prev) => ({
      ...prev,
      institutions: institutionsOptions,
    }));
  }, [institutions]);

  // update clientParty options
  useEffect(() => {
    if (!caseEdit?.caseTypeId) return;
    // console.log("caseTypeId is: ", caseEdit.caseTypeID || selected?.caseTypeID);

    const foundCaseType = caseTypes.find(
      ({ id }: { id: string }) =>
        id === (caseEdit.caseTypeId || selectedCase?.caseTypeId)
    );

    if (!foundCaseType) return;

    const { primaryParty, secondaryParty } = foundCaseType;

    setOptions((prev) => ({
      ...prev,
      clientParties: [primaryParty, secondaryParty],
    }));
  }, [caseEdit?.caseTypeId, selectedCase?.caseTypeId, caseTypes]);

  // update staff options
  useEffect(() => {
    const usersOptions = users.map(
      ({
        id,
        email,
        names,
      }: {
        id: string;
        email: string | null;
        names: string;
      }) => ({
        value: id,
        label: `${names}: ${email || "<NULL>"}`,
      })
    );

    setOptions((prev) => ({
      ...prev,
      staff: usersOptions,
    }));
  }, [users]);

  //check if any edits to case
  useEffect(() => {
    if (selectedCase && caseEdit) {
      //&& Object.keys(instEdit).length > 0
      const caseIsUpdated = ((selected_: Case, editObj: Partial<Case>) => {
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
      })(selectedCase, caseEdit);
      setCaseIsUpdated(caseIsUpdated);
    }
  }, [selectedCase, caseEdit]);

  //func to Update Case
  async function handleUpdateCase(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();

    if (!selectedCase?.id) {
      toast.error("Sorry, case could not be found");
      return;
    }

    if (!caseEdit) {
      toast.error("Sorry, no case edit");
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
      inputErrors.nameError_ = nameValidator(caseEdit.name, "Case name");
    }
    if (caseEdit.clientName) {
      inputErrors.clientNameError_ = nameValidator(
        caseEdit.clientName,
        "Client name"
      );
    }
    if (caseEdit.clientTel) {
      inputErrors.clientTelError_ = telValidator(caseEdit.clientTel);
    }
    if (caseEdit.clientEmail) {
      inputErrors.clientEmailError_ = emailValidator(caseEdit.clientEmail);
    }
    if (caseEdit.otherPartyName) {
      inputErrors.otherPartyNameError_ = nameValidator(
        caseEdit.otherPartyName,
        "Name of secondary party"
      );
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
      inputErrors.courtError_ = nameValidator(caseEdit.court, "Court name");
    }

    if (Object.values(inputErrors).filter(Boolean).length !== 0) {
      const errors = Object.values(inputErrors).filter(Boolean);
      errors.forEach((error) => {
        toast.error(error);
      });
      return;
    }

    const updatedCaseObj = {
      id: selectedCase.id,
      name: caseEdit?.name === selectedCase.name ? undefined : caseEdit?.name,
      description:
        caseEdit?.description === selectedCase.description
          ? undefined
          : caseEdit?.description,
      court: caseEdit.court === selectedCase.court ? undefined : caseEdit.court,
      assigneeId:
        caseEdit.assigneeId === selectedCase.assigneeId
          ? undefined
          : caseEdit.assigneeId,
      caseNumber:
        caseEdit.caseNumber === selectedCase.caseNumber
          ? undefined
          : caseEdit.caseNumber,
      clientParty:
        caseEdit.clientParty === selectedCase.clientParty
          ? undefined
          : caseEdit.clientParty,
      clientIdNumber:
        caseEdit.clientIdNumber === selectedCase.clientIdNumber
          ? undefined
          : caseEdit.clientIdNumber,
      clientTel:
        caseEdit.clientTel === selectedCase.clientTel
          ? undefined
          : caseEdit.clientTel,
      clientEmail:
        caseEdit.clientEmail === selectedCase.clientEmail
          ? undefined
          : caseEdit.clientEmail,
      clientName:
        caseEdit.clientName === selectedCase.clientName
          ? undefined
          : caseEdit.clientName,
      otherPartyName:
        caseEdit.otherPartyName === selectedCase.otherPartyName
          ? undefined
          : caseEdit.otherPartyName,
      otherPartyTel:
        caseEdit.otherPartyTel === selectedCase.otherPartyTel
          ? undefined
          : caseEdit.otherPartyTel,
      otherPartyEmail:
        caseEdit.otherPartyEmail === selectedCase.otherPartyEmail
          ? undefined
          : caseEdit.otherPartyEmail,
      otherPartyDescription:
        caseEdit.otherPartyDescription === selectedCase.otherPartyDescription
          ? undefined
          : caseEdit.otherPartyDescription,
    };
    console.log("Updating case - ", updatedCaseObj);

    setUIstate("loading");

    try {
      // fetch options
      let fetchOptions = {
        method: "PATCH",
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
    if (!selectedCase?.id) {
      toast.error("Sorry, user not found");
      return;
    }
    // console.log("Deleting user: \n > ", selected.id);
    // fetch options
    let fetchOptions = {
      method: "DELETE",
      body: JSON.stringify({
        id: selectedCase.id,
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

  //func to Complete Task
  async function handleCompleteTask(task: Task) {
    console.log("completing task : ", task.id);

    setUIstate("loading");

    try {
      // fetch options
      let fetchOptions = {
        method: "PATCH",
        body: JSON.stringify({
          id: task.id,
          caseId: task.caseId,
          completedById: true,
        }),
      };
      // POST request using fetch
      const _res = await fetch("/api/dashboard/task", fetchOptions).then(
        async (res_) => {
          if (res_.ok) {
            return await res_.json();
          } else {
            const error_ = `ERROR ${res_.status} - ${await res_.json()}`;
            console.error(error_);
            toast.error(error_);
          }
        }
      );

      if (!_res) return;

      console.log("SUCCESS: task deleted ", _res);
      toast.success("Task deleted successfully!");
      await refreshData();
      router.refresh();
    } catch (error: any) {
      let errorMessage = "Task not deleted";
      if (error.message) errorMessage = error.message;
      // setUIstate("Error: Institution was not initialized");
      toast.error(errorMessage);
    }
  }

  //func to Delete Task
  async function handleDeleteTask(task: Task) {
    console.log("deleting...: ", task.id);

    setUIstate("loading");

    try {
      // fetch options
      let fetchOptions = {
        method: "DELETE",
        body: JSON.stringify({
          id: task.id,
          caseId: task.caseId,
        }),
      };
      // POST request using fetch
      const _res = await fetch("/api/dashboard/task", fetchOptions).then(
        async (res_) => {
          if (res_.ok) {
            return await res_.json();
          } else {
            const error_ = `ERROR ${res_.status} - ${await res_.json()}`;
            console.error(error_);
            toast.error(error_);
          }
        }
      );
      if (_res?.success) {
        console.log(
          "SUCCESS: task deleted successfully\n > " +
            JSON.stringify(_res.success) +
            "\n.............."
        );
        toast.success("Task deleted successfully!");
        await refreshData();
        router.refresh();
      } else {
        console.error(
          "ERROR: failed to delete task\n > " +
            JSON.stringify(_res) +
            "\n.............."
        );
        toast.error(_res?.error ?? "No Response, check internet connection");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Task deletion failed:", error.message);
      } else {
        console.error("Task deletion failed:", error);
      }
      // setUIstate("Error: Institution was not initialized");
      toast.error("Task NOT deleted");
    }
  }

  //render
  return UIstate && selectedCase && caseEdit ? (
    <Card x-chunk="dashboard-04-chunk-1">
      <CardHeader>
        <CardTitle className="font-light">{selectedCase.name}</CardTitle>
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
              value={caseEdit.name}
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
              value={caseEdit?.caseTypeId}
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
              value={caseEdit.caseNumber || ""}
              onChange={(e) =>
                setCaseEdit((prev) => ({
                  ...prev,
                  caseNumber: e.target.value,
                }))
              }
            />
          </div>
          <div
            id="assigneeWrapper"
            className="grid w-full items-center gap-1.5"
          >
            <Label htmlFor="assignee" className="opacity-75">
              Assignee
            </Label>
            {session?.user?.role === "system" ||
            session?.user?.role === "admin" ? (
              <Select
                name="assignee"
                value={caseEdit.assigneeId || ""}
                onValueChange={(value) => {
                  setCaseEdit((prev) => ({
                    ...prev,
                    assigneeId: value,
                  }));
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an assignee" />
                </SelectTrigger>
                <SelectContent className="bg-muted">
                  {options.staff.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <AssignmentRequestComponent
                assigneeID={selectedCase.assigneeId}
                pendingRequest={assignmentRequests?.find(
                  (req: AssigneeRequest) =>
                    req.caseId === selectedCase.id &&
                    req.assigneeId === session?.user?.id &&
                    req.status === "PENDING"
                )}
                uiState={UIstate}
                setUIstate={setUIstate}
                selectedCaseID={selectedCase.id}
                refreshData={refreshData}
              />
            )}
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
                    value={caseEdit.clientParty}
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
                    value={caseEdit.clientName || ""}
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
                    value={caseEdit.clientTel || ""}
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
                    value={caseEdit.clientEmail || ""}
                    onChange={(e) =>
                      setCaseEdit((prev) => ({
                        ...prev,
                        clientEmail: e.target.value,
                      }))
                    }
                  />
                </div>
                <div
                  id="clientIdNumber"
                  className="grid w-full items-center gap-1.5"
                >
                  <Label htmlFor="clientIdNumber" className="opacity-75">
                    client ID/Passport
                  </Label>
                  <Input
                    type="numeric"
                    id="clientIdNumber"
                    placeholder="client ID / passport No."
                    className="placeholder:italic"
                    value={caseEdit.clientIdNumber || ""}
                    onChange={(e) =>
                      setCaseEdit((prev) => ({
                        ...prev,
                        clientIdNumber: e.target.value,
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
                      !caseEdit.clientParty
                        ? ""
                        : options.clientParties.find(
                            (party) =>
                              party !==
                              (caseEdit.clientParty || selectedCase.clientParty)
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
                    value={caseEdit.otherPartyName || ""}
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
                    value={caseEdit.otherPartyTel || ""}
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
                    value={caseEdit.otherPartyEmail || ""}
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
                    value={caseEdit.otherPartyDescription || ""}
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

            <AccordionItem value="tasks">
              <AccordionTrigger>Tasks</AccordionTrigger>
              <AccordionContent className="p-4 pt-0">
                <Card className="overflow-hidden bg-muted/25 border-none">
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-primary/25 hover:bg-primary/25">
                          <TableHead>Task</TableHead>
                          <TableHead className="hidden sm:table-cell">
                            Type
                          </TableHead>
                          <TableHead className="hidden sm:table-cell">
                            Status
                          </TableHead>
                          <TableHead className="hidden md:table-cell">
                            due Date
                          </TableHead>
                          <TableHead className="text-center">
                            <TaskModal _task={{ caseId }} />
                          </TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {selectedCase.tasks && selectedCase.tasks.length > 0 ? (
                          selectedCase.tasks.map((task: TaskType) => (
                            <TableRow
                              key={task.id}
                              className="border-muted hover:bg-muted/25"
                            >
                              <TableCell>
                                <div className="font-medium">{task.name}</div>
                                <div className="hidden text-sm text-muted-foreground md:inline">
                                  {/* {task.case?.name} */}
                                </div>
                              </TableCell>
                              <TableCell className="hidden sm:table-cell">
                                {task.type}
                              </TableCell>
                              <TableCell className="hidden sm:table-cell">
                                <Badge
                                  className={`text-xs ${
                                    task.completedById
                                      ? "border-emerald-500"
                                      : isDatePassed(new Date(task.dueDate))
                                        ? "border-destructive"
                                        : "border-border"
                                  }`}
                                  variant="outline"
                                >
                                  {task.completedById
                                    ? "complete"
                                    : "incomplete"}
                                </Badge>
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                {dateShort(new Date(task.dueDate))}
                              </TableCell>
                              <TableCell className="text-center">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      aria-haspopup="true"
                                      size="icon"
                                      variant="ghost"
                                    >
                                      <MoreHorizontal className="h-4 w-4" />
                                      <span className="sr-only">
                                        Toggle menu
                                      </span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent
                                    align="end"
                                    className="text-foreground"
                                  >
                                    {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
                                    <DropdownMenuItem
                                      onClick={() => handleCompleteTask(task)}
                                    >
                                      Complete
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => setSelectedTask(task)}
                                    >
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleDeleteTask(task)}
                                    >
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow className="bg-transparent hover:bg-transparent">
                            <TableCell
                              colSpan={5}
                              className="text-center italic"
                            >
                              No tasks found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </form>
        {selectedTask && (
          <TaskModal
            _task={selectedTask}
            isOpen={!!selectedTask}
            toggleOpen={(open: boolean) => {
              setSelectedTask(null);
            }}
          />
        )}
      </CardContent>
      {(session?.user?.role === "admin" ||
        selectedCase.assigneeId === session?.user?.id) && (
        <CardFooter className="border-t px-6 py-4 min-h-20">
          {UIstate === "loading" ? (
            <Loader />
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
                disabled={!selectedCase?.id}
              >
                Delete Case
              </Button>
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  ) : (
    <Loader />
  );
}
