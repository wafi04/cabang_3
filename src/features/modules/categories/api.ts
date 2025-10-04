import { API_RESPONSE, ApiPagination, FilterRequest } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Category } from "./types";
import { api } from "@/lib/api";

export function useGetAllCategory(filters?: FilterRequest) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["categories", filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters?.limit) params.append("limit", filters.limit);
      if (filters?.page) params.append("page", filters.page);
      if (filters?.search) params.append("search", filters.search);
      const data = await api.get<ApiPagination<Category[]>>(
        `/categories?${params.toString()}`
      );
      return data.data;
    },
    staleTime: 60000,
    gcTime: 60000,
  });

  return {
    data: data,
    isLoading,
    error,
  };
}

export function useGetCategoryType() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["categories", "types"],
    queryFn: async () => {
      const data = await api.get<API_RESPONSE<string[]>>(`/categories/types`);
      return data.data;
    },
    staleTime: 24 * 60000,
    gcTime: 24 * 60000,
  });
  return {
    data,
    isLoading,
    error,
  };
}
export function useGetAllCategoryActive() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const data = await api.get<API_RESPONSE<Category[]>>(`/category/all`);
      return data.data;
    },
    staleTime: 5 * 6000,
    gcTime: 5 * 6000,
  });
  return {
    data,
    isLoading,
    error,
  };
}
