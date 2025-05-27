import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import About from "@/components/About";

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="py-8 md:py-12 bg-nutrition-primary/10">
          <div className="container-custom">
            <h1 className="heading-primary text-center mb-6">About Me</h1>
            <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
              Learn more about my journey, qualifications, and approach to
              nutrition and wellness.
            </p>
          </div>
        </div>
        <About />

        <section className="section-padding">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <h2 className="heading-secondary mb-4">My Approach</h2>
                <p className="text-gray-600 mb-4">
                  I believe in creating personalized nutrition plans that work
                  with your lifestyle, not against it. My evidence-based
                  approach combines the latest nutritional science with
                  practical, sustainable changes.
                </p>
                <p className="text-gray-600 mb-4">
                  Rather than focusing on restrictive diets or quick fixes, I
                  help my clients develop a healthy relationship with food that
                  supports their long-term health goals and overall wellbeing.
                </p>
              </div>
              <div>
                <h2 className="heading-secondary mb-4">My Philosophy</h2>
                <p className="text-gray-600 mb-4">
                  Nutrition shouldn't be complicated or stressful. I'm
                  passionate about demystifying nutrition and helping my clients
                  understand how food affects their bodies and minds.
                </p>
                <p className="text-gray-600 mb-4">
                  Every person's nutritional needs are unique, and there's no
                  one-size-fits-all approach to health. I work closely with each
                  client to develop customized plans that address their specific
                  concerns and goals.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="section-padding bg-nutrition-green/10">
          <div className="container-custom">
            <h2 className="heading-secondary text-center mb-10">
              My Credentials
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-nutrition-primary mb-2">
                  Education
                </h3>
                <ul className="text-gray-600 space-y-2">
                  <li>
                    Ph.D. in Nutritional Sciences, University of California
                  </li>
                  <li>Master's in Dietetics, Columbia University</li>
                  <li>Bachelor's in Food Science, Cornell University</li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-nutrition-primary mb-2">
                  Certifications
                </h3>
                <ul className="text-gray-600 space-y-2">
                  <li>Registered Dietitian Nutritionist (RDN)</li>
                  <li>Certified Diabetes Educator (CDE)</li>
                  <li>Board Certified in Sports Nutrition</li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-nutrition-primary mb-2">
                  Specializations
                </h3>
                <ul className="text-gray-600 space-y-2">
                  <li>Weight Management</li>
                  <li>Medical Nutrition Therapy</li>
                  <li>Sports Nutrition</li>
                  <li>Gut Health & Digestive Disorders</li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-nutrition-primary mb-2">
                  Experience
                </h3>
                <ul className="text-gray-600 space-y-2">
                  <li>10+ Years Clinical Practice</li>
                  <li>5 Years University Lecturer</li>
                  <li>Published Nutrition Researcher</li>
                  <li>Health & Wellness Speaker</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
