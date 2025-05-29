import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Service {
  _id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  image?: string;
  isActive: boolean;
}

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
  onNext: (service: Service) => void;
}

export default function ServiceModal({
  isOpen,
  onClose,
  service,
  onNext,
}: ServiceModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        {service && (
          <>
            <DialogHeader>
              <DialogTitle>{service.name}</DialogTitle>
              <DialogDescription>{service.description}</DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-4">
              <img
                src={service.image || "/placeholder-service.jpg"}
                alt={service.name}
                className="w-full h-48 object-cover rounded-md"
              />
              <div className="space-y-2">
                <p>
                  <span className="font-semibold">Duration:</span>{" "}
                  {service.duration} minutes
                </p>
                <p>
                  <span className="font-semibold">Price:</span> ${service.price}
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={() => onNext(service)}>
                  Book Appointment
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
