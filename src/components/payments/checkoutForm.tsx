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
import { Packag } from ".";

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

type PaymentConfigFactory = (packag: Packag, amount: number) => PaymentConfig;

const def_paymentConfig: PaymentConfigFactory = (
  packag: Packag,
  amount: number
) => ({
  reference: `lisa-paystack-${packag.name}-${packag.regime}-${new Date().getTime().toString()}`,
  amount,
  currency: "KES",
  email: "", // You likely want to pass this as an argument or get it from context
  metadata: {
    // Corrected: custom_fields is an array of PaystackCustomField objects
    custom_fields: [],
  },
  publicKey: PAYSTACK_PUBLIC_KEY || "",
});

export default function Checkout({
  packag,
  amount,
  closeModal,
}: {
  packag: Packag;
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
            {
              display_name: "Package", // A user-friendly label
              variable_name: "package_name", // A programmatic name
              value: packag.name,
            },
            {
              display_name: "Duration", // A user-friendly label
              variable_name: "duration", // A programmatic name
              value: packag.regime,
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
  const onSuccess = (_ref: any) => {
    console.log("payment made - ", _ref);
    // message: "Approved"
    // redirecturl: "?trxref=Team-1753050372673&reference=Team-1753050372673"
    // reference: "Team-1753050372673"
    // status: "success"
    // trans: "5164754910"
    // transaction: "5164754910"
    // trxref: "Team-1753050372673"
    if (_ref.status !== "success") {
      toast.custom(
        <div className="bg-orange-200 text-orange-800 px-4 py-2 rounded-lg">
          {_ref.status} - {_ref.message}
        </div>
      );
    } else {
      toast.success(_ref.message);
    }
    fetch("/api/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        providerTransactionId: _ref.reference,
        institutionId: _ref.metadata.institutionId,
        subscriptionId: _ref.metadata.subscriptionId, // optional
        amount: _ref.amount / 100, // Paystack sends in kobo
        paymentMethod: "paystack",
        description: _ref.metadata.description || "Subscription payment",
        metadata: _ref.metadata,
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.text();
          throw new Error(err);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Payment recorded:", data);
        closeModal(); // Close modal or form
        // Optional: Redirect or show toast
        // router.push("/dashboard");
      })
      .catch((err) => {
        console.error("Error saving payment:", err);
        alert("Payment succeeded but saving failed. Please contact support.");
      });
    toast.success("Payment successful, proceed to dashboard");
    router.push("/dashboard");
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
            <span>
              {packag.name}, {packag.regime}
            </span>
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
          onSuccess={onSuccess}
          disabled={!!name.error || !!email.error || !PAYSTACK_PUBLIC_KEY}
          config={payConfig}
        />
      )}
    </>
  );
}
