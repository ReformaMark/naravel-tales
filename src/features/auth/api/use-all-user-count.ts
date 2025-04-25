import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { UserChartData } from "@/app/admin/overview/_components/users-percentage";

export const useAllUsers = () => {
  const data = useQuery(api.users.getAllUsers);
  const isLoading = data === undefined;

  return {
    data,
    isLoading,
  };
};

export const useActiveusers = () => {
  const data = useQuery(api.users.getActiveUsers);
  const isLoading = data === undefined;

  return {
    data,
    isLoading,
  };
};

export const useNumberOfRoles = () => {
  const data = useQuery(api.users.getNumberOfRoles) as
    | UserChartData[]
    | undefined;
  const isLoading = data === undefined;

  return {
    data,
    isLoading,
  };
};
