"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export const useCountStories = () => {
  const data = useQuery(api.stories.countStories);
  const isLoading = data === undefined;
  return {
    count: data,
    isLoading,
  };
};
