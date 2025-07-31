"use client";

import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { DataContext } from "../providers";
import { Loader } from "@/components/atoms/loader";
import { useSearchParams } from "next/navigation";
import { PaymentTransaction } from "@prisma/client";
import { ValObj } from "@/components/atoms/inputs";
import { Input } from "@/components/ui/input";
import { def_Input } from "@/types/custom";
import { PaymentsList } from "./_comp";

export default function PaymentsPage() {
  const searchParams = useSearchParams();
  const paymentRef = searchParams.get("ref");
  const {
    data: { payments },
    refreshData,
  } = useContext(DataContext);

  const [UIstate, setUIstate] = useState("loading");
  const [filtPayments, setFiltPayments] = useState<PaymentTransaction[]>([]);
  const [searchPhrase, setSearchPhrase] = useState<ValObj>(def_Input);
  const [selectedTransaction, setSelectedTransaction] =
    useState<PaymentTransaction | null>(null);

  //filter blogposts by searchphrase
  useEffect(() => {
    const filtPayments_ = payments?.filter(({ providerTransactionId }) =>
      providerTransactionId
        .toLowerCase()
        .includes(searchPhrase.value.toLowerCase())
    );
    setFiltPayments(filtPayments_ || []);
  }, [searchPhrase, searchPhrase.value]);

  //if paymentRef
  useEffect(() => {
    if (paymentRef) {
      const paymentInSearch = payments.find(({ id }) => id === paymentRef); // Filter to remove empty segments
      setSelectedTransaction(paymentInSearch || null);
    }
    setUIstate("OK");
  }, [paymentRef, payments]);

  //render
  return UIstate === "loading" ? (
    <Loader />
  ) : UIstate ? (
    <main className="flex flex-col flex-1 gap-4 p-4 md:gap-8 md:p-10">
      {/* <div className="mx-auto grid w-full items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]"> */}
      <div className="w-full gap-2">
        <h1 className="uppercase">Payments</h1>
      </div>
      <div className="w-full items-start gap-6 flex flex-col md:flex-row">
        <PaymentsList payments={filtPayments} />
        <nav
          className="grid gap-4 w-full col-span-1 max-w-[520px] "
          x-chunk="dashboard-04-chunk-0"
        >
          <div className="flex flex-col space-y-1">
            <Link
              className={`p-2 rounded bg-primary/20 border border-1 border-primary my-4 md:my-8"
                  : "hover:bg-primary/10"
              }`}
              href="/dashboard/payments/extend"
            >
              BUY PACKAGE
            </Link>
            {/* {filtPayments.length > 0 &&
              filtPayments.map(({ id, createdAt }) => (
                <Link
                  key={id}
                  className={`p-2 rounded bg-primary/20 border border-1 border-primary hover:bg-primary/10"
                  }`}
                  href={`/dashboard/institutions/${id}`}
                >
                  {dateShort(new Date(createdAt))}
                </Link>
              ))} */}
          </div>
        </nav>
      </div>
    </main>
  ) : null;
}
