import { PaymentStatus } from "@prisma/client";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export async function paystackPaymentSucceed(providerTransactionId: string): Promise<PaymentStatus> {
    if (!PAYSTACK_SECRET_KEY) {
        console.error('missong env variable - PAYSTACK_SECRET_KEY');
        return PaymentStatus.PENDING
    }

    const paystackRes = await fetch(`https://api.paystack.co/transaction/verify/${providerTransactionId}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json",
        },
    }).then(async (res_) => {
        if (res_.ok) {
            return await res_.json();
        }
        const err_ = `Error ${res_.status} - ${await res_.json()}`;
        console.log(err_);
        return;
    });

    if (!paystackRes) {
        console.error("Failed to verify transaction with Paystack");
        return PaymentStatus.PENDING
    }

    const data: any = paystackRes.data;
    if (paystackRes.status === true && data.status === "success") {
        return PaymentStatus.SUCCEEDED
    } else {
        return PaymentStatus.PENDING
    }
}