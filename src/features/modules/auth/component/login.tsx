import { useEffect, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useLoginMutation } from "../api";
import { useForm } from "react-hook-form";
import { LoginFormData, sanitizeInput } from "@/features/types/user";
import { AuthPage } from "./formAuth";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate, isPending, error } = useLoginMutation();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm<LoginFormData>({
    mode: "onChange",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const watchedUsername = watch("username");
  const watchedPassword = watch("password");

  // Sanitize username input on change
  useEffect(() => {
    if (watchedUsername) {
      const sanitized = sanitizeInput(watchedUsername);
      if (sanitized !== watchedUsername) {
        setValue("username", sanitized, { shouldValidate: true });
      }
    }
  }, [watchedUsername, setValue]);

  // Sanitize password input on change
  useEffect(() => {
    if (watchedPassword) {
      const sanitized = sanitizeInput(watchedPassword);
      if (sanitized !== watchedPassword) {
        setValue("password", sanitized, { shouldValidate: true });
      }
    }
  }, [watchedPassword, setValue]);

  const onSubmit = (data: LoginFormData) => {
    mutate(data);
  };

  return (
    <AuthPage
      title="Selamat Datang Kembali"
      description="Masuk ke akun Anda untuk melanjutkan."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Field */}
        <div className="grid gap-2">
          <Label htmlFor="username" className="text-accent/90">
            Username
          </Label>
          <Input
            id="username"
            type="text"
            className="text-white"
            placeholder="Masukkan username"
            {...register("username", {
              required: "Username is required",
              minLength: {
                value: 3,
                message: "Username must be at least 3 characters",
              },
              maxLength: {
                value: 30,
                message: "Username cannot exceed 30 characters",
              },
              pattern: {
                value: /^[a-zA-Z0-9_]+$/,
                message:
                  "Username can only contain letters, numbers, and underscores",
              },
            })}
            aria-invalid={errors.username ? "true" : "false"}
          />
          {errors.username && (
            <p className="text-sm text-red-500">{errors.username.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-accent/90">
              Password
            </Label>
            <Link
              href="/forgot-password"
              className="text-sm text-accent-200/90 underline-offset-4 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="text-white"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
              aria-invalid={errors.password ? "true" : "false"}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
            {error.message}
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full "
          disabled={!isValid || isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>

        {/* Optional: Sign up link */}
        <div className="text-center text-sm text-accent">
          Belum Punya Akun?{" "}
          <Link href="/register" className="text-accent/70 underline">
            Daftar
          </Link>
        </div>
      </form>
    </AuthPage>
  );
}
