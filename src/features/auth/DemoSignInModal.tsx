import { useState } from "react";
import { useDemoAuth } from "./DemoAuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function DemoSignInModal() {
  const { user, users, signIn, isLoading } = useDemoAuth();
  const [selected, setSelected] = useState<string>("");

  if (isLoading || user) return null;

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Welcome to ProjectHub</DialogTitle>
          <DialogDescription>
            Select a demo user to continue. No password required.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <Select value={selected} onValueChange={setSelected}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a user…" />
            </SelectTrigger>
            <SelectContent>
              {users.map((u) => (
                <SelectItem key={u.id} value={u.id}>
                  <span className="flex items-center gap-2">
                    <Avatar className="h-6 w-6 text-xs">
                      <AvatarFallback>{initials(u.full_name)}</AvatarFallback>
                    </Avatar>
                    {u.full_name}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            className="w-full"
            disabled={!selected}
            onClick={() => signIn(selected)}
          >
            Sign In
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
