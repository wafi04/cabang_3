import { api } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UpsertWebSettings, WebSettings } from "../../types/web-settings";
import { API_RESPONSE } from "@/lib/types";
import toast from "react-hot-toast";

// CREATE WEB SETTINGS
export function useCreateWebSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["web-settings"],
    mutationFn: async (data: UpsertWebSettings) => {
      const req = await api.post("/websettings", data);
      return req.data;
    },
    onSuccess: () => {
      toast.success("Web settings berhasil dibuat!");
      queryClient.invalidateQueries({ queryKey: ["web-settings"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Gagal membuat web settings"
      );
    },
  });
}

// GET WEB SETTINGS
export function useGetWebSettings() {
  return useQuery({
    queryKey: ["web-settings"],
    queryFn: async () => {
      const req = await api.get<API_RESPONSE<WebSettings>>(`/websettings`);
      return req.data;
    },
    staleTime: 24 * 60 * 1000,
    gcTime: 24 * 60 * 1000,
  });
}

// UPDATE WEB SETTINGS (nama function diperbaiki dari UseUpdateWebSettings)
export function useUpdateWebSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["web-settings"],
    mutationFn: async ({
      data,
      id,
    }: {
      data: UpsertWebSettings;
      id: number;
    }) => {
      const req = await api.put(`/websettings/${id}`, data);
      return req.data;
    },
    onSuccess: () => {
      toast.success("Web settings berhasil dihapus!");
      queryClient.invalidateQueries({ queryKey: ["web-settings"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Gagal menghapus web settings"
      );
    },
  });
}
