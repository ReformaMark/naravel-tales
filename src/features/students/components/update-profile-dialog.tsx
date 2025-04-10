"use client";

import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { Loader2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { isUpdateProfileModalOpenAtom } from "@/features/settings/update-profile";
import { useCurrentUser } from "@/features/auth/api/use-current-user";
import { api } from "../../../../convex/_generated/api";

import { cn } from "@/lib/utils";

export function UpdateProfileDialog() {
  const [newProfile, setNewProfile] = useState({ fname: "", lname: "" });
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isOpen, setIsOpen] = useAtom(isUpdateProfileModalOpenAtom);
  const { data: user, isLoading } = useCurrentUser();
  const updateUser = useMutation(api.users.updateInfo);

  useEffect(() => {
    if (user) {
      setNewProfile({ fname: user.fname ?? "", lname: user.lname ?? "" });
    }
  }, [user]);

  const validateName = (name: string, label: string): string | null => {
    if (name.length < 3) return `${label} must be at least 2 characters long.`;
    if (name.length > 50)
      return `${label} cannot be longer than 50 characters.`;
    if (!/^[a-zA-Z\s-']+$/.test(name))
      return `${label} can only contain letters, spaces, hyphens, and apostrophes.`;
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const fnameError = validateName(newProfile.fname, "First name");
    const lnameError = validateName(newProfile.lname, "Last name");

    if (fnameError || lnameError) {
      setError(fnameError || lnameError);
      return;
    }

    setIsPending(true);
    try {
      await updateUser({
        fname: newProfile.fname.trim(),
        lname: newProfile.lname.trim(),
      });

      toast.success("Profile updated successfully.");
      setIsOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile.");
    } finally {
      setIsPending(false);
    }
  };

  if (isLoading) {
    return <Loader2Icon className="w-5 h-5 animate-spin" />;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Update Profile</DialogTitle>
          </DialogHeader>

          {error && <p className="text-sm text-red-500 mb-2">* {error}</p>}

          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="fname">First Name</Label>
              <Input
                id="fname"
                value={newProfile.fname}
                onChange={(e) =>
                  setNewProfile((prev) => ({ ...prev, fname: e.target.value }))
                }
                className={cn(error && "border-red-500")}
                disabled={isPending}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="lname">Last Name</Label>
              <Input
                id="lname"
                value={newProfile.lname}
                onChange={(e) =>
                  setNewProfile((prev) => ({ ...prev, lname: e.target.value }))
                }
                className={cn(error && "border-red-500")}
                disabled={isPending}
                required
              />
            </div>
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Profile"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
