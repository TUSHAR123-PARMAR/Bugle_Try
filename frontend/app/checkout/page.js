"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/CheckoutForm";
import styles from "./page.module.css";

// Load Stripe outside of render to avoid recreating object
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function CheckoutPage() {
    const searchParams = useSearchParams();
    const registrationId = searchParams.get('registrationId');
    const inquiryId = searchParams.get('inquiryId');

    const [clientSecret, setClientSecret] = useState("");
    const [amount, setAmount] = useState(0);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!registrationId && !inquiryId) {
            setError("Missing payment details.");
            return;
        }

        // Create PaymentIntent as soon as the page loads
        fetch("http://localhost:4000/api/payments/create-payment-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                registrationId: registrationId || undefined,
                inquiryId: inquiryId || undefined
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setClientSecret(data.data.clientSecret);
                    setAmount(data.data.amount);
                } else {
                    setError(data.error || "Failed to initialize payment.");
                }
            })
            .catch((err) => {
                console.error("Payment setup error:", err);
                setError("Could not connect to payment server.");
            });
    }, [registrationId, inquiryId]);

    const appearance = {
        theme: 'stripe',
        variables: {
            colorPrimary: '#2563EB',
        },
    };

    const options = {
        clientSecret,
        appearance,
    };

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Secure Checkout</h1>
                    <p>Complete your registration safely</p>
                </div>

                {error ? (
                    <div className={styles.errorBox}>
                        <h3>⚠️ Error</h3>
                        <p>{error}</p>
                        <a href="/" className={styles.backLink}>Return Home</a>
                    </div>
                ) : (
                    <>
                        {clientSecret ? (
                            <Elements options={options} stripe={stripePromise}>
                                <CheckoutForm amount={amount} />
                            </Elements>
                        ) : (
                            <div className={styles.loading}>
                                <div className={styles.spinner}></div>
                                <p>Loading secure payment...</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
