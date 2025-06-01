import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";
import {
  Elements,
  useStripe,
  useElements,
  CardElement,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import * as planOrdersApi from "../services/planOrderService";

import { useAuth } from "../context/AuthContext";

const stripePromise = loadStripe(
  import.meta.env.VITE_REACT_APP_STRIPE_PUBLISHABLE_KEY || ""
);

interface PlanPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
  onBack: () => void;
  amount: number;
  description: string;
  orderId: string | null;
}

const CheckoutForm = ({
  onPaymentSuccess,
  onBack,
  amount,
  description,
  orderId,
}: Omit<PlanPaymentModalProps, "isOpen" | "onClose">) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !orderId) {
      setError("Payment details are incomplete. Please try again.");
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
      const clientSecret = await planOrdersApi.getPaymentIntentClientSecret(
        orderId
      );

      if (!clientSecret) {
        setError("Could not retrieve payment details from the server.");
        setIsProcessing(false);
        return;
      }

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
        if (orderId) {
          try {
            await planOrdersApi.updatePlanOrderStatus(orderId, {
              paymentStatus: "paid",
              paymentId: paymentIntent.id,
            });
          } catch (updateError) {
            console.error("Failed to update order status:", updateError);
          }
        }

        setIsComplete(true);
        setIsProcessing(false);
        setTimeout(() => {
          onPaymentSuccess();
        }, 1500);
      } else {
        setError("Payment failed or was not successful.");
        setIsProcessing(false);
      }
    } catch (err: any) {
      console.error("Payment error:", err);

      if (err.response && err.response.data && err.response.data.message) {
        setError(
          `Error fetching payment details: ${err.response.data.message}`
        );
      } else {
        setError(err.message || "An error occurred during payment processing.");
      }
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
          Your plan order has been confirmed.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-medium text-center">Payment Details</h3>
      <p className="text-sm text-gray-500 text-center">{description}</p>
      <p className="text-sm text-gray-500 text-center">
        Amount Due: ${amount.toFixed(2)}
      </p>

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

      <div className="flex justify-between gap-2">
        <Button variant="outline" onClick={onBack} disabled={isProcessing}>
          Back
        </Button>
        <Button
          type="submit"
          className="bg-nutrition-primary text-white hover:bg-nutrition-primary/90"
          disabled={isProcessing || !stripe || !elements}
        >
          {isProcessing ? "Processing..." : "Pay Now"}
        </Button>
      </div>
    </form>
  );
};

export default function PlanPaymentModal({
  isOpen,
  onClose,
  onPaymentSuccess,
  onBack,
  amount,
  description,
  orderId,
}: PlanPaymentModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Payment</DialogTitle>
        </DialogHeader>
        <Elements stripe={stripePromise}>
          <CheckoutForm
            onPaymentSuccess={onPaymentSuccess}
            onBack={onBack}
            amount={amount}
            description={description}
            orderId={orderId}
          />
        </Elements>
      </DialogContent>
    </Dialog>
  );
}
