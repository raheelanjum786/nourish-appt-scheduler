import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ServiceType {
  _id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
}

interface InvoiceDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onBack: () => void;
  service: ServiceType | null;
  consultationType: string;
  date: string;
  timeSlot: { startTime: string; endTime: string } | null;
  userInfo: { name: string; email: string; phone: string } | null;
}

export default function InvoiceDetailsModal({
  isOpen,
  onClose,
  onNext,
  onBack,
  service,
  consultationType,
  date,
  timeSlot,
  // plan,
  userInfo,
}: InvoiceDetailsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Appointment Summary</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 my-4">
          {service && (
            <>
              <div className="border-b pb-2">
                <h3 className="font-semibold">Service Details</h3>
                <p>{service.name}</p>
                <p>
                  ${service.price} for {service.duration} minutes
                </p>
              </div>
              <div className="border-b pb-2">
                <h3 className="font-semibold">Appointment Time</h3>
                <p>{new Date(date).toLocaleDateString()}</p>
                <p>
                  {timeSlot?.startTime} - {timeSlot?.endTime}
                </p>
                <p>{consultationType}</p>
              </div>
              {userInfo && (
                <div>
                  <h3 className="font-semibold">Your Information</h3>
                  <p>{userInfo.name}</p>
                  <p>{userInfo.email}</p>
                  <p>{userInfo.phone}</p>
                </div>
              )}
            </>
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
