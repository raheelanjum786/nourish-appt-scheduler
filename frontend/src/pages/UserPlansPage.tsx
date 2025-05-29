import React, { useEffect, useState } from 'react';
import { getUserPlans } from '../services/planService';
import { createPlanOrder } from '../services/planOrderService';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

interface Plan {
  _id: string;
  name: string;
  description: string;
  durationDays: number;
  price: number;
}

const UserPlansPage: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

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

  const handleOrderPlan = async (planId: string) => {
    if (!user || !user._id) {
      alert('You must be logged in to order a plan.');
      return;
    }
    const userId = user._id;

    try {
      await createPlanOrder({ planId, userId });
      alert('Plan ordered successfully!');
      // Optionally, redirect the user to their plan orders page or update the UI
    } catch (err: any) {
      console.error('Error ordering plan:', err);
      alert(`Failed to order plan: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="py-8 md:py-12 bg-nutrition-primary/10">
          <div className="container-custom">
            <h1 className="heading-primary text-center mb-6">Our Plans</h1>
            <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
              Explore our comprehensive nutrition plans designed for long-term health and wellness.
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
                    {/* Add plan image if available */}
                    {/* <div className="h-48 overflow-hidden">
                      <img
                        src={plan.image || "https://via.placeholder.com/400x200?text=Plan+Image"}
                        alt={plan.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div> */}
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
                        onClick={() => handleOrderPlan(plan._id)}
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
    </div>
  );
};

export default UserPlansPage;