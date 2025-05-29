import { Button } from "@/components/ui/button";

const About = () => {
  return (
    <section className="section-padding bg-nutrition-green/20">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="md:w-2/5">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-64 h-64 rounded-full bg-nutrition-peach/30 z-0"></div>
              <img
                src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Dr. Claire Bennett"
                className="rounded-lg shadow-lg relative z-10"
              />
            </div>
          </div>

          <div className="md:w-3/5">
            <h2 className="heading-secondary mb-4">About Dr. Claire Bennett</h2>
            <p className="text-gray-600 mb-4">
              With over 10 years of experience in nutrition and dietetics, I am
              dedicated to helping my clients achieve their health goals through
              personalized nutrition plans and ongoing support.
            </p>
            <p className="text-gray-600 mb-6">
              My approach combines evidence-based nutritional science with
              practical, sustainable lifestyle changes. I believe that good
              nutrition should be enjoyable, not restrictive, and I work closely
              with each client to create plans that fit their unique needs and
              preferences.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-nutrition-primary">
                  Education
                </h4>
                <p className="text-gray-600 text-sm">
                  Ph.D. in Nutritional Sciences
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-nutrition-primary">
                  Experience
                </h4>
                <p className="text-gray-600 text-sm">
                  10+ Years of Clinical Practice
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-nutrition-primary">
                  Clients
                </h4>
                <p className="text-gray-600 text-sm">1,000+ Success Stories</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-nutrition-primary">
                  Specialties
                </h4>
                <p className="text-gray-600 text-sm">
                  Weight Management, Medical Nutrition
                </p>
              </div>
            </div>
            <Button className="btn-primary">Learn More About Me</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
