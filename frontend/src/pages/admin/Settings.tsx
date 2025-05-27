
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const AdminSettings = () => {
  const [personalSettings, setPersonalSettings] = useState({
    name: "Admin User",
    email: "admin@counseling.com",
    phone: "+1 (555) 123-4567",
  });

  const [generalSettings, setGeneralSettings] = useState({
    siteName: "Counseling Services",
    contactEmail: "contact@counseling.com",
    contactPhone: "+1 (555) 987-6543",
    address: "123 Therapy Lane, Wellness City, WC 12345",
    businessHours: "Monday-Friday: 9:00 AM - 6:00 PM",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    marketingEmails: false,
  });

  const [paymentSettings, setPaymentSettings] = useState({
    currency: "USD",
    taxRate: "5",
    acceptedPaymentMethods: ["Credit Card", "PayPal", "Apple Pay"],
    invoicePrefix: "INV-",
  });

  const handlePersonalSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Settings Updated",
      description: "Your personal settings have been updated successfully",
    });
  };

  const handleGeneralSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Settings Updated",
      description: "General settings have been updated successfully",
    });
  };

  const handleNotificationSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Notification Settings Updated",
      description: "Your notification preferences have been saved",
    });
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Payment Settings Updated",
      description: "Payment configuration has been updated successfully",
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <Tabs defaultValue="personal" className="space-y-4">
        <TabsList>
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and contact information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePersonalSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    value={personalSettings.name} 
                    onChange={(e) => setPersonalSettings({...personalSettings, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={personalSettings.email} 
                    onChange={(e) => setPersonalSettings({...personalSettings, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone" 
                    value={personalSettings.phone} 
                    onChange={(e) => setPersonalSettings({...personalSettings, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
                <Button type="submit">Save Changes</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure general application settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGeneralSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="site-name">Site Name</Label>
                  <Input 
                    id="site-name" 
                    value={generalSettings.siteName} 
                    onChange={(e) => setGeneralSettings({...generalSettings, siteName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Contact Email</Label>
                  <Input 
                    id="contact-email" 
                    type="email" 
                    value={generalSettings.contactEmail} 
                    onChange={(e) => setGeneralSettings({...generalSettings, contactEmail: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-phone">Contact Phone</Label>
                  <Input 
                    id="contact-phone" 
                    value={generalSettings.contactPhone} 
                    onChange={(e) => setGeneralSettings({...generalSettings, contactPhone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Business Address</Label>
                  <Textarea 
                    id="address" 
                    value={generalSettings.address} 
                    onChange={(e) => setGeneralSettings({...generalSettings, address: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business-hours">Business Hours</Label>
                  <Input 
                    id="business-hours" 
                    value={generalSettings.businessHours} 
                    onChange={(e) => setGeneralSettings({...generalSettings, businessHours: e.target.value})}
                  />
                </div>
                <Button type="submit">Save Changes</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Manage how you receive notifications and alerts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleNotificationSubmit} className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive appointment and system notifications via email.
                    </p>
                  </div>
                  <Switch 
                    id="email-notifications" 
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({...notificationSettings, emailNotifications: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sms-notifications">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive appointment and system notifications via SMS.
                    </p>
                  </div>
                  <Switch 
                    id="sms-notifications" 
                    checked={notificationSettings.smsNotifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({...notificationSettings, smsNotifications: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="appointment-reminders">Appointment Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive reminders about upcoming appointments.
                    </p>
                  </div>
                  <Switch 
                    id="appointment-reminders" 
                    checked={notificationSettings.appointmentReminders}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({...notificationSettings, appointmentReminders: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketing-emails">Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive promotional content and newsletters.
                    </p>
                  </div>
                  <Switch 
                    id="marketing-emails" 
                    checked={notificationSettings.marketingEmails}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({...notificationSettings, marketingEmails: checked})
                    }
                  />
                </div>

                <Button type="submit">Save Preferences</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>
                Configure payment methods and related settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select 
                    defaultValue={paymentSettings.currency}
                    onValueChange={(value) => setPaymentSettings({...paymentSettings, currency: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                      <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                  <Input 
                    id="tax-rate" 
                    type="number"
                    value={paymentSettings.taxRate} 
                    onChange={(e) => setPaymentSettings({...paymentSettings, taxRate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invoice-prefix">Invoice Number Prefix</Label>
                  <Input 
                    id="invoice-prefix" 
                    value={paymentSettings.invoicePrefix} 
                    onChange={(e) => setPaymentSettings({...paymentSettings, invoicePrefix: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Accepted Payment Methods</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="credit-card" defaultChecked />
                      <Label htmlFor="credit-card">Credit/Debit Card</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="paypal" defaultChecked />
                      <Label htmlFor="paypal">PayPal</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="apple-pay" defaultChecked />
                      <Label htmlFor="apple-pay">Apple Pay</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="google-pay" />
                      <Label htmlFor="google-pay">Google Pay</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="bank-transfer" />
                      <Label htmlFor="bank-transfer">Bank Transfer</Label>
                    </div>
                  </div>
                </div>
                
                <Button type="submit">Save Payment Settings</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
