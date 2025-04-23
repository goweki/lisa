import { Loader1 } from "@/components/atoms/loader";
import { Button } from "@/components/ui/button";
import { httpCodes } from "@/lib/configs";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function AssignmentRequestComponent(params: {
  uiState: string;
  setUIstate: any;
  selectedCaseID: string;
  assigneeID: string | null;
  pendingRequest: any;
  refreshData: () => Promise<void>;
}) {
  const router = useRouter();
  const {
    uiState,
    setUIstate,
    selectedCaseID,
    refreshData,
    pendingRequest,
    assigneeID,
  } = params;

  //func to Request Assignment
  async function handleAssignmentRequest() {
    console.log("Requesting assignment for case: ", selectedCaseID);
    setUIstate("loading");

    try {
      // fetch options
      let fetchOptions = {
        method: "POST",
        body: JSON.stringify({
          caseID: selectedCaseID,
        }),
      };
      // POST request using fetch
      const _res = await fetch("/api/dashboard/assignment", fetchOptions).then(
        async (res_) => {
          if (res_.ok) {
            return await res_.json();
          } else {
            console.error(`ERROR: ` + JSON.stringify(res_));
            toast.error(httpCodes[res_.status]);
          }
        }
      );
      if (_res?.success) {
        console.log(
          "SUCCESS: assignment requested successfully\n > " +
            JSON.stringify(_res.success) +
            "\n.............."
        );
        toast.success("Assignment requested successfully!");
        await refreshData();
        router.refresh();
      } else {
        console.error(
          "ERROR: failed to request assignment\n > " +
            JSON.stringify(_res) +
            "\n.............."
        );
        toast.error(_res?.error ?? "No Response, check internet connection");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Assignment request failed:", error.message);
      } else {
        console.error("Assignment request failed:", error);
      }
      // setUIstate("Error: Institution was not initialized");
      toast.error("Assignment request failed");
    } finally {
      setUIstate("OK");
    }
  }

  //func to Cancel Assignment Request
  async function handleRequestCancellation() {
    console.log("Cancelling request for case: ", pendingRequest.id);
    setUIstate("loading");

    try {
      // fetch options
      let fetchOptions = {
        method: "DELETE",
        body: JSON.stringify({
          requestID: pendingRequest.id,
        }),
      };
      // POST request using fetch
      const _res = await fetch("/api/dashboard/assignment", fetchOptions).then(
        async (res_) => {
          if (res_.ok) {
            return await res_.json();
          } else {
            console.error(`ERROR: ` + JSON.stringify(res_));
            toast.error(httpCodes[res_.status]);
          }
        }
      );
      if (_res?.success) {
        console.log(
          "SUCCESS: request cancelled\n > " +
            JSON.stringify(_res.success) +
            "\n.............."
        );
        toast.success("Request CANCELLED successfully!");
        await refreshData();
        router.refresh();
      } else {
        console.error(
          "ERROR: failed to cancel request\n > " +
            JSON.stringify(_res) +
            "\n.............."
        );
        toast.error(_res?.error ?? "No Response, check internet connection");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("request cancellation FAILED: ", error.message);
      } else {
        console.error("request cancellation FAILED: ", error);
      }
      // setUIstate("Error: Institution was not initialized");
      toast.error("request cancellation FAILED");
    } finally {
      setUIstate("OK");
    }
  }

  return (
    <Button
      variant="outline"
      type="button"
      className={`w-fit ${
        !pendingRequest
          ? ""
          : "border-destructive hover:bg-destructive hover:text-destructive-foreground"
      }`}
      onClick={
        !pendingRequest ? handleAssignmentRequest : handleRequestCancellation
      }
    >
      {uiState === "loading" ? (
        <div className="items-center justify-center space-x-2 pt-1 loader [&>*:nth-child(even)]:bg-emerald-200 [&>*:nth-child(odd)]:bg-gray-200 rounded-full flex">
          <div className="w-4 h-4 rounded-full animate-[loader_0.6s_infinite_alternate] "></div>
          <div className="w-4 h-4 rounded-full animate-[loader_0.6s_infinite_alternate] delay-200"></div>
          <div className="w-4 h-4 rounded-full animate-[loader_0.6s_infinite_alternate] delay-400"></div>
        </div>
      ) : pendingRequest ? (
        "Cancel Request"
      ) : (
        "Request Assignment"
      )}
    </Button>
  );
}
