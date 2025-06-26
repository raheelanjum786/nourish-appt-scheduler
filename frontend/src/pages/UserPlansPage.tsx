import React, { useEffect, useState } from "react";
import { getPlans } from "../services/planService";
import {
  createPlanOrder,
  getUserPlanOrders,
} from "../services/planOrderService";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface Plan {
  _id: string;
  name: string;
  description: string;
  durationDays: number;
  price: number;
  image?: string;
}

interface PlanOrder {
  _id: string;
  plan: Plan;
  orderDate: string;
  startDate: string;
  endDate: string;
  status: "active" | "expired" | "cancelled";
}

const UserPlansPage: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [userPlanOrders, setUserPlanOrders] = useState<PlanOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await getPlans();
        setPlans(data.data?.plans || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  useEffect(() => {
    const fetchUserPlanOrders = async () => {
      if (!user || !user._id) return;

      try {
        setOrdersLoading(true);
        const data = await getUserPlanOrders(user._id);
        setUserPlanOrders(data);
      } catch (err: any) {
        setOrdersError(err.message);
        console.error("Error fetching user plan orders:", err);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchUserPlanOrders();
  }, [user]);

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
        userInfo: userInfo,
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

    if (user && user._id) {
      getUserPlanOrders(user._id)
        .then((data) => setUserPlanOrders(data))
        .catch((err) => console.error("Error refreshing plan orders:", err));
    }

    handleCloseModals();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "expired":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="py-8 md:py-12 bg-nutrition-primary/10">
          <div className="container-custom">
            <h1 className="heading-primary text-center mb-6">
              Nutrition Plans
            </h1>
            <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
              Explore our comprehensive nutrition plans designed for long-term
              health and wellness.
            </p>
          </div>
        </div>

        <Tabs defaultValue="available" className="container-custom mt-8">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="available">Available Plans</TabsTrigger>
            <TabsTrigger value="myplans">My Plans</TabsTrigger>
          </TabsList>

          <TabsContent value="available">
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
          </TabsContent>

          <TabsContent value="myplans">
            <section className="section-padding bg-white">
              <div className="container-custom">
                <h2 className="heading-secondary text-center mb-10">
                  My Plan Orders
                </h2>
                {ordersLoading && (
                  <p className="text-center text-gray-500">
                    Loading your plans...
                  </p>
                )}
                {ordersError && (
                  <p className="text-center text-red-500">
                    Error loading your plans: {ordersError}
                  </p>
                )}
                {!ordersLoading &&
                  !ordersError &&
                  userPlanOrders.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      <p>You haven't ordered any plans yet.</p>
                      <Button
                        className="mt-4 btn-primary"
                        onClick={() =>
                          document
                            .querySelector('[data-value="available"]')
                            ?.click()
                        }
                      >
                        Browse Available Plans
                      </Button>
                    </div>
                  )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {!ordersLoading &&
                    !ordersError &&
                    userPlanOrders.map((order) => (
                      <Card
                        key={order._id}
                        className="overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        <div className="h-48 overflow-hidden">
                          <img
                            src={
                              order.plan.image ||
                              "https://via.placeholder.com/400x200?text=Plan+Image"
                            }
                            alt={order.plan.name}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          />
                        </div>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <CardTitle>{order.plan.name}</CardTitle>
                            <Badge
                              className={getStatusBadgeColor(order.status)}
                            >
                              {order.status.charAt(0).toUpperCase() +
                                order.status.slice(1)}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-gray-600 mb-4">
                            {order.plan.description}
                          </CardDescription>
                          <div className="space-y-1 text-sm">
                            <p>
                              <span className="font-medium">Order Date:</span>{" "}
                              {formatDate(order.orderDate)}
                            </p>
                            <p>
                              <span className="font-medium">Start Date:</span>{" "}
                              {formatDate(order.startDate)}
                            </p>
                            <p>
                              <span className="font-medium">End Date:</span>{" "}
                              {formatDate(order.endDate)}
                            </p>
                            <p className="font-medium mt-2">
                              Price: ${order.plan.price.toFixed(2)}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            </section>
          </TabsContent>
        </Tabs>
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
