"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./page.module.css";

export default function PaymentSuccess() {
    const searchParams = useSearchParams();
    const paymentIntentClientSecret = searchParams.get("payment_intent_client_secret");
    const [status, setStatus] = useState("loading");

    useEffect(() => {
        if (!paymentIntentClientSecret) {
            setStatus("error");
            return;
        }
        setStatus("success");
    }, [paymentIntentClientSecret]);

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                {status === "success" ? (
                    <>
                        <div className={styles.icon}>✅</div>
                        <h1 className={styles.title}>Payment Successful!</h1>
                        <p className={styles.message}>
                            Thank you for your payment. Your registration is now complete.
                            We have sent a confirmation email to you.
                        </p>
                        <Link href="/" className={styles.button}>
                            Return to Home
                        </Link>
                    </>
                ) : status === "error" ? (
                    <>
                        <div className={styles.icon}>⚠️</div>
                        <h1 className={styles.title}>Something went wrong</h1>
                        <p className={styles.message}>We couldn't verify your payment details.</p>
                        <Link href="/" className={styles.button}>
                            Return to Home
                        </Link>
                    </>
                ) : (
                    <p>Verifying payment...</p>
                )}
            </div>
        </div>
    );
}
