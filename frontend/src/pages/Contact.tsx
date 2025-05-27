import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";

const ContactPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="py-8 md:py-12 bg-nutrition-primary/10">
          <div className="container-custom">
            <h1 className="heading-primary text-center mb-6">Get in Touch</h1>
            <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
              Have questions or ready to start your journey to better nutrition?
              Reach out and I'll be happy to help.
            </p>
          </div>
        </div>
        <Contact />

        <section className="section-padding bg-nutrition-green/10">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="heading-secondary mb-6">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-nutrition-primary mb-2">
                      How long are the consultation sessions?
                    </h3>
                    <p className="text-gray-600">
                      Initial consultations are typically 60 minutes, while
                      follow-up sessions are 30-45 minutes depending on your
                      needs.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-nutrition-primary mb-2">
                      Do you accept insurance?
                    </h3>
                    <p className="text-gray-600">
                      I work with several major insurance providers. Please
                      contact my office with your insurance details to verify
                      coverage.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-nutrition-primary mb-2">
                      How many sessions will I need?
                    </h3>
                    <p className="text-gray-600">
                      This varies greatly by individual. After your initial
                      consultation, I'll recommend a personalized plan which
                      typically includes follow-up sessions to track progress.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-nutrition-primary mb-2">
                      Can you help with food allergies and sensitivities?
                    </h3>
                    <p className="text-gray-600">
                      Yes, I specialize in creating nutrition plans that
                      accommodate allergies, sensitivities, and dietary
                      restrictions.
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-32 h-32 bg-nutrition-peach rounded-full opacity-30 z-0"></div>
                <div className="absolute -bottom-4 -right-4 w-40 h-40 bg-nutrition-primary rounded-full opacity-20 z-0"></div>
                <img
                  src="https://images.unsplash.com/photo-1543362906-acfc16c67564?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Nutrition consultation"
                  className="rounded-lg shadow-lg relative z-10 w-full"
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

export default ContactPage;
