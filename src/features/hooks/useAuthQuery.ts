import { api } from "@/lib/api";
import { API_RESPONSE } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { User } from "../types/user";

const fetchUser = async () => {
  const response = await api.get<API_RESPONSE<User>>("/user/profile");
  return response.data;
};

export const useAuthQuery = () => {
  const { data, isLoading, error, refetch, isError } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 menit
  });

  return {
    data,
    isLoading,
    error,
    refetch,
    isError,
  };
};
