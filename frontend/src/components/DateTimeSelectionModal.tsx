import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";

interface DateTimeSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNext: (
    date: string,
    timeSlot: { startTime: string; endTime: string }
  ) => void;
  onBack: () => void;
  serviceId: string;
}

export default function DateTimeSelectionModal({
  isOpen,
  onClose,
  onNext,
  onBack,
  serviceId,
}: DateTimeSelectionModalProps) {
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");

  // In a real app, you would fetch available slots based on serviceId
  const availableTimeSlots = [
    { startTime: "09:00", endTime: "09:30" },
    { startTime: "10:00", endTime: "10:30" },
    { startTime: "11:00", endTime: "11:30" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Date and Time</DialogTitle>
          <DialogDescription>
            Choose a date and available time slot for your appointment.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 my-4">
          <div>
            <label className="block mb-2 text-sm font-medium">Date</label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Time Slot</label>
            <div className="space-y-2">
              {availableTimeSlots.map((slot, index) => (
                <Button
                  key={index}
                  variant={timeSlot === slot.startTime ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setTimeSlot(slot.startTime)}
                >
                  {slot.startTime} - {slot.endTime}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-between gap-2">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button
            onClick={() =>
              onNext(date, {
                startTime: timeSlot,
                endTime:
                  availableTimeSlots.find((s) => s.startTime === timeSlot)
                    ?.endTime || "",
              })
            }
            disabled={!date || !timeSlot}
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
