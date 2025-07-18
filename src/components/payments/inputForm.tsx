"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { usePaystackPayment } from "react-paystack";
import { InputText } from "../atoms/inputs";
import { SVGcell, SVGemail, SVGprofile } from "../atoms/svgs";
import { useEffect, useState } from "react";
import {
  emailValidator,
  nameValidator,
  telValidator,
} from "@/helpers/inputValidators";
import { HookConfig } from "react-paystack/dist/types";
import { ExternalLinkIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Separator } from "../ui/separator";

const PAYSTACK_PUBLIC_KEY = process.env.PAYSTACK_PUBLIC_KEY;

export interface PaymentConfig {
  reference: string;
  email: string;
  amount: number;
  publicKey: string;
}

interface Input {
  value: string;
  error: string;
}

const def_Input = { value: "", error: "" };

export function InputForm({
  packag,
  amount,
}: {
  packag: string;
  amount: number;
}) {
  const [name, setName] = useState<Input>(def_Input);
  const [email, setEmail] = useState<Input>(def_Input);

  const [payConfig, setPayConfig] = useState<HookConfig>({
    reference: `${packag}-${new Date().getTime().toString()}`,
    amount,
    email: "",
    publicKey: PAYSTACK_PUBLIC_KEY || "",
  });
  const [UIstate, setUIstate] = useState<"loading" | "OK">("loading");
  const router = useRouter();

  useEffect(() => {
    const emailError_ = emailValidator(email.value);
    if (emailError_) setEmail((prev) => ({ ...prev, error: emailError_ }));
    else setPayConfig((prev) => ({ ...prev, email: email.value }));
  }, [name.value, email.value]);

  // you can call this function anything
  const onSuccess = (reference: any) => {
    // Implementation for whatever you want to do with reference and after success call.
    console.log("payment made - ", reference);
    toast.success("Payment successful, proceed to dashboard");
    router.push("/dashboard");
  };

  // you can call this function anything
  const onClose = () => {
    console.log("paystack closed");
  };

  return (
    <form
      id="signin"
      className="rounded space-y-6 md:space-y-6 p-8 shadow dark:shadow-dark"
    >
      <div className="space-y-4">
        <InputText
          label="Preferred name (optional)"
          name="name"
          type="name"
          placeholder="eg. Sabrina"
          icon={SVGprofile}
          valObj={name}
          setValue={setName}
          valValidator={nameValidator}
        />
        <InputText
          label="Email *"
          name="email"
          type="email"
          placeholder="Enter your email address"
          icon={SVGemail}
          valObj={email}
          setValue={setEmail}
          valValidator={nameValidator}
        />
      </div>

      {/* Order Summary */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Order Summary</h3>
        <div className="bg-muted/50 p-4 rounded-lg space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>$99.99</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>$9.99</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>$8.80</span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>$118.78</span>
          </div>
        </div>
      </div>

      {!PAYSTACK_PUBLIC_KEY ? (
        <div className="text-red-600">
          SERVER ERROR: Check paystack configuration key
        </div>
      ) : (
        <CheckoutButton
          disabled={!!name.error || !!email.error}
          config={payConfig}
        />
      )}
    </form>
  );
}

const CheckoutButton = ({
  config,
  disabled = false,
  onClose = () => console.log("checkout closed"),
  onSuccess = (ref_) => console.log("payment made", ref_),
}: {
  config: HookConfig;
  disabled?: boolean;
  onSuccess?: (ref: any) => void;
  onClose?: () => void;
}) => {
  const initializePayment = usePaystackPayment(config);
  return (
    <div>
      <Button
        disabled={disabled}
        className="w-full"
        type="button"
        onClick={() => {
          initializePayment({ onSuccess, onClose });
        }}
      >
        {disabled ? "Please fill email/name" : "BUY NOW"}
      </Button>
    </div>
  );
};
