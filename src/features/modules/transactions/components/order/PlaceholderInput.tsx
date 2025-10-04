import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Loader2 } from "lucide-react";
import { useGetFormFields } from "@/features/hooks/useGetFormFields";
import { useOrderStore } from "@/features/hooks/useOrder";
import { useDebounce } from "@/features/hooks/useDebounce";
import { CheckNickName } from "@/features/hooks/useCheckNickname";
import { HeaderFieldOrder } from "./HeaderFieldOrder";

interface PlaceHolderInputProps {
  brand: string;
  isCheckNickName: boolean;
}
interface NicknameStatusProps {
  isChecking: boolean;
  result: string;
}

export function PlaceHolderInput({
  brand,
  isCheckNickName,
}: PlaceHolderInputProps): JSX.Element {
  const { data, isLoading } = useGetFormFields(brand);
  const { setFormData, errors, formData } = useOrderStore();
  const [isChecking, setIsChecking] = useState(false);

  const debouncedOrderData = useDebounce(formData, 500);

  const handleInputChange = (field: string, value: string) => {
    setFormData({ [field]: value });
  };

  useEffect(() => {
    const checkNickname = async () => {
      if (!isCheckNickName || !data?.data || data.data.length === 0) {
        return;
      }

      const allFieldsFilled = data.data.every((field) => {
        const fieldValue =
          debouncedOrderData[
            field.fieldName as keyof typeof debouncedOrderData
          ];
        const stringValue = typeof fieldValue === "string" ? fieldValue : "";
        return stringValue && stringValue.trim() !== "";
      });

      if (allFieldsFilled) {
        setIsChecking(true);
        try {
          const check = await CheckNickName({
            userId: debouncedOrderData.gameId,
            type: brand,
            serverId: debouncedOrderData.serverId,
          });

          if (check.name) {
            setFormData({
              ...debouncedOrderData,
              nickname: check.name,
            });
          } else {
            toast.error("Nickname tidak ditemukan");
          }
        } catch (error) {
          toast.error("Gagal memverifikasi nickname");
        } finally {
          setIsChecking(false);
        }
      }
    };

    checkNickname();
  }, [
    isCheckNickName,
    debouncedOrderData.gameId,
    debouncedOrderData.serverId,
    data?.data,
    setFormData,
  ]);

  if (isLoading) {
    return (
      <div className="py-4 bg-card px-4 rounded-lg border border-border">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-9 bg-gray-200 rounded"></div>
            <div className="h-9 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <div className="py-4 bg-card px-4 rounded-lg border border-border">
        <div className="text-gray-500 text-sm">
          No form fields found for {brand}
        </div>
      </div>
    );
  }

  const gridCols = Math.min(data.data.length, 4); // Max 4 columns
  const gridClass = `grid gap-4 ${
    gridCols === 1
      ? "grid-cols-1"
      : gridCols === 2
      ? "grid-cols-1 md:grid-cols-2"
      : gridCols === 3
      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
  }`;

  return (
    <div className="bg-cardrounded-lg border rounded-xl border-border">
      <HeaderFieldOrder id={1} subName="Masukkan Detail Akun" />

      <div className={`${gridClass} p-4`}>
        {data.data
          .sort((a, b) => a.fieldOrder - b.fieldOrder)
          .map((field) => {
            const fieldValue =
              (formData as unknown as Record<string, string>)[
                field.fieldName
              ] || "";
            const fieldError = errors[field.fieldName];

            return (
              <div key={field.id} className="space-y-2">
                <label
                  htmlFor={field.fieldName}
                  className="block text-xs font-medium text-foreground"
                >
                  {field.fieldLabel}
                </label>

                <div className="relative">
                  {field.fieldType === "select" ? (
                    <select
                      id={field.fieldName}
                      name={field.fieldName}
                      className={`relative block h-9 w-full rounded-lg border px-3 text-xs text-foreground focus:z-10 focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-75 transition-colors ${
                        fieldError
                          ? "border-destructive focus:border-destructive focus:ring-destructive bg-destructive/5"
                          : "border-border bg-input focus:border-primary focus:ring-primary"
                      }`}
                      value={fieldValue}
                      onChange={(e) =>
                        handleInputChange(field.fieldName, e.target.value)
                      }
                      disabled={isLoading || isChecking}
                    >
                      <option value="">Pilih {field.fieldLabel}</option>
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      className={`relative block h-9 w-full appearance-none rounded-lg border px-3 text-xs text-foreground placeholder-muted-foreground/50 focus:z-10 focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-75 transition-colors ${
                        fieldError
                          ? "border-destructive focus:border-destructive focus:ring-destructive bg-destructive/5"
                          : "border-border bg-input focus:border-primary focus:ring-primary"
                      }`}
                      type={field.fieldType || "text"}
                      id={field.fieldName}
                      name={field.fieldName}
                      placeholder={`Masukkan ${field.fieldLabel}`}
                      autoComplete="off"
                      value={fieldValue}
                      onChange={(e) =>
                        handleInputChange(field.fieldName, e.target.value)
                      }
                      disabled={isLoading || isChecking}
                    />
                  )}

                  {fieldError && (
                    <div className="mt-1 text-xs text-destructive flex items-center gap-1">
                      <span>⚠</span>
                      <span>{fieldError}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>
      {formData.nickname && !isChecking && (
        <NicknameStatus isChecking={isChecking} result={formData.nickname} />
      )}
    </div>
  );
}

export function NicknameStatus({ isChecking, result }: NicknameStatusProps) {
  if (isChecking) {
    return (
      <Card className="mt-6 border-blue-200 bg-blue-50/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-900">
                Memverifikasi akun...
              </p>
              <p className="text-xs text-blue-700">Mohon tunggu sebentar</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (result) {
    return (
      <Card className="mt-6  bg-emerald-400">
        <CardContent className="p-2">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
            <div className="flex items-center gap-4">
              <p className="text-sm font-medium text-green-900">
                Akun berhasil diverifikasi
              </p>
              <span className="text-sm font-semibold">{result}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}
