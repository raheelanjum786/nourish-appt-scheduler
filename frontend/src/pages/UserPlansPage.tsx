import React, { useEffect, useState } from "react";
import { getUserPlans } from "../services/planService";
import { createPlanOrder } from "../services/planOrderService";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import PlanDetailsModal from "@/components/PlanDetailsModal";
import PlanUserInfoModal from "@/components/PlanUserInfoModal";
import PlanInvoiceDetailsModal from "@/components/PlanInvoiceDetailsModal";
import PlanPaymentModal from "@/components/PlanPaymentModal";
import { useToast } from "@/components/ui/use-toast";
import { UserInfo } from "@/components/UserInfoForm";

interface Plan {
  _id: string;
  name: string;
  description: string;
  durationDays: number;
  price: number;
  image?: string;
}

const UserPlansPage: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await getUserPlans();
        setPlans(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handlePlanClick = (plan: Plan) => {
    if (!user || !user._id) {
      toast({
        title: "Login Required",
        description: "You must be logged in to order a plan.",
        variant: "destructive",
      });
      return;
    }
    setSelectedPlan(plan);
    setCurrentStep(1);
  };

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleCloseModals = () => {
    setCurrentStep(0);
    setSelectedPlan(null);
    setUserInfo(null);
    setOrderId(null);
  };

  const handleUserInfoSubmit = (info: UserInfo) => {
    setUserInfo(info);
    handleNextStep();
  };

  const handleInvoiceConfirm = async () => {
    if (!selectedPlan || !user || !user._id) {
      toast({
        title: "Error",
        description: "Missing plan or user information.",
        variant: "destructive",
      });
      return;
    }

    try {
      const orderData = {
        planId: selectedPlan._id,
        userId: user._id,
        userInfo: userInfo, // Uncomment if you need to pass collected user info
      };

      const response = await createPlanOrder(orderData);
      setOrderId(response._id);
      toast({
        title: "Order Created",
        description: "Plan order initiated. Proceeding to payment.",
      });
      handleNextStep();
    } catch (err: any) {
      console.error("Error creating plan order:", err);
      toast({
        title: "Error",
        description:
          err.response?.data?.message || "Failed to create plan order.",
        variant: "destructive",
      });

      handleCloseModals();
    }
  };

  const handlePaymentSuccess = () => {
    toast({
      title: "Payment Successful",
      description: "Your plan has been ordered!",
    });
    handleCloseModals();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="py-8 md:py-12 bg-nutrition-primary/10">
          <div className="container-custom">
            <h1 className="heading-primary text-center mb-6">Our Plans</h1>
            <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
              Explore our comprehensive nutrition plans designed for long-term
              health and wellness.
            </p>
          </div>
        </div>

        <section className="section-padding bg-white">
          <div className="container-custom">
            <h2 className="heading-secondary text-center mb-10">
              Available Plans
            </h2>
            {loading && (
              <p className="text-center text-gray-500">Loading plans...</p>
            )}
            {error && (
              <p className="text-center text-red-500">
                Error loading plans: {error}
              </p>
            )}
            {!loading && !error && plans.length === 0 && (
              <p className="text-center text-gray-500">
                No plans available at the moment.
              </p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {!loading &&
                !error &&
                plans.map((plan) => (
                  <Card
                    key={plan._id}
                    className="overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="h-48 overflow-hidden">
                      <img
                        src={
                          plan.image ||
                          "https://via.placeholder.com/400x200?text=Plan+Image"
                        }
                        alt={plan.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle>{plan.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-600">
                        {plan.description}
                      </CardDescription>
                      <div className="mt-2">
                        <p className="text-sm font-medium">
                          Duration: {plan.durationDays} days
                        </p>
                        <p className="text-sm font-medium">
                          Price: ${plan.price.toFixed(2)}
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full btn-primary"
                        onClick={() => handlePlanClick(plan)}
                      >
                        Order Plan
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <PlanDetailsModal
        isOpen={currentStep === 1}
        onClose={handleCloseModals}
        onNext={handleNextStep}
        plan={selectedPlan}
      />

      <PlanUserInfoModal
        isOpen={currentStep === 2}
        onClose={handleCloseModals}
        onNext={handleUserInfoSubmit}
        onBack={handleBack}
        initialUserInfo={
          user ? { name: user.name, email: user.email } : undefined
        }
      />

      <PlanInvoiceDetailsModal
        isOpen={currentStep === 3}
        onClose={handleCloseModals}
        onNext={handleInvoiceConfirm}
        onBack={handleBack}
        plan={selectedPlan}
        userInfo={
          userInfo ||
          (user
            ? { name: user.name, email: user.email, phone: user.phone }
            : null)
        }
      />

      <PlanPaymentModal
        isOpen={currentStep === 4}
        onClose={handleCloseModals}
        onPaymentSuccess={handlePaymentSuccess}
        onBack={handleBack}
        amount={selectedPlan?.price || 0}
        description={`Order for ${selectedPlan?.name || "plan"}`}
        orderId={orderId}
      />
    </div>
  );
};

export default UserPlansPage;
