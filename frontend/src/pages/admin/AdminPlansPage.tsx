import React, { useEffect, useState } from "react";
import {
  getPlans,
  createPlan,
  updatePlan,
  deletePlan,
} from "../../services/planService";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Trash2, Edit } from "lucide-react";

interface Plan {
  _id: string;
  name: string;
  description: string;
  durationDays: number;
  price: number;
}

const AdminPlansPage: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    durationDays: 0,
    price: 0,
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const data = await getPlans();
      // Fix: Ensure data is an array before setting it to state
      setPlans(Array.isArray(data) ? data : data.plans || []);
    } catch (error) {
      console.error("Error fetching plans:", error);
      setPlans([]); // Ensure plans is always an array even on error
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]:
        name === "durationDays" || name === "price" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updatePlan(editingId, form);
        setEditingId(null);
      } else {
        await createPlan(form);
      }
      setForm({ name: "", description: "", durationDays: 0, price: 0 });
      fetchPlans();
    } catch (error) {
      console.error("Error saving plan:", error);
      alert("Failed to save plan.");
    }
  };

  const handleEdit = (plan: Plan) => {
    setForm({
      name: plan.name,
      description: plan.description,
      durationDays: plan.durationDays,
      price: plan.price,
    });
    setEditingId(plan._id);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this plan?")) {
      try {
        await deletePlan(id);
        fetchPlans();
      } catch (error) {
        console.error("Error deleting plan:", error);
        alert("Failed to delete plan.");
      }
    }
  };

  return (
    <div className="container-custom py-8">
      <h2 className="heading-secondary text-center mb-8">
        Admin Plans Management
      </h2>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{editingId ? "Edit Plan" : "Create New Plan"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name:</Label>
              <Input
                id="name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description:</Label>
              <Textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="durationDays">Duration (Days):</Label>
              <Input
                id="durationDays"
                type="number"
                name="durationDays"
                value={form.durationDays}
                onChange={handleChange}
                required
                min={1}
              />
            </div>
            <div>
              <Label htmlFor="price">Price:</Label>
              <Input
                id="price"
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                min={0}
                step="0.01"
              />
            </div>
            <div className="flex space-x-4">
              <Button type="submit" className="btn-primary">
                {editingId ? "Update Plan" : "Create Plan"}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingId(null)}
                >
                  Cancel Edit
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <h3 className="heading-secondary text-center mb-6">Existing Plans</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!plans || plans.length === 0 ? (
          <p className="text-center text-gray-500 col-span-full">
            No plans available.
          </p>
        ) : (
          plans.map((plan) => (
            <Card key={plan._id}>
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{plan.description}</CardDescription>
                <p className="text-sm font-medium mt-2">
                  Duration: {plan.durationDays} days
                </p>
                <p className="text-sm font-medium">
                  Price: ${plan.price.toFixed(2)}
                </p>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEdit(plan)}
                  aria-label="Edit Plan"
                >
                  <Edit size={16} />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(plan._id)}
                  aria-label="Delete Plan"
                >
                  <Trash2 size={16} />
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminPlansPage;
