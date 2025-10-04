"use client";
import { LoginFormData, RegisterFormData } from "@/features/types/user";
import { api } from "@/lib/api";
import { ErrorResponse } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export function useHandleLogout() {
  const queryClient = useQueryClient();
  const push = useRouter();

  return useMutation({
    mutationKey: ["logout"],
    mutationFn: async () => {
      const response = await api.post(`/user/logout`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.clear();
      push.push("/login");
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Logout Succes");
    },
    onError: (error: Error) => {
      toast.error(error.message || "An error occurred during logout.");
    },
  });
}
export const useRegisterMutation = () => {
  const queryClient = useQueryClient();
  const push = useRouter();
  return useMutation({
    mutationKey: ["register"],
    mutationFn: async (data: RegisterFormData) => {
      const res = await api.post("/auth/register", data);

      return res.data;
    },
    onError: (err: ErrorResponse) => {
      queryClient.cancelQueries({ queryKey: ["user"] });
      toast.error(err.message as string);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      push.push("/login");
    },
  });
};

export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationKey: ["login"],
    mutationFn: async (data: LoginFormData) => {
      const res = await api.post("/auth/login", data);
      return res.data;
    },
    onError: (error: ErrorResponse) => {
      const errorMessage = error.error || error.message || "Login failed";
      queryClient.cancelQueries({ queryKey: ["user"] });
      toast.error(`${errorMessage.toUpperCase()}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Login Success");

      router.push("/");
    },
  });
};
