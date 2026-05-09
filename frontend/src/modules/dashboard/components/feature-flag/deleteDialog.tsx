import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash } from "lucide-react";

type DeleteDialogProps = {
  flagKey: string;
  disabled?: boolean;
  onConfirm: () => void | Promise<void>;
};

export default function DeleteDialog({
  flagKey,
  disabled = false,
  onConfirm,
}: DeleteDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="sm"
          variant="destructive"
          className="w-full justify-start gap-2 border-none shadow-none"
          disabled={disabled}
        >
          <Trash className="w-4 h-4" /> Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="p-0 max-w-md">
        <AlertDialogHeader className="px-6 py-4">
          <AlertDialogTitle>Delete this flag?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete <strong>{flagKey}</strong> and it cannot
            be recovered.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex items-center justify-center border-t border-gray-400/60 p-4 bg-gray-100 dark:bg-[#242323] rounded-b-md">
          <AlertDialogCancel className="flex-1 h-9">Cancel</AlertDialogCancel>
          <AlertDialogAction className="flex-1 h-9" onClick={() => void onConfirm()}>
            Yes, delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
