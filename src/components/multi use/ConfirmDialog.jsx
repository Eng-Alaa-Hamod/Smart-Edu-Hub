import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ConfirmDialog({
  trigger,
  triggerVariant = "outline",
  triggerClassName,
  title = "Confirmation",
  description = "هل أنت متأكد؟",
  confirmText = "قبول",
  cancelText = "إلغاء",
  confirmVariant = "default",
  cancelVariant = "outline",
  confirmClassName,
  cancelClassName,
  onConfirm,
  onCancel,
  children,
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant={triggerVariant} className={triggerClassName}>
            {title}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {children && (
          <div className="no-scrollbar -mx-4 max-h-[50vh] overflow-y-auto px-4">
            {children}
          </div>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant={cancelVariant} className={cancelClassName} onClick={onCancel}>
              {cancelText}
            </Button>
          </DialogClose>

          <DialogClose asChild>
            <Button type="button" variant={confirmVariant} className={confirmClassName} onClick={onConfirm}>
              {confirmText}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
