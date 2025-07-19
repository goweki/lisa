"use client";

import { usePaystackPayment } from "react-paystack";
import { PaystackButton } from "react-paystack";
import { HookConfig } from "react-paystack/dist/types";
import { Button } from "../ui/button";

export interface PaymentConfig {
  reference: string;
  email: string;
  amount: number;
  publicKey: string;
}

export default function CheckoutButton({
  config,
  disabled = false,
  onClose = () => console.log("checkout closed"),
  onSuccess = (ref_) => console.log("payment made", ref_),
}: {
  config: HookConfig;
  disabled?: boolean;
  onSuccess?: (ref: any) => void;
  onClose?: () => void;
}) {
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
}
