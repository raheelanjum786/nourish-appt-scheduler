import React, { useEffect, useState } from "react";
import {
  getAllPlanOrders,
  updatePlanOrder,
  deletePlanOrder,
} from "@/services/planOrderService";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

interface Plan {
  _id: string;
  name: string;
  description: string;
  durationDays: number;
  price: number;
}

interface User {
  _id: string;
  name: string;
  email: string;
}

interface PlanOrder {
  _id: string;
  user: User;
  plan: Plan;
  orderDate: string;
  startDate: string;
  endDate: string;
  status: "active" | "expired" | "cancelled";
}

const PlanOrdersManagement: React.FC = () => {
  const [planOrders, setPlanOrders] = useState<PlanOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<PlanOrder | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchPlanOrders();
  }, []);

  const fetchPlanOrders = async () => {
    try {
      setLoading(true);
      const data = await getAllPlanOrders();
      setPlanOrders(data);
    } catch (error) {
      console.error("Error fetching plan orders:", error);
      toast({
        title: "Error",
        description: "Failed to load plan orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (status: "active" | "expired" | "cancelled") => {
    if (currentOrder) {
      setCurrentOrder({ ...currentOrder, status });
    }
  };

  const handleUpdateOrder = async () => {
    if (!currentOrder) return;

    try {
      await updatePlanOrder(currentOrder._id, { status: currentOrder.status });
      toast({
        title: "Success",
        description: "Plan order updated successfully",
      });
      setIsEditDialogOpen(false);
      fetchPlanOrders();
    } catch (error) {
      console.error("Error updating plan order:", error);
      toast({
        title: "Error",
        description: "Failed to update plan order",
        variant: "destructive",
      });
    }
  };

  const handleDeleteOrder = async () => {
    if (!orderToDelete) return;

    try {
      await deletePlanOrder(orderToDelete);
      toast({
        title: "Success",
        description: "Plan order deleted successfully",
      });
      setIsDeleteDialogOpen(false);
      setOrderToDelete(null);
      fetchPlanOrders();
    } catch (error) {
      console.error("Error deleting plan order:", error);
      toast({
        title: "Error",
        description: "Failed to delete plan order",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (order: PlanOrder) => {
    setCurrentOrder(order);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (orderId: string) => {
    setOrderToDelete(orderId);
    setIsDeleteDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "expired":
        return <Badge className="bg-gray-100 text-gray-800">Expired</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Plan Orders Management</h1>
        <Button onClick={fetchPlanOrders}>Refresh</Button>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading plan orders...</div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Plan Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Order Date</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {planOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      No plan orders found.
                    </TableCell>
                  </TableRow>
                ) : (
                  planOrders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell className="font-mono text-xs">
                        {order._id.substring(0, 8)}...
                      </TableCell>
                      <TableCell>
                        {order.user.name}
                        <div className="text-xs text-gray-500">
                          {order.user.email}
                        </div>
                      </TableCell>
                      <TableCell>{order.plan.name}</TableCell>
                      <TableCell>{formatDate(order.orderDate)}</TableCell>
                      <TableCell>{formatDate(order.startDate)}</TableCell>
                      <TableCell>{formatDate(order.endDate)}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(order)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => openDeleteDialog(order._id)}
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

      {/* Edit Plan Order Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Plan Order</DialogTitle>
          </DialogHeader>
          {currentOrder && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-right font-medium">Plan:</span>
                <span className="col-span-3">{currentOrder.plan.name}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-right font-medium">User:</span>
                <span className="col-span-3">
                  {currentOrder.user.name} ({currentOrder.user.email})
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-right font-medium">Order Date:</span>
                <span className="col-span-3">
                  {formatDate(currentOrder.orderDate)}
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-right font-medium">Status:</span>
                <div className="col-span-3">
                  <Select
                    value={currentOrder.status}
                    onValueChange={(value) =>
                      handleStatusChange(
                        value as "active" | "expired" | "cancelled"
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateOrder}>Update Order</Button>
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
            Are you sure you want to delete this plan order? This action cannot
            be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteOrder}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlanOrdersManagement;
