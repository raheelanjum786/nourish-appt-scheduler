import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import ServicesComponent from "@/components/ServicesComponent";
const ServicesPage = () => {
  // // const handleAppointmentSubmit = async () => {
  // //   if (!selectedService || !selectedDate || !selectedTimeSlot || !userInfo) {
  // //     toast({
  // //       title: "Error",
  // //       description: "Please fill in all appointment details",
  // //       variant: "destructive",
  // //     });
  // //     return;
  // //   }

  // //   try {
  // //     const response = await api.post("/api/appointments", {
  // //       serviceId: selectedService._id,
  // //       date: selectedDate,
  // //       startTime: selectedTimeSlot.startTime,
  // //       endTime: selectedTimeSlot.endTime,
  // //       timeSlotId: selectedTimeSlotId,
  // //       consultationType: selectedConsultationType,
  // //       name: userInfo.name,
  // //       email: userInfo.email,
  // //       phone: userInfo.phone,
  // //     });

  // //     toast({
  // //       title: "Success",
  // //       description: "Appointment booked successfully!",
  // //     });

  // //     setCurrentStep(6);
  // //     setAppointmentDetails(response.data);
  // //   } catch (error: any) {
  // //     console.error("Error booking appointment:", error);
  // //     toast({
  // //       title: "Error",
  // //       description:
  // //         error.response?.data?.message || "Failed to book appointment",
  // //       variant: "destructive",
  // //     });
  // //   }
  // // };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="py-8 md:py-12 bg-nutrition-primary/10">
          <div className="container-custom">
            <h1 className="heading-primary text-center mb-6">Our Services</h1>
            <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
              Discover our range of personalized nutrition services designed to
              help you achieve your health and wellness goals.
            </p>
          </div>
        </div>
        <ServicesComponent />
        <section className="section-padding bg-nutrition-green/10">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="heading-secondary mb-6">
                  The Nutrition Journey Process
                </h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="bg-nutrition-primary text-white h-8 w-8 rounded-full flex items-center justify-center shrink-0">
                      1
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        Initial Consultation
                      </h3>
                      <p className="text-gray-600">
                        We'll discuss your health history, goals, and lifestyle
                        to create a foundation for your personalized plan.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-64 h-64 bg-nutrition-peach/30 rounded-full z-0"></div>
                <img
                  src="https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Nutrition consultation process"
                  className="rounded-lg shadow-lg relative z-10"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ServicesPage;
