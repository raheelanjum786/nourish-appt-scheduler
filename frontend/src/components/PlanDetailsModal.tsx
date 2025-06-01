import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Plan {
  _id: string;
  name: string;
  description: string;
  durationDays: number;
  price: number;
  image?: string;
}

interface PlanDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  plan: Plan | null;
}

const PlanDetailsModal: React.FC<PlanDetailsModalProps> = ({
  isOpen,
  onClose,
  onNext,
  plan,
}) => {
  if (!plan) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{plan.name}</DialogTitle>
          <DialogDescription>
            Review the details of the selected plan.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {plan.image && (
            <img
              src={plan.image}
              alt={plan.name}
              className="w-full h-48 object-cover rounded-md"
            />
          )}
          <p className="text-sm text-gray-700">{plan.description}</p>
          <div className="mt-2 space-y-1">
            <p className="text-sm font-medium">
              Duration: {plan.durationDays} days
            </p>
            <p className="text-sm font-medium">
              Price: ${plan.price.toFixed(2)}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onNext}>Proceed to Order</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PlanDetailsModal;
