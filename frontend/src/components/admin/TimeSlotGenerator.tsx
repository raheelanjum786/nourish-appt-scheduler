import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import api from "@/services/api";
import { format, addDays } from "date-fns";

interface Service {
  _id: string;
  name: string;
  duration: number;
}

const TimeSlotGenerator: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<string>("");
  const [startDate, setStartDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd")
  );
  const [endDate, setEndDate] = useState<string>(
    format(addDays(new Date(), 7), "yyyy-MM-dd")
  );
  const [startTime, setStartTime] = useState<string>("09:00");
  const [endTime, setEndTime] = useState<string>("17:00");
  const [loading, setLoading] = useState<boolean>(false);
  const [generationType, setGenerationType] = useState<"single" | "all">(
    "single"
  );

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await api.services.getAll();
      setServices(response.filter((service: any) => service.isActive));
    } catch (error) {
      console.error("Error fetching services:", error);
      toast({
        title: "Error",
        description: "Failed to fetch services",
        variant: "destructive",
      });
    }
  };

  const handleGenerateTimeSlots = async () => {
    try {
      setLoading(true);

      if (generationType === "single" && !selectedService) {
        toast({
          title: "Error",
          description: "Please select a service",
          variant: "destructive",
        });
        return;
      }

      if (!startDate) {
        toast({
          title: "Error",
          description: "Please select a start date",
          variant: "destructive",
        });
        return;
      }

      if (generationType === "all" && !endDate) {
        toast({
          title: "Error",
          description: "Please select an end date",
          variant: "destructive",
        });
        return;
      }

      const endpoint =
        generationType === "single"
          ? "/time-slots/generate"
          : "/time-slots/generate-all";
      const payload =
        generationType === "single"
          ? { serviceId: selectedService, date: startDate, startTime, endTime }
          : { startDate, endDate, startTime, endTime };

      const response = await api.post(endpoint, payload);

      toast({
        title: "Success",
        description: response.data.message,
      });
    } catch (error: any) {
      console.error("Error generating time slots:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to generate time slots",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Time Slots</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label>Generation Type</Label>
              <Select
                value={generationType}
                onValueChange={(value: "single" | "all") =>
                  setGenerationType(value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select generation type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single Service</SelectItem>
                  <SelectItem value="all">All Services</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {generationType === "single" && (
              <div className="space-y-2">
                <Label>Service</Label>
                <Select
                  value={selectedService}
                  onValueChange={setSelectedService}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service._id} value={service._id}>
                        {service.name} ({service.duration} min)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={format(new Date(), "yyyy-MM-dd")}
                />
              </div>

              {generationType === "all" && (
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Working Hours Start</Label>
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Working Hours End</Label>
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>

            <Button
              onClick={handleGenerateTimeSlots}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Generating..." : "Generate Time Slots"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeSlotGenerator;
