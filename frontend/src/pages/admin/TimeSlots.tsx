import React, { useState, useEffect } from "react";
import {
  getAllTimeSlots,
  bookTimeSlot,
  releaseTimeSlot,
} from "../../services/timeSlotService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

// Add this import
import TimeSlotGenerator from "@/components/admin/TimeSlotGenerator";

interface TimeSlot {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "AVAILABLE" | "BOOKED";
  service?: { _id: string; name: string } | string;
  appointment?: { _id: string; user: { name: string } } | string;
  createdAt: string;
  updatedAt: string;
}

const TimeSlots = () => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    date: "",
    status: "",
    service: "",
  });

  useEffect(() => {
    fetchTimeSlots();
  }, []);

  const fetchTimeSlots = async () => {
    try {
      setLoading(true);
      const data = await getAllTimeSlots(filters);
      setTimeSlots(data);
    } catch (error) {
      console.error("Error fetching time slots:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    fetchTimeSlots();
  };

  const handleReleaseTimeSlot = async (id: string) => {
    if (window.confirm("Are you sure you want to release this time slot?")) {
      try {
        await releaseTimeSlot(id);
        fetchTimeSlots();
      } catch (error) {
        console.error("Error releasing time slot:", error);
      }
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Manage Time Slots</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <div className="mb-8">
          <TimeSlotGenerator />
        </div>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-2">Date</label>
              <Input
                type="date"
                value={filters.date}
                onChange={(e) => handleFilterChange("date", e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-2">Status</label>
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All</SelectItem>
                  <SelectItem value="AVAILABLE">Available</SelectItem>
                  <SelectItem value="BOOKED">Booked</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={handleApplyFilters}>Apply Filters</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {timeSlots.length > 0 ? (
            timeSlots.map((slot) => (
              <Card
                key={slot._id}
                className={`${
                  slot.status === "BOOKED"
                    ? "border-red-300"
                    : "border-green-300"
                }`}
              >
                <CardHeader>
                  <CardTitle className="flex justify-between">
                    <span>{format(new Date(slot.date), "MMM dd, yyyy")}</span>
                    <span
                      className={`text-sm px-2 py-1 rounded ${
                        slot.status === "BOOKED"
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {slot.status}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold">
                    {slot.startTime} - {slot.endTime}
                  </p>

                  {typeof slot.service === "object" && slot.service && (
                    <p className="mt-2">Service: {slot.service.name}</p>
                  )}

                  {slot.status === "BOOKED" &&
                    typeof slot.appointment === "object" &&
                    slot.appointment && (
                      <p className="mt-2">
                        Booked by: {slot.appointment.user?.name || "Unknown"}
                      </p>
                    )}

                  <div className="mt-4">
                    {slot.status === "BOOKED" && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleReleaseTimeSlot(slot._id)}
                      >
                        Release Slot
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              No time slots found.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TimeSlots;
