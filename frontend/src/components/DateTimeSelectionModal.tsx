import React from "react";
import { Button } from "@/components/ui/button";
import TimeSlotSelector from "@/components/TimeSlotSelector";

interface TimeSlot {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "AVAILABLE" | "BOOKED";
  service?: string;
  appointment?: string;
}

interface DateTimeSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  availableTimeSlots: TimeSlot[];
  handleTimeSlotSelect: (timeSlot: TimeSlot) => void;
  onBack: () => void;
}

const DateTimeSelectionModal: React.FC<DateTimeSelectionModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  setSelectedDate,
  availableTimeSlots,
  handleTimeSlotSelect,
  onBack,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-semibold mb-4">Select Date & Time</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Select Date
          </label>
          <input
            type="date"
            className="w-full p-2 border rounded"
            onChange={(e) => setSelectedDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            value={selectedDate}
          />
        </div>

        {selectedDate && (
          <>
            <p className="mb-4">Available time slots for {selectedDate}:</p>

            <TimeSlotSelector
              timeSlots={availableTimeSlots}
              onSelect={handleTimeSlotSelect}
            />
          </>
        )}

        <div className="mt-6 flex justify-between">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
};

export default DateTimeSelectionModal;
