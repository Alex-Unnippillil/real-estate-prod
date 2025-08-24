"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { confirmSignUp } from "aws-amplify/auth";
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

export const dynamic = "force-dynamic";

const confirmSchema = z.object({
  email: z.string().email(),
  code: z.string().min(6, "Code must be at least 6 characters"),
});

type ConfirmForm = z.infer<typeof confirmSchema>;

export default function ConfirmSignUpPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const form = useForm<ConfirmForm>({
    resolver: zodResolver(confirmSchema),
    defaultValues: {
      email: "",
      code: "",
    },
  });

  const onSubmit = async (data: ConfirmForm) => {
    setError(null);
    try {
      await confirmSignUp({
        username: data.email,
        confirmationCode: data.code,
      });
      router.push("/signin");
    } catch (err: any) {
      setError(err.message || "Failed to confirm sign up");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-center">Confirm Sign Up</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
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
            <FormField
              control={form.control}
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
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full">
              Confirm
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
