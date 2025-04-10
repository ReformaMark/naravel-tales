"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "convex/react";
import { Skeleton } from "@/components/ui/skeleton";
import { useStudentId } from "@/features/students/hooks/use-student-id";
import { api } from "../../../../convex/_generated/api";
import { getAvatarColor, getInitials } from "@/lib/utils";
import { Mail, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { InquiryFormDialog } from "./inquiry-form-dialog";

export function TeacherProfile() {
  const studentId = useStudentId();
  const teacher = useQuery(api.users.getTeacherByStudentId, { studentId });
  const fullName = `${teacher?.fname} ${teacher?.lname}`;
  const initials = getInitials(teacher?.fname || "", teacher?.lname || "");
  const avatarColor = getAvatarColor(fullName);

  if (!teacher) {
    return <TeacherProfileSkeleton />;
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold text-primary">
              Teacher Profile
            </CardTitle>
            {/* <p className="text-muted-foreground">
                            {fullName}
                        </p> */}
          </div>
          <InquiryFormDialog />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex items-start gap-6">
          <Avatar className="h-24 w-24">
            <AvatarFallback
              className={`rounded-lg text-3xl font-semibold text-white ${avatarColor}`}
            >
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-2">
            <h3 className="font-bold text-2xl text-primary">{fullName}</h3>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="capitalize">
                {teacher.role}
              </Badge>

              {/* <Badge variant="outline" className="bg-primary/5">
                Grade School Teacher
              </Badge> */}
            </div>

            <p className="text-sm text-muted-foreground">
              Helping students achieve their full potential through personalized
              learning
            </p>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">
                {teacher.email || "Not provided"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Contact</p>
              <p className="text-sm text-muted-foreground">
                {teacher.phone || "Not provided"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TeacherProfileSkeleton() {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <Skeleton className="h-7 w-48" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-start gap-6">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="space-y-3">
            <Skeleton className="h-8 w-48" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-32" />
            </div>
            <Skeleton className="h-4 w-64" />
          </div>
        </div>

        <Skeleton className="h-px w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-5 w-5" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
