import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic would go here
    console.log("Form submitted");
  };

  return (
    <section id="contact" className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="heading-secondary mb-4">Get In Touch</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have questions or ready to start your journey to better health?
            Reach out and I'll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 shadow-md">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Your Name
                    </label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      className="w-full"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      className="w-full"
                      required
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Subject
                  </label>
                  <Input
                    id="subject"
                    placeholder="How can I help you?"
                    className="w-full"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Message
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Your message here..."
                    className="w-full min-h-[150px]"
                    required
                  />
                </div>

                <Button type="submit" className="btn-primary w-full md:w-auto">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardContent className="pt-6">
              <div className="flex flex-col space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-nutrition-primary mb-1">
                    Office Hours
                  </h3>
                  <p className="text-gray-600">
                    Monday - Friday: 9:00 AM - 5:00 PM
                    <br />
                    Saturday: 10:00 AM - 2:00 PM
                    <br />
                    Sunday: Closed
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-nutrition-primary mb-1">
                    Clinic Location
                  </h3>
                  <p className="text-gray-600">
                    123 Nutrition Avenue
                    <br />
                    Healthytown, HT 12345
                    <br />
                    United States
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-nutrition-primary mb-1">
                    Contact Information
                  </h3>
                  <p className="text-gray-600">
                    {/* Email: contact@nutricare.com<br /> */}
                    Phone: (123) 456-7890
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;
