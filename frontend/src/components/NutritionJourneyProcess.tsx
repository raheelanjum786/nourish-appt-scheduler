import React from "react";

const NutritionJourneyProcess: React.FC = () => {
  return (
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
              <div className="flex gap-4">
                <div className="bg-nutrition-primary text-white h-8 w-8 rounded-full flex items-center justify-center shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Personalized Plan Development
                  </h3>
                  <p className="text-gray-600">
                    Based on our consultation, we'll craft a tailored
                    nutrition plan designed to meet your unique needs and
                    preferences.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-nutrition-primary text-white h-8 w-8 rounded-full flex items-center justify-center shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Ongoing Support & Adjustments
                  </h3>
                  <p className="text-gray-600">
                    We'll provide continuous support, track your progress,
                    and make necessary adjustments to ensure your success
                    on your nutrition journey.
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
  );
};

export default NutritionJourneyProcess;