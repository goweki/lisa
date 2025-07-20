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
import { Button } from "../ui/button";

const CheckoutButton = dynamic(() => import("./checkoutButton"), {
  ssr: false,
  loading: () => <Loader />,
});

const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

export interface PaymentConfig {
  reference: string;
  email: string;
  amount: number;
  currency: "USD" | "KES";
  metadata: {
    custom_fields: Array<{
      display_name: string;
      variable_name: string;
      value: string;
    }>;
    [key: string]: any; // Allows for additional arbitrary metadata properties
  };
  publicKey: string;
}

type PaymentConfigFactory = (packag: string, amount: number) => PaymentConfig;

const def_paymentConfig: PaymentConfigFactory = (
  packag: string,
  amount: number
) => ({
  reference: `${packag}-${new Date().getTime().toString()}`,
  amount,
  currency: "KES",
  email: "", // You likely want to pass this as an argument or get it from context
  metadata: {
    // Corrected: custom_fields is an array of PaystackCustomField objects
    custom_fields: [
      {
        display_name: "Package", // A user-friendly label
        variable_name: "package_name", // A programmatic name
        value: packag,
      },
      // You might add more custom fields here based on your needs
    ],
  },
  publicKey: PAYSTACK_PUBLIC_KEY || "",
});

export default function Checkout({
  packag,
  amount,
  closeModal,
}: {
  packag: string;
  amount: number;
  closeModal: () => void;
}) {
  const [name, setName] = useState<Input>(def_Input);
  const [email, setEmail] = useState<Input>(def_Input);
  const [payConfig, setPayConfig] = useState<PaymentConfig>(
    def_paymentConfig(packag, amount * 100)
  );

  const router = useRouter();

  useEffect(() => {
    let nameError_ = "";
    if (name.value) {
      nameError_ = nameValidator(name.value);
      setName((prev) => ({ ...prev, error: nameError_ }));
    }

    let emailError_ = "";
    if (email.value) {
      emailError_ = emailValidator(email.value);
      setEmail((prev) => ({ ...prev, error: emailError_ }));
    }

    if (!nameError_ || !emailError_) {
      setPayConfig((prev) => ({
        ...prev,
        email: email.value,
        metadata: {
          ...prev.metadata,
          custom_fields: [
            {
              display_name: "Customer Name",
              variable_name: "customer_name",
              value: name.value,
            },
          ],
        },
      }));
    } else {
      // This part looks correct, as def_paymentConfig should return a properly typed PaymentConfig
      setPayConfig(def_paymentConfig(packag, amount));
    }
  }, [email.value, name.value]);

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
          valValidator={(val: string) => {
            if (!val) return "";
            else return nameValidator(val);
          }}
        />
        <InputText
          label="Email *"
          name="email"
          type="email"
          placeholder="Enter your email address"
          icon={SVGemail}
          valObj={email}
          setValue={setEmail}
          valValidator={emailValidator}
        />
      </div>

      {/* Order Summary */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Order Summary</h3>
        <div className="bg-muted/50 p-4 rounded-lg space-y-2">
          <div className="flex justify-between">
            <span>Package</span>
            <span>{packag}</span>
          </div>
          <div className="flex justify-between">
            <span>Price</span>
            <span>Ksh. {amount.toLocaleString("en-US")}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>Ksh. {amount.toLocaleString("en-US")}</span>
          </div>
        </div>
      </div>

      {!PAYSTACK_PUBLIC_KEY ? (
        <>ERROR: missing integration keys</>
      ) : !payConfig.email ? (
        <Button disabled={true} className="text-center italic">
          Enter email to proceed
        </Button>
      ) : (
        <CheckoutButton
          closeModal={closeModal}
          disabled={!!name.error || !!email.error || !PAYSTACK_PUBLIC_KEY}
          config={payConfig}
        />
      )}
    </>
  );
}
