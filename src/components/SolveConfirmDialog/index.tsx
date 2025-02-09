// src/components/SolveConfirmDialog/index.tsx

import React from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogFooter,
  AlertDialogCancel
} from "@/components/ui/alert-dialog"

interface SolveConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function SolveConfirmDialog({ 
  open, 
  onOpenChange, 
  onConfirm 
}: SolveConfirmDialogProps) {
  const handleConfirm = React.useCallback(() => {
    onConfirm();
    onOpenChange(false);
  }, [onConfirm, onOpenChange]);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-sm bg-white" description="solve-confirmation">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription id="solve-confirmation">
            Your game result will not be recorded!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>No, I will try harder</AlertDialogCancel>
          <AlertDialogAction 
            onClick={() => handleConfirm()}
            className="bg-blue-500 text-white hover:bg-blue-600"
          >
            Yes, solve this puzzle
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
