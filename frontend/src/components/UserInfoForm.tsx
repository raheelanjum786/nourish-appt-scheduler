import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Import Select components

interface UserInfoFormProps {
  onNext: (userInfo: UserInfo) => void;
  onBack: () => void;
  serviceName: string;
}

export interface UserInfo {
  name: string;
  age: string;
  email: string;
  phone: string;
  purpose: string;
  additionalServices: string[];
}

const additionalServiceOptions = [
  { id: "nutrition-counseling", label: "Nutrition Counseling" },
  { id: "meal-planning", label: "Meal Planning" },
  { id: "specialized-diets", label: "Specialized Diets" },
  { id: "weight-management", label: "Weight Management" },
];

const UserInfoForm = ({ onNext, onBack, serviceName }: UserInfoFormProps) => {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "",
    age: "", // Keep age as string to handle dropdown value
    email: "",
    phone: "",
    purpose: "",
    additionalServices: [],
  });

  const [errors, setErrors] = useState<Partial<UserInfo>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name as keyof UserInfo]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleServiceToggle = (serviceId: string) => {
    setUserInfo((prev) => {
      const isSelected = prev.additionalServices.includes(serviceId);
      return {
        ...prev,
        additionalServices: isSelected
          ? prev.additionalServices.filter((id) => id !== serviceId)
          : [...prev.additionalServices, serviceId],
      };
    });
  };

  const handleAgeChange = (value: string) => {
    // New handler for age select
    setUserInfo((prev) => ({ ...prev, age: value }));
    if (errors.age) {
      setErrors((prev) => ({ ...prev, age: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<UserInfo> = {};

    if (!userInfo.name.trim()) newErrors.name = "Name is required";
    if (!userInfo.age.trim()) newErrors.age = "Age is required"; // Validation remains
    if (!userInfo.email.trim()) newErrors.email = "Email is required";
    else if (!/S+@S+.S+/.test(userInfo.email))
      newErrors.email = "Email is invalid";
    if (!userInfo.phone.trim()) newErrors.phone = "Phone number is required";
    if (!userInfo.purpose.trim()) newErrors.purpose = "Purpose is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onNext(userInfo);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-center">Personal Information</h3>
      <p className="text-sm text-gray-500 text-center">
        Please provide your details for the {serviceName} appointment
      </p>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              value={userInfo.name}
              onChange={handleInputChange}
              placeholder="John Doe"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Select onValueChange={handleAgeChange} value={userInfo.age}>
              {" "}
              {/* Replace Input with Select */}
              <SelectTrigger
                id="age"
                className={errors.age ? "border-red-500" : ""}
              >
                {" "}
                {/* Add error class */}
                <SelectValue placeholder="Select age range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-10">0-10</SelectItem>
                <SelectItem value="10-20">10-20</SelectItem>
                <SelectItem value="20-30">20-30</SelectItem>
                <SelectItem value="30-40">30-40</SelectItem>
                <SelectItem value="40-50">40-50</SelectItem>
                <SelectItem value="50+">50+</SelectItem>
              </SelectContent>
            </Select>
            {errors.age && <p className="text-xs text-red-500">{errors.age}</p>}{" "}
            {/* Keep error display */}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={userInfo.email}
              onChange={handleInputChange}
              placeholder="john@example.com"
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              value={userInfo.phone}
              onChange={handleInputChange}
              placeholder="(123) 456-7890"
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && (
              <p className="text-xs text-red-500">{errors.phone}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="purpose">Purpose of Appointment</Label>
          <Textarea
            id="purpose"
            name="purpose"
            value={userInfo.purpose}
            onChange={handleInputChange}
            placeholder="Please describe what you would like to discuss during your appointment..."
            rows={3}
            className={errors.purpose ? "border-red-500" : ""}
          />
          {errors.purpose && (
            <p className="text-xs text-red-500">{errors.purpose}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Additional Services (Optional)</Label>
          <p className="text-xs text-gray-500">
            Select if you would like to discuss any additional services during
            your consultation
          </p>

          <div className="grid grid-cols-2 gap-2 pt-2">
            {additionalServiceOptions.map((service) => (
              <div key={service.id} className="flex items-center space-x-2">
                <Checkbox
                  id={service.id}
                  checked={userInfo.additionalServices.includes(service.id)}
                  onCheckedChange={() => handleServiceToggle(service.id)}
                />
                <Label htmlFor={service.id} className="text-sm cursor-pointer">
                  {service.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          className="bg-nutrition-primary text-white hover:bg-nutrition-primary/90"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default UserInfoForm;
