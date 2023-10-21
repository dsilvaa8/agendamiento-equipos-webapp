import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AlerProps {
  msg: string;
  Open: any;
  isOpen: any;
}

export function AlertDestructive({ msg, Open, isOpen }: AlerProps) {
  return (
    <Alert variant="destructive" className={Open ? "block" : "hidden"}>
      <ExclamationTriangleIcon className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{msg}</AlertDescription>
    </Alert>
  );
}
