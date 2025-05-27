import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface Service {
  _id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  image?: string;
  isActive: boolean;
}

interface ServiceCategory {
  _id: string;
  name: string;
  description: string;
  image: string;
}

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service?: Service;
  category?: ServiceCategory;
  getServicesByCategory?: (categoryId: string) => Promise<Service[]>;
}

const ServiceModal = ({
  isOpen,
  onClose,
  service,
  category,
  getServicesByCategory,
}: ServiceModalProps) => {
  const navigate = useNavigate();
  const [categoryServices, setCategoryServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category && getServicesByCategory && isOpen) {
      setLoading(true);
      getServicesByCategory(category._id)
        .then((services) => {
          setCategoryServices(services);
        })
        .catch((error) => {
          console.error("Error fetching services for category:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [category, getServicesByCategory, isOpen]);

  const handleBookAppointment = (serviceId: string) => {
    navigate(`/book-appointment?serviceId=${serviceId}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        {service ? (
          // Render individual service details
          <>
            <DialogHeader>
              <DialogTitle>{service.name}</DialogTitle>
              <DialogDescription>{service.description}</DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <div className="mb-4">
                <img
                  src={
                    service.image ||
                    "https://via.placeholder.com/400x200?text=Service+Image"
                  }
                  alt={service.name}
                  className="w-full h-48 object-cover rounded-md"
                />
              </div>
              <div className="space-y-2 mb-6">
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
                <Button onClick={() => handleBookAppointment(service._id)}>
                  Book Appointment
                </Button>
              </div>
            </div>
          </>
        ) : category ? (
          // Render category and its services
          <>
            <DialogHeader>
              <DialogTitle>{category.name}</DialogTitle>
              <DialogDescription>{category.description}</DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <div className="mb-4">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-48 object-cover rounded-md"
                />
              </div>

              {loading ? (
                <p className="text-center py-4">Loading services...</p>
              ) : categoryServices.length > 0 ? (
                <div className="space-y-4 my-4">
                  <h3 className="font-semibold text-lg">Available Services:</h3>
                  {categoryServices.map((service) => (
                    <div key={service._id} className="border p-3 rounded-md">
                      <h4 className="font-medium text-base">{service.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {service.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-sm">
                            {service.duration} min | ${service.price}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleBookAppointment(service._id)}
                          disabled={!service.isActive}
                        >
                          {service.isActive ? "Book" : "Unavailable"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4">
                  No services available for this category.
                </p>
              )}

              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
              </div>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default ServiceModal;
