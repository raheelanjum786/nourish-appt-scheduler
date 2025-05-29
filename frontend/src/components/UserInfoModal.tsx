import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface UserInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNext: (info: { name: string; email: string; phone: string }) => void;
  onBack: () => void;
  serviceName: string;
}

export default function UserInfoModal({
  isOpen,
  onClose,
  onNext,
  onBack,
  serviceName,
}: UserInfoModalProps) {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Your Information</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 my-4">
          <div>
            <label className="block mb-2 text-sm font-medium">Full Name</label>
            <Input
              name="name"
              value={userInfo.name}
              onChange={handleChange}
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Email</label>
            <Input
              name="email"
              type="email"
              value={userInfo.email}
              onChange={handleChange}
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Phone</label>
            <Input
              name="phone"
              value={userInfo.phone}
              onChange={handleChange}
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>
        <div className="flex justify-between gap-2">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button
            onClick={() => onNext(userInfo)}
            disabled={!userInfo.name || !userInfo.email || !userInfo.phone}
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
