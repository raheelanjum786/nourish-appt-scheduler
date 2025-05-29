import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { UserInfo } from "./UserInfoForm";

interface AppointmentSummaryProps {
  userInfo: UserInfo;
  appointmentDate: Date;
  appointmentTime: string;
  serviceName: string;
  appointmentType: string;
  onConfirm: () => void;
  onBack: () => void;
}

const AppointmentSummary = ({
  userInfo,
  appointmentDate,
  appointmentTime,
  serviceName,
  appointmentType,
  onConfirm,
  onBack,
}: AppointmentSummaryProps) => {
  const additionalServiceNames: Record<string, string> = {
    "nutrition-counseling": "Nutrition Counseling",
    "meal-planning": "Meal Planning",
    "specialized-diets": "Specialized Diets",
    "weight-management": "Weight Management",
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-center">Appointment Summary</h3>

      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h4 className="font-medium text-nutrition-primary mb-2">
            Service Details
          </h4>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <span className="text-gray-500">Service:</span>
            <span>{serviceName}</span>

            <span className="text-gray-500">Appointment Type:</span>
            <span>{appointmentType}</span>

            <span className="text-gray-500">Date:</span>
            <span>{format(appointmentDate, "EEEE, MMMM do, yyyy")}</span>

            <span className="text-gray-500">Time:</span>
            <span>{appointmentTime}</span>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border">
          <h4 className="font-medium text-nutrition-primary mb-2">
            Personal Details
          </h4>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <span className="text-gray-500">Name:</span>
            <span>{userInfo.name}</span>

            <span className="text-gray-500">Age:</span>
            <span>{userInfo.age}</span>

            <span className="text-gray-500">Email:</span>
            <span>{userInfo.email}</span>

            <span className="text-gray-500">Phone:</span>
            <span>{userInfo.phone}</span>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border">
          <h4 className="font-medium text-nutrition-primary mb-2">
            Appointment Purpose
          </h4>
          <p className="text-sm">{userInfo.purpose}</p>
        </div>

        {userInfo.additionalServices.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h4 className="font-medium text-nutrition-primary mb-2">
              Additional Services
            </h4>
            <ul className="list-disc list-inside text-sm">
              {userInfo.additionalServices.map((serviceId) => (
                <li key={serviceId}>{additionalServiceNames[serviceId]}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-nutrition-primary/5 p-4 rounded-lg border border-nutrition-primary/20">
          <h4 className="font-medium text-nutrition-primary mb-2">Payment</h4>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <span className="text-gray-500">Consultation Fee:</span>
            <span className="font-medium">$75.00</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={onConfirm}
          className="bg-nutrition-primary text-white hover:bg-nutrition-primary/90"
        >
          Confirm & Proceed to Payment
        </Button>
      </div>
    </div>
  );
};

export default AppointmentSummary;
