import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PaymentTransaction } from "@prisma/client";
import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { DataContext } from "../providers";
import { dateShort } from "@/helpers/dateHandlers";

export function PaymentsList({
  payments: _payments,
}: {
  payments: PaymentTransaction[];
}) {
  const searchParams = useSearchParams();
  const paymentRef = searchParams.get("ref");
  const {
    data: { payments },
    refreshData,
  } = useContext(DataContext);

  const [searchPhrase, setSearchPhrase] = useState<string>("");

  const [filtPayments, setFiltPayments] = useState<PaymentTransaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] =
    useState<PaymentTransaction | null>(null);

  //filter blogposts by searchphrase
  useEffect(() => {
    const filtPayments_ = payments?.filter(({ providerTransactionId }) =>
      providerTransactionId.toLowerCase().includes(searchPhrase.toLowerCase())
    );
    setFiltPayments(filtPayments_ || []);
  }, [searchPhrase, searchPhrase]);

  //if paymentRef
  useEffect(() => {
    if (paymentRef) {
      const paymentInSearch = payments.find(({ id }) => id === paymentRef); // Filter to remove empty segments
      setSelectedTransaction(paymentInSearch || null);
    }
  }, [paymentRef, payments]);

  return (
    <div className="flex flex-col w-full gap-4 lg:gap-6">
      <Input
        type="text"
        name="search"
        placeholder="search..."
        className="placeholder:italic my-2 md:my-4"
        value={searchPhrase}
        onChange={(e) => setSearchPhrase(e.target.value)}
      />
      <Table className="border">
        {/* <TableCaption>Payments made</TableCaption> */}
        <TableHeader className="bg-muted text-muted-foreground">
          <TableRow>
            <TableHead>REFERENCE</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtPayments.map((payment_) => (
            <TableRow key={payment_.providerTransactionId}>
              <TableCell className="font-medium">
                {payment_.providerTransactionId.split("-").pop()}
              </TableCell>
              <TableCell>
                {payment_.status === "SUCCEEDED"
                  ? "✅ succeed"
                  : payment_.status === "PENDING"
                    ? "⚠️ pending"
                    : "❌ cancelled"}
              </TableCell>

              <TableCell className="text-left">
                <span className="font-semibold">
                  {payment_.amount.toLocaleString()}
                </span>{" "}
                <span className="text-xs text-muted-foreground">
                  {payment_.currency}
                </span>
              </TableCell>
              <TableCell>{payment_.paymentMethod}</TableCell>
              <TableCell>{dateShort(new Date(payment_.createdAt))}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        {/* <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">00.00</TableCell>
        </TableRow>
      </TableFooter> */}
      </Table>
    </div>
  );
}
