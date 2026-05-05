import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function QuickEvaluatePanel() {
  return (
    <Card
      id="evaluate"
      className=" rounded-lg border border-border bg-gray-100 dark:bg-[#252525] ring-0"
    >
      <h2 className="text-base font-semibold text-card-foreground">
        Quick Evaluate
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Try a test user against a flag and preview the decision.
      </p>

      <Separator className="my-4" />

      <div className="space-y-3">
        <div>
          <Label className="mb-1 block text-xs font-medium text-muted-foreground">
            Flag Key
          </Label>
          <Input
            defaultValue="new_dashboard"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="mb-1 block text-xs font-medium text-muted-foreground">
              User ID
            </Label>
            <Input
              defaultValue="user_123"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
            />
          </div>
          <div>
            <Label className="mb-1 block text-xs font-medium text-muted-foreground">
              Country
            </Label>
            <Input
              defaultValue="IN"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
            />
          </div>
        </div>

        <Button className="w-full">Evaluate Flag</Button>

        <div className="rounded-md border border-blue-600 bg-blue-200 p-3 text-sm text-blue-600 dark:bg-blue-200 dark:text-blue-600">
          Result: enabled = true, variant = control
        </div>
      </div>
    </Card>
  );
}
