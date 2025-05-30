import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Check } from "lucide-react";
import {
  Elements,
  useStripe,
  useElements,
  CardElement,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import api from "@/services/api";

const stripePromise = loadStripe(
  import.meta.env.VITE_REACT_APP_STRIPE_PUBLISHABLE_KEY || ""
);

interface PaymentSectionProps {
  onComplete: (paymentIntentId: string) => void;
  onBack: () => void;
  amount: number;
  serviceId: string;
  consultationType: string;
}

const CheckoutForm = ({
  onComplete,
  onBack,
  amount,
  serviceId,
  consultationType,
}: PaymentSectionProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setIsProcessing(false);
      setError("Card element not found.");
      return;
    }

    try {
      const { data: clientSecret } = await api.appointments.createPaymentIntent(
        {
          amount: Math.round(amount * 100),
          serviceId,
          consultationType,
        }
      );

      const { paymentIntent, error: stripeError } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
          },
        });

      if (stripeError) {
        setError(stripeError.message || "An unknown error occurred.");
        setIsProcessing(false);
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        setIsComplete(true);
        setIsProcessing(false);
        setTimeout(() => {
          onComplete(paymentIntent.id);
        }, 1500);
      } else {
        setError("Payment failed or was not successful.");
        setIsProcessing(false);
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      setError(err.message || "An error occurred during payment processing.");
      setIsProcessing(false);
    }
  };

  if (isComplete) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-medium text-center">Payment Successful!</h3>
        <p className="text-sm text-gray-500 mt-2 text-center">
          Your appointment has been confirmed. You'll receive a confirmation
          email shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-medium text-center">Payment Details</h3>
      <p className="text-sm text-gray-500 text-center">Amount Due: ${amount}</p>

      <div className="p-4 bg-gray-50 rounded-lg border">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="card-element">Card Details</Label>
            <div id="card-element" className="p-2 border rounded bg-white">
              <CardElement />
            </div>
          </div>
        </div>
      </div>

      {error && <div className="text-red-500 text-sm text-center">{error}</div>}

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack} disabled={isProcessing}>
          Back
        </Button>
        <Button
          type="submit"
          className="bg-nutrition-primary text-white hover:bg-nutrition-primary/90"
          disabled={isProcessing || !stripe || !elements}
        >
          {isProcessing ? "Processing..." : "Complete Payment"}
        </Button>
      </div>
    </form>
  );
};

const PaymentSection = (props: PaymentSectionProps) => (
  <Elements stripe={stripePromise}>
    <CheckoutForm {...props} />
  </Elements>
);

export default PaymentSection;
