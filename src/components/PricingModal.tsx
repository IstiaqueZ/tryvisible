import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PricingContent } from "@/pages/Pricing";

interface PricingModalProps {
  open: boolean;
  onClose: () => void;
}

const PricingModal = ({ open, onClose }: PricingModalProps) => {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-secondary border-border p-8">
        <PricingContent isModal onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default PricingModal;
