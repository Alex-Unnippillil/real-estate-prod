"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { resetPassword, confirmResetPassword } from "aws-amplify/auth";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const requestSchema = z.object({
  email: z.string().email(),
});

const confirmSchema = z.object({
  code: z.string().min(6, "Code must be at least 6 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RequestForm = z.infer<typeof requestSchema>;
type ConfirmForm = z.infer<typeof confirmSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const [stage, setStage] = useState<"request" | "confirm">("request");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const requestForm = useForm<RequestForm>({
    resolver: zodResolver(requestSchema),
    defaultValues: { email: "" },
  });

  const confirmForm = useForm<ConfirmForm>({
    resolver: zodResolver(confirmSchema),
    defaultValues: { code: "", password: "" },
  });

  const handleRequest = async (data: RequestForm) => {
    setError(null);
    try {
      await resetPassword({ username: data.email });
      setEmail(data.email);
      setStage("confirm");
    } catch (err: any) {
      setError(err.message || "Failed to send reset code");
    }
  };

  const handleConfirm = async (data: ConfirmForm) => {
    setError(null);
    try {
      await confirmResetPassword({
        username: email,
        confirmationCode: data.code,
        newPassword: data.password,
      });
      router.push("/signin");
    } catch (err: any) {
      setError(err.message || "Failed to reset password");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-center">Reset Password</h1>
        {stage === "request" ? (
          <Form {...requestForm}>
            <form
              onSubmit={requestForm.handleSubmit(handleRequest)}
              className="space-y-4"
            >
              <FormField
                control={requestForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full">
                Send Code
              </Button>
            </form>
          </Form>
        ) : (
          <Form {...confirmForm}>
            <form
              onSubmit={confirmForm.handleSubmit(handleConfirm)}
              className="space-y-4"
            >
              <FormField
                control={confirmForm.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={confirmForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full">
                Reset Password
              </Button>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
}
