"use client";

import { useState, useEffect } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import styles from "./CheckoutForm.module.css";

export default function CheckoutForm({ amount }) {
    const stripe = useStripe();
    const elements = useElements();

    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!stripe) {
            return;
        }

        const clientSecret = new URLSearchParams(window.location.search).get(
            "payment_intent_client_secret"
        );

        if (!clientSecret) {
            return;
        }

        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            switch (paymentIntent.status) {
                case "succeeded":
                    setMessage("Payment succeeded!");
                    break;
                case "processing":
                    setMessage("Your payment is processing.");
                    break;
                case "requires_payment_method":
                    setMessage("Your payment was not successful, please try again.");
                    break;
                default:
                    setMessage("Something went wrong.");
                    break;
            }
        });
    }, [stripe]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/payment-success`,
            },
        });

        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message);
        } else {
            setMessage("An unexpected error occurred.");
        }

        setIsLoading(false);
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit} className={styles.form}>
            <h2 className={styles.title}>Payment Details</h2>

            {amount && (
                <div className={styles.amount}>
                    Total: <span className={styles.price}>${amount}</span>
                </div>
            )}

            <div className={styles.paymentElement}>
                <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
            </div>

            <button disabled={isLoading || !stripe || !elements} id="submit" className={styles.button}>
                <span id="button-text">
                    {isLoading ? "Processing..." : "Pay Now"}
                </span>
            </button>

            {message && <div id="payment-message" className={styles.message}>{message}</div>}

            <p className={styles.secure}>
                🔒 Payments are secure and encrypted
            </p>
        </form>
    );
}
