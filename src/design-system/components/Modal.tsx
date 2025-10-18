import React from 'react';
import { Dialog, DialogContent, DialogOverlay } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, title, children }) => {
  return (
    <Dialog open={open} onOpenChange={(open) => { if(!open) onClose(); }}>
      <DialogOverlay className="fixed inset-0 bg-black/50" />
      <DialogContent className={cn('max-w-2xl w-full rounded-2xl p-6 bg-[rgba(15,23,42,0.9)] border border-gray-700') }>
        {title && <h3 className="text-xl font-semibold text-gray-100 mb-4">{title}</h3>}
        <div>
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
