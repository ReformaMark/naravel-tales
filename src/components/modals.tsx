"use client";

import { ClassModal } from "@/features/class/components/class-modal";
import { AddStudentDialog } from "@/features/students/components/add-student-dialog";
import { UpdateProfileDialog } from "@/features/students/components/update-profile-dialog";
import { useEffect, useState } from "react";

export const Modals = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <ClassModal />
      <AddStudentDialog />
      <UpdateProfileDialog />
    </>
  );
};
