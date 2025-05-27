
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Weight Management Client",
    quote: "Working with Dr. Claire completely changed my relationship with food. Her personalized approach helped me lose 20 pounds and maintain it for over a year!",
    image: "https://randomuser.me/api/portraits/women/32.jpg",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Dietary Management Client",
    quote: "After being diagnosed with celiac disease, I was lost about what to eat. The dietary plan Dr. Claire created was life-changing and delicious!",
    image: "https://randomuser.me/api/portraits/men/46.jpg",
  },
  {
    id: 3,
    name: "Emma Williams",
    role: "Body Contouring Client",
    quote: "The nutrition plan perfectly complemented my workout routine. I've seen amazing results in just 3 months - both in how I look and how I feel.",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
  },
];

const Testimonials = () => {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="heading-secondary mb-4">What My Clients Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Real stories from real clients who have transformed their health and lifestyles with our nutritional guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-white shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600 italic mb-4">"{testimonial.quote}"</p>
                    <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                    <p className="text-sm text-nutrition-primary">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
