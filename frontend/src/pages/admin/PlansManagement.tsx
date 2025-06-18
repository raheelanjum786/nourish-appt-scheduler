import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import {
  getPlans,
  createPlan,
  updatePlan,
  deletePlan,
} from "@/services/planService";

interface Plan {
  _id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  features: string[];
}

const PlansManagement = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<Partial<Plan>>({
    name: "",
    description: "",
    duration: 30,
    price: 99,
    features: [""],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const data = await getPlans();
      setPlans(data);
    } catch (error) {
      console.error("Error fetching plans:", error);
      toast({
        title: "Error",
        description: "Failed to load plans",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCurrentPlan((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentPlan((prev) => ({ ...prev, [name]: Number(value) }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...(currentPlan.features || [])];
    updatedFeatures[index] = value;
    setCurrentPlan((prev) => ({ ...prev, features: updatedFeatures }));
  };

  const addFeatureField = () => {
    setCurrentPlan((prev) => ({
      ...prev,
      features: [...(prev.features || []), ""],
    }));
  };

  const removeFeatureField = (index: number) => {
    const updatedFeatures = [...(currentPlan.features || [])];
    updatedFeatures.splice(index, 1);
    setCurrentPlan((prev) => ({ ...prev, features: updatedFeatures }));
  };

  const handleCreateOrUpdatePlan = async () => {
    try {
      if (
        !currentPlan.name ||
        !currentPlan.description ||
        !currentPlan.duration ||
        !currentPlan.price
      ) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      if (isEditing && currentPlan._id) {
        await updatePlan(currentPlan._id, currentPlan);
        toast({
          title: "Success",
          description: "Plan updated successfully",
        });
      } else {
        await createPlan(currentPlan);
        toast({
          title: "Success",
          description: "Plan created successfully",
        });
      }

      setIsDialogOpen(false);
      fetchPlans();
    } catch (error) {
      console.error("Error saving plan:", error);
      toast({
        title: "Error",
        description: "Failed to save plan",
        variant: "destructive",
      });
    }
  };

  const handleDeletePlan = async () => {
    if (!planToDelete) return;

    try {
      await deletePlan(planToDelete);
      toast({
        title: "Success",
        description: "Plan deleted successfully",
      });
      setIsDeleteDialogOpen(false);
      setPlanToDelete(null);
      fetchPlans();
    } catch (error) {
      console.error("Error deleting plan:", error);
      toast({
        title: "Error",
        description: "Failed to delete plan",
        variant: "destructive",
      });
    }
  };

  const openCreateDialog = () => {
    setCurrentPlan({
      name: "",
      description: "",
      duration: 30,
      price: 99,
      features: [""],
    });
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const openEditDialog = (plan: Plan) => {
    setCurrentPlan({ ...plan });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (planId: string) => {
    setPlanToDelete(planId);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Plans Management</h1>
        <Button onClick={openCreateDialog}>Create New Plan</Button>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading plans...</div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Duration (days)</TableHead>
                  <TableHead>Price ($)</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plans.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No plans found. Create your first plan!
                    </TableCell>
                  </TableRow>
                ) : (
                  plans.map((plan) => (
                    <TableRow key={plan._id}>
                      <TableCell>{plan.name}</TableCell>
                      <TableCell>{plan.duration}</TableCell>
                      <TableCell>${plan.price}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(plan)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => openDeleteDialog(plan._id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Plan Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Plan" : "Create New Plan"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">
                Name
              </label>
              <Input
                id="name"
                name="name"
                value={currentPlan.name}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="description" className="text-right">
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                value={currentPlan.description}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="duration" className="text-right">
                Duration (days)
              </label>
              <Input
                id="duration"
                name="duration"
                type="number"
                value={currentPlan.duration}
                onChange={handleNumberInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="price" className="text-right">
                Price ($)
              </label>
              <Input
                id="price"
                name="price"
                type="number"
                value={currentPlan.price}
                onChange={handleNumberInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <label className="text-right pt-2">Features</label>
              <div className="col-span-3 space-y-2">
                {currentPlan.features?.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={feature}
                      onChange={(e) =>
                        handleFeatureChange(index, e.target.value)
                      }
                      placeholder={`Feature ${index + 1}`}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeFeatureField(index)}
                      disabled={currentPlan.features?.length === 1}
                    >
                      ✕
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addFeatureField}
                >
                  Add Feature
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateOrUpdatePlan}>
              {isEditing ? "Update Plan" : "Create Plan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete this plan? This action cannot be
            undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeletePlan}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlansManagement;
