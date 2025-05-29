import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ConsultationTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNext: (type: string) => void;
  onBack: () => void;
}

export default function ConsultationTypeModal({
  isOpen,
  onClose,
  onNext,
  onBack,
}: ConsultationTypeModalProps) {
  const [selectedType, setSelectedType] = useState("");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Consultation Type</DialogTitle>
          <DialogDescription>
            Choose how you would like to have your consultation.
          </DialogDescription>
        </DialogHeader>
        <RadioGroup
          value={selectedType}
          onValueChange={setSelectedType}
          className="space-y-2 my-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="video" id="video" />
            <Label htmlFor="video">Video Consultation</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="voice" id="voice" />
            <Label htmlFor="voice">Voice Call</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="in-person" id="in-person" />
            <Label htmlFor="in-person">In-Person</Label>
          </div>
        </RadioGroup>
        <div className="flex justify-between gap-2">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={() => onNext(selectedType)} disabled={!selectedType}>
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
