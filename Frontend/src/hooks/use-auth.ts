"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMe, login as apiLogin, register as apiRegister, logout as apiLogout } from "@/lib/api/auth";
import { User } from "@/types/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = useQuery<User | null>({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      try {
        return await getMe();
      } catch (err: unknown) {
        const statusCode = (err as { statusCode?: number })?.statusCode;
        if (statusCode === 401) {
          return null;
        }
        return null;
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  const loginMutation = useMutation({
    mutationFn: apiLogin,
    onSuccess: (newUser) => {
      queryClient.setQueryData(["auth", "me"], newUser);
      toast.success(`Welcome back, ${newUser.username}`);
      router.push("/dashboard");
    },
  });

  const registerMutation = useMutation({
    mutationFn: apiRegister,
    onSuccess: (newUser) => {
      queryClient.setQueryData(["auth", "me"], newUser);
      toast.success("Account created successfully!");
      router.push("/dashboard");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: apiLogout,
    onSuccess: () => {
      queryClient.setQueryData(["auth", "me"], null);
      queryClient.clear();
      toast.success("Signed out");
      router.push("/");
    },
  });

  return {
    user: user ?? null,
    isLoading,
    isError,
    isAuthenticated: !!user,
    isAdmin: user?.role === "ADMIN",
    refetchUser: refetch,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
}
