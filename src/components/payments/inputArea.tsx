"use client";

import { usePaystackPayment } from "react-paystack";
import { InputText } from "../atoms/inputs";
import { SVGcell, SVGemail, SVGprofile } from "../atoms/svgs";
import { useEffect, useState } from "react";
import {
  emailValidator,
  nameValidator,
  telValidator,
} from "@/helpers/inputValidators";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Separator } from "../ui/separator";
import { def_Input, Input, UIstate } from "@/types/custom";
import dynamic from "next/dynamic";
import { Loader } from "../atoms/loader";

const CheckoutButton = dynamic(() => import("./checkoutButton"), {
  ssr: false,
  loading: () => <Loader />,
});

const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

export interface PaymentConfig {
  reference: string;
  email: string;
  amount: number;
  publicKey: string;
}

export default function InputArea({
  packag,
  amount,
}: {
  packag: string;
  amount: number;
}) {
  const [name, setName] = useState<Input>(def_Input);
  const [email, setEmail] = useState<Input>(def_Input);

  const [payConfig, setPayConfig] = useState<PaymentConfig>({
    reference: `${packag}-${new Date().getTime().toString()}`,
    amount,
    email: "",
    publicKey: PAYSTACK_PUBLIC_KEY || "",
  });
  const [UIstate, setUIstate] = useState<UIstate>("loading");
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
    <>
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
        <>ERROR: missing integration keys</>
      ) : !payConfig.email ? (
        <>Enter email to proceed</>
      ) : (
        <CheckoutButton
          disabled={!!name.error || !!email.error || !PAYSTACK_PUBLIC_KEY}
          config={payConfig}
        />
      )}
    </>
  );
}
