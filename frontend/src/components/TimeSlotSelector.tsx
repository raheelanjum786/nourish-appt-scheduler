import React from "react";
import { Button } from "./ui/button";

interface TimeSlot {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "AVAILABLE" | "BOOKED";
  service?: string;
  appointment?: string;
}

interface TimeSlotSelectorProps {
  timeSlots: TimeSlot[];
  onSelect: (timeSlot: TimeSlot) => void;
}

const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({
  timeSlots,
  onSelect,
}) => {
  if (timeSlots.length === 0) {
    return (
      <div className="text-center py-4">
        No available time slots for this date.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
      {timeSlots.map((slot) => (
        <Button
          key={slot._id}
          variant="outline"
          className={`p-3 text-center ${
            slot.status === "BOOKED"
              ? "bg-gray-200 cursor-not-allowed"
              : "hover:bg-primary/10"
          }`}
          onClick={() => slot.status === "AVAILABLE" && onSelect(slot)}
          disabled={slot.status === "BOOKED"}
        >
          {slot.startTime} - {slot.endTime}
          {slot.status === "BOOKED" && (
            <span className="block text-xs text-red-500 mt-1">Booked</span>
          )}
        </Button>
      ))}
    </div>
  );
};

export default TimeSlotSelector;
