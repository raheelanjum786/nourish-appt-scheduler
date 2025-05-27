
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Check } from "lucide-react";

interface PaymentSectionProps {
  onComplete: () => void;
  onBack: () => void;
  amount: number;
}

const PaymentSection = ({ onComplete, onBack, amount }: PaymentSectionProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
      
      // Move to the next step after showing confirmation
      setTimeout(() => {
        onComplete();
      }, 1500);
    }, 2000);
  };

  if (isComplete) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-medium text-center">Payment Successful!</h3>
        <p className="text-sm text-gray-500 mt-2 text-center">
          Your appointment has been confirmed. You'll receive a confirmation email shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-center">Payment Details</h3>
      <p className="text-sm text-gray-500 text-center">
        Amount Due: ${amount}
      </p>
      
      <div className="p-4 bg-gray-50 rounded-lg border">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardName">Name on Card</Label>
            <Input
              id="cardName"
              name="cardName"
              placeholder="John Doe"
              value={paymentDetails.cardName}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <div className="relative">
              <Input
                id="cardNumber"
                name="cardNumber"
                placeholder="4242 4242 4242 4242"
                value={paymentDetails.cardNumber}
                onChange={handleInputChange}
              />
              <CreditCard className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input
                id="expiry"
                name="expiry"
                placeholder="MM/YY"
                value={paymentDetails.expiry}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                name="cvv"
                type="password"
                placeholder="123"
                value={paymentDetails.cvv}
                onChange={handleInputChange}
                maxLength={3}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack} disabled={isProcessing}>
          Back
        </Button>
        <Button 
          onClick={handleSubmit}
          className="bg-nutrition-primary text-white hover:bg-nutrition-primary/90"
          disabled={isProcessing || 
            !paymentDetails.cardNumber || 
            !paymentDetails.cardName || 
            !paymentDetails.expiry || 
            !paymentDetails.cvv}
        >
          {isProcessing ? "Processing..." : "Complete Payment"}
        </Button>
      </div>
    </div>
  );
};

export default PaymentSection;
