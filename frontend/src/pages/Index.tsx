import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/ServicesComponent";
import Testimonials from "@/components/Testimonials";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ServicesComponent from "@/components/ServicesComponent";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main>
        <Hero />
        <ServicesComponent />
        <About />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
