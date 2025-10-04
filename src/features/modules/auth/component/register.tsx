"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RegisterFormData } from "@/features/types/user";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useRegisterMutation } from "../api";
import { AuthPage } from "./formAuth";

const countryCodes = [
  { code: "+62", country: "Indonesia", flag: "🇮🇩" },
  { code: "+60", country: "Malaysia", flag: "🇲🇾" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  { code: "+66", country: "Thailand", flag: "🇹🇭" },
  { code: "+84", country: "Vietnam", flag: "🇻🇳" },
  { code: "+63", country: "Philippines", flag: "🇵🇭" },
  { code: "+1", country: "USA", flag: "🇺🇸" },
];

interface RegisterFormFields extends Omit<RegisterFormData, "phoneNumber"> {
  countryCode: string;
  phoneNumber: string;
  confirmPassword: string;
  recaptcha: string;
}

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate, isPending, error } = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<RegisterFormFields>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      countryCode: "+62",
      phoneNumber: "",
      confirmPassword: "",
      recaptcha: "",
    },
  });

  const onSubmit = (data: RegisterFormFields) => {
    const fullPhoneNumber = `${data.countryCode}${data.phoneNumber}`;

    const registerData: RegisterFormData = {
      username: data.username,
      email: data.email,
      password: data.password,
      phoneNumber: fullPhoneNumber,
    };

    mutate(registerData);
  };

  return (
    <AuthPage
      title="Bergabunglah Dengan Kami!"
      description="Mulai perjalanan bisnis Anda sebagai reseller terpercaya dan raih kesuksesan bersama kami"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="Masukkan username"
            {...register("username", {
              required: "Username wajib diisi",
              minLength: { value: 3, message: "Username minimal 3 karakter" },
              maxLength: {
                value: 30,
                message: "Username maksimal 30 karakter",
              },
              pattern: {
                value: /^[a-zA-Z0-9_]+$/,
                message:
                  "Username hanya boleh mengandung huruf, angka, dan underscore",
              },
            })}
          />
          {errors.username && (
            <p className="text-sm text-destructive">
              {errors.username.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="nama@example.com"
            {...register("email", {
              required: "Email wajib diisi",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Format email tidak valid",
              },
            })}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Nomor Telepon</Label>
          <div className="flex gap-2">
            <Controller
              name="countryCode"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {countryCodes.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        <span className="flex items-center gap-2">
                          <span>{country.flag}</span>
                          <span>{country.code}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="8123456789"
              className="flex-1"
              {...register("phoneNumber", {
                required: "Nomor telepon wajib diisi",
                pattern: {
                  value: /^[0-9]{9,13}$/,
                  message: "Nomor telepon tidak valid (9-13 digit)",
                },
              })}
            />
          </div>
          {errors.phoneNumber && (
            <p className="text-sm text-destructive">
              {errors.phoneNumber.message}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Masukkan nomor tanpa kode negara
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("password", {
                required: "Password wajib diisi",
                minLength: {
                  value: 8,
                  message: "Password minimal 8 karakter",
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message:
                    "Password harus mengandung huruf besar, huruf kecil, dan angka",
                },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        {error && (
          <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
            {error.message}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Mendaftar...
            </>
          ) : (
            "Daftar Sekarang"
          )}
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Masuk di sini
          </Link>
        </div>
      </form>
    </AuthPage>
  );
}
