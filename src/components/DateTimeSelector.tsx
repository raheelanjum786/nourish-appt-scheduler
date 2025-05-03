
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

interface DateTimeSelectorProps {
  onNext: (selectedDate: Date, selectedTime: string) => void;
  onBack: () => void;
}

const availableTimes = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", 
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30"
];

const DateTimeSelector = ({ onNext, onBack }: DateTimeSelectorProps) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleNext = () => {
    if (date && selectedTime) {
      onNext(date, selectedTime);
    }
  };

  // Disable past dates and weekends
  const disabledDays = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Disable past dates
    if (date < today) {
      return true;
    }
    
    // Disable weekends (0 is Sunday, 6 is Saturday)
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-center">Select Date</h3>
        <div className="flex justify-center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            disabled={disabledDays}
            className="rounded-md border pointer-events-auto"
          />
        </div>
      </div>

      {date && (
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-center">
            Available Times for {date ? format(date, "EEEE, MMMM do") : ""}
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {availableTimes.map((time) => (
              <Button
                key={time}
                variant={selectedTime === time ? "default" : "outline"}
                className={`${
                  selectedTime === time ? "bg-nutrition-primary text-white" : ""
                }`}
                onClick={() => setSelectedTime(time)}
              >
                {time}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!date || !selectedTime}
          className="bg-nutrition-primary text-white hover:bg-nutrition-primary/90"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default DateTimeSelector;
