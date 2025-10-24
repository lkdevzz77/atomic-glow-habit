import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface EditSubscriptionModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  currentTier?: string;
  currentStatus?: string;
  currentExpiresAt?: string | null;
  onSave: (tier: string, status: string, expiresAt: string | null) => Promise<void>;
}

export const EditSubscriptionModal: React.FC<EditSubscriptionModalProps> = ({
  open,
  onClose,
  userId,
  currentTier = 'free',
  currentStatus = 'active',
  currentExpiresAt = null,
  onSave,
}) => {
  const [tier, setTier] = useState(currentTier);
  const [status, setStatus] = useState(currentStatus);
  const [expiresAt, setExpiresAt] = useState(
    currentExpiresAt ? new Date(currentExpiresAt).toISOString().split('T')[0] : ''
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onSave(tier, status, expiresAt || null);
      onClose();
    } catch (error) {
      console.error('Error updating subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Assinatura</DialogTitle>
          <DialogDescription>
            Modifique a assinatura do usuário manualmente
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="tier">Tier</Label>
            <Select value={tier} onValueChange={setTier}>
              <SelectTrigger id="tier">
                <SelectValue placeholder="Selecione o tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Ativa</SelectItem>
                <SelectItem value="cancelled">Cancelada</SelectItem>
                <SelectItem value="expired">Expirada</SelectItem>
                <SelectItem value="trial">Trial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expires">Data de Expiração</Label>
            <Input
              id="expires"
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Deixe em branco para assinatura sem data de expiração
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
