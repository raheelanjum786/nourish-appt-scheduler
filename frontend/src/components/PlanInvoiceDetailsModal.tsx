import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserInfo } from "@/components/UserInfoForm";

interface Plan {
  _id: string;
  name: string;
  description: string;
  durationDays: number;
  price: number;
  image?: string;
}

interface PlanInvoiceDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onBack: () => void;
  plan: Plan | null;
  userInfo: UserInfo | null;
}

export default function PlanInvoiceDetailsModal({
  isOpen,
  onClose,
  onNext,
  onBack,
  plan,
  userInfo,
}: PlanInvoiceDetailsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Plan Order Summary</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 my-4">
          {plan && (
            <div className="border-b pb-2">
              <h3 className="font-semibold">Plan Details</h3>
              <p>{plan.name}</p>
              <p>{plan.description}</p>
              <p>
                ${plan.price.toFixed(2)} for {plan.durationDays} days
              </p>
            </div>
          )}
          {userInfo && (
            <div>
              <h3 className="font-semibold">Your Information</h3>
              <p>{userInfo.name}</p>
              <p>{userInfo.email}</p>
              <p>{userInfo.phone}</p>
            </div>
          )}
        </div>
        <div className="flex justify-between gap-2">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={onNext}>Confirm & Pay</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}