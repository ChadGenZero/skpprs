
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Habit } from '@/context/AppContext';
import { formatCurrency } from '@/lib/utils';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

interface CustomSkipModalProps {
  habit: Habit;
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, emoji: string, amount: number) => void;
}

// Info tooltip component
const InfoTooltip: React.FC<{ content: string }> = ({ content }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <InfoIcon size={16} className="text-gray-400 hover:text-bitcoin cursor-help ml-1" />
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

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
          <DialogTitle>Add Custom Skip</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center">
              Skip Name
              <InfoTooltip content="What did you skip today? Be specific." />
            </Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="e.g., Coffee Shop Visit" 
              required 
              className="text-gray-900 placeholder:text-gray-400"
              autoFocus
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="emoji" className="flex items-center">
              Custom Emoji 
              <InfoTooltip content="Choose an emoji that represents what you skipped" />
            </Label>
            <div className="grid grid-cols-5 gap-2 mb-2">
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
            <Input 
              id="emoji" 
              value={emoji} 
              onChange={(e) => setEmoji(e.target.value)} 
              placeholder="or paste your own emoji" 
              className="text-gray-900 placeholder:text-gray-400 text-2xl"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount" className="flex items-center">
              Cost ($)
              <InfoTooltip content="How much did you save by skipping this?" />
            </Label>
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
                required
              />
            </div>
            <p className="text-sm text-gray-500">
              Default is {formatCurrency(habit.expense)}
            </p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-md mt-4">
            <div className="text-sm text-gray-600 font-medium">You will save:</div>
            <div className="text-lg font-semibold text-royal-blue">
              {formatCurrency(amount)}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              This one-time skip will be added to your weekly savings
            </div>
          </div>
        
          <DialogFooter className="pt-4">
            <Button 
              type="submit" 
              className="w-full bg-bitcoin hover:bg-bitcoin/90 text-white"
            >
              Add Custom Skip
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CustomSkipModal;
