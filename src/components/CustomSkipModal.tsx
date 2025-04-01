
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Habit } from '@/context/AppContext';
import { formatCurrency } from '@/lib/utils';

interface CustomSkipModalProps {
  habit: Habit;
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, emoji: string, amount: number) => void;
}

const CustomSkipModal: React.FC<CustomSkipModalProps> = ({ 
  habit, 
  isOpen, 
  onClose, 
  onSave 
}) => {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('🌊');
  const [amount, setAmount] = useState(habit.expense);
  
  const handleSave = () => {
    if (name.trim() && amount > 0) {
      onSave(name, emoji, amount);
      handleClose();
    }
  };
  
  const handleClose = () => {
    setName('');
    setEmoji('🌊');
    setAmount(habit.expense);
    onClose();
  };
  
  const commonEmojis = ['🌊', '🛟', '⛵', '🏄', '🏝️', '🏖️', '💰', '💵', '🪙', '💪', '🎯', '🎮', '🍕', '☕', '🍺'];
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Custom Skip for {habit.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Custom Skip Name</Label>
            <Input
              id="name"
              placeholder="What did you skip?"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
          
          <div className="grid gap-2">
            <Label>Choose an Emoji</Label>
            <div className="flex flex-wrap gap-2">
              {commonEmojis.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={`text-2xl p-2 rounded-md ${emoji === e ? 'bg-amber-100 ring-2 ring-amber-400' : 'hover:bg-gray-100'}`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount Saved</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <Input
                id="amount"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                className="pl-7"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </div>
            <p className="text-sm text-gray-500">
              Default is {formatCurrency(habit.expense)}
            </p>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} className="bg-amber-500 hover:bg-amber-600 text-white">
            Add Custom Skip
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomSkipModal;
