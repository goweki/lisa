"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { formatNumberToK, strPascalCase } from "@/helpers/stringHandlers";
import { CheckIcon } from "lucide-react";
import React, { useState, useContext, useCallback, useEffect } from "react";
import CheckoutForm from "./checkoutForm";
import { signOut } from "next-auth/react";
import { PlanName } from "@prisma/client";
import toast from "react-hot-toast";
import { Plan, PlanFeature } from "@/types/models";

export type DurationRegime = "monthly" | "yearly";
type PriceDetails = {
  [K in DurationRegime]: number;
};

export interface Packag {
  name: PlanName;
  regime: DurationRegime;
}

export default function PaymentsSection({ exit }: { exit?: () => any }) {
  const [regime, setRegime] = useState<DurationRegime>("monthly");
  const [packages, setPlans] = useState<Plan[]>([]);

  const toggleRegime = () =>
    setRegime((prev) => (prev === "monthly" ? "yearly" : "monthly"));

  const fetchPlansData = useCallback(async () => {
    try {
      const fetchOptions = {
        method: "GET",
      };
      const response = await fetch(`/api/dashboard/plan`, fetchOptions).then(
        async (res_) => {
          if (res_.ok) {
            return await res_.json();
          } else {
            //CHECKPOINT
            const error_ = await res_.json();
            console.error(`ERROR: ` + error_ || "Error fetching plans data");
            toast.error(error_);
          }
        }
      );

      if (!response) {
        return;
      }
      console.log("plans data", response);
      setPlans(response);
    } catch (err) {
      console.error("ERROR: caught error\n > " + err);
    }
  }, []);

  useEffect(() => {
    fetchPlansData();
  }, []);

  return (
    <div className="container mx-auto px-4 md:px-6 2xl:max-w-[1400px] py-8 lg:py-16">
      {exit && (
        <nav className="transparent border-none flex">
          <button
            onClick={exit}
            className="ml-auto relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800"
          >
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
              Exit
            </span>
          </button>
        </nav>
      )}
      {/* Title */}
      <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          Get A Plan to Continue
        </h2>
        <p className="mt-1 text-muted-foreground">
          Curated packages to suit you, whether starting, scaling or large...
        </p>
      </div>
      {/* End Title */}
      {/* Switch */}
      <div className="flex justify-center items-center">
        <Label htmlFor="payment-schedule" className="me-3">
          Monthly
        </Label>
        <Switch checked={regime === "yearly"} onCheckedChange={toggleRegime} />
        <Label htmlFor="payment-schedule" className="relative ms-3">
          Annual
          <span className="absolute -top-10 start-auto -end-28">
            <span className="flex items-center">
              <svg
                className="w-14 h-8 -me-6"
                width={45}
                height={25}
                viewBox="0 0 45 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M43.2951 3.47877C43.8357 3.59191 44.3656 3.24541 44.4788 2.70484C44.5919 2.16427 44.2454 1.63433 43.7049 1.52119L43.2951 3.47877ZM4.63031 24.4936C4.90293 24.9739 5.51329 25.1423 5.99361 24.8697L13.8208 20.4272C14.3011 20.1546 14.4695 19.5443 14.1969 19.0639C13.9242 18.5836 13.3139 18.4152 12.8336 18.6879L5.87608 22.6367L1.92723 15.6792C1.65462 15.1989 1.04426 15.0305 0.563943 15.3031C0.0836291 15.5757 -0.0847477 16.1861 0.187863 16.6664L4.63031 24.4936ZM43.7049 1.52119C32.7389 -0.77401 23.9595 0.99522 17.3905 5.28788C10.8356 9.57127 6.58742 16.2977 4.53601 23.7341L6.46399 24.2659C8.41258 17.2023 12.4144 10.9287 18.4845 6.96211C24.5405 3.00476 32.7611 1.27399 43.2951 3.47877L43.7049 1.52119Z"
                  fill="currentColor"
                  className="text-muted-foreground"
                />
              </svg>
              <Badge className="mt-3 uppercase">Save up to 16%</Badge>
            </span>
          </span>
        </Label>
      </div>
      {/* End Switch */}
      {/* Grid */}
      <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:items-center">
        {packages?.length !== 0
          ? packages?.map((pkg, i) => (
              <Card
                key={i}
                className={`${i === 1 ? "border-primary" : ""} flex flex-col`}
              >
                <CardHeader className="text-center pb-2">
                  {i === 1 && (
                    <Badge className="uppercase w-max self-center mb-3">
                      Most popular
                    </Badge>
                  )}
                  <CardTitle className="!mb-7">
                    {strPascalCase(pkg.name)}
                  </CardTitle>

                  <span className="font-bold text-3xl text-emerald-500">
                    <span className="text-xl opacity-75 font-normal -ml-8 text-foreground">
                      {pkg.currency}.
                    </span>
                    {formatNumberToK(
                      regime === "monthly"
                        ? pkg.priceMonthly
                        : regime === "yearly"
                          ? pkg.priceAnnual
                          : 0
                    )}
                  </span>
                </CardHeader>
                <CardDescription className="text-center w-11/12 mx-auto">
                  {pkg.description}
                </CardDescription>
                <CardContent className="flex-1">
                  <ul className="mt-7 space-y-2.5 text-sm">
                    {pkg.planFeatures?.map((planFeat: PlanFeature, i) => (
                      <li key={i} className="flex space-x-2">
                        <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                        <span className="text-muted-foreground">
                          {planFeat.feature?.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <BuyCTA
                    label="BUY"
                    variant={i === 1 ? "default" : undefined}
                    amount={
                      regime === "monthly"
                        ? pkg.priceMonthly
                        : regime === "yearly"
                          ? pkg.priceAnnual
                          : 0
                    }
                    // packag={{ name: pkg.name as PlanName, regime }}
                    pkg={pkg}
                  />
                </CardFooter>
              </Card>
            ))
          : null}
      </div>
      {/* End Grid */}
    </div>
  );
}

function BuyCTA({
  label = "BUY",
  amount,
  pkg,
  variant = "outline",
}: {
  label: string;
  pkg: Plan;
  amount: number;
  variant?: "outline" | "default";
}) {
  const [open, setOpen] = useState<boolean>(false);

  const closeModal = () => {
    console.log("closing modal...");
    setOpen(false);
  };

  // 🧠 Determine regime based on amount
  const regime =
    amount === pkg.priceMonthly
      ? "monthly"
      : amount === pkg.priceAnnual
        ? "yearly"
        : "monthly";

  return (
    <>
      <Button
        variant={variant}
        className="w-full"
        onClick={() => setOpen(true)}
      >
        {label}
      </Button>
      <PaymentDialogue open={open} setOpen={setOpen} title="Checkout">
        <CheckoutForm
          closeModal={closeModal}
          amount={amount}
          packag={{
            name: pkg.name,
            regime,
          }}
        />
      </PaymentDialogue>
    </>
  );
}

function PaymentDialogue({
  title = "Title",
  open,
  setOpen,
  Description,
  children,
}: {
  title?: string;
  open: boolean;
  setOpen: (state: boolean) => void;
  // closeModal: () => void;
  Description?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{Description}</DialogDescription>
        </DialogHeader>
        {children}
        {/* <DialogFooter>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}
