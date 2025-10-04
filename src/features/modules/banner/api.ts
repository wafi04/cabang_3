import { api } from "@/lib/api";
import { API_RESPONSE } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export interface BannerData {
  id: number;
  branchId: number;
  urlBanner: string;
  isActive: boolean;
  sortOrder: number;
}

export function UseCreateBanner() {
  return useMutation({
    mutationKey: ["banners"],
    mutationFn: async (data: string) => {
      const req = await api.post("/banner", data);
      return req.data;
    },
  });
}

export function UseGetBannersByBranchId() {
  return useQuery({
    queryKey: ["banners"],
    queryFn: async () => {
      const req = await api.get<API_RESPONSE<BannerData[]>>(`/banner`);
      return req.data;
    },
    staleTime: 24 * 60 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 60 * 1000,
  });
}

export function UseDeleteBanner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["delete-banner"],
    mutationFn: async (id: number) => {
      const req = await api.delete(`/banner/${id}?id=${id}`);
      console.log(req.data)
      return req.data;
    },
    onSuccess: () => {
      toast.success("delete successfully");
      queryClient.invalidateQueries({ queryKey: ["banners"] });
    },
    onError : () =>  {
      queryClient.cancelQueries({ queryKey: ["banners"] });
    },
  });
}
