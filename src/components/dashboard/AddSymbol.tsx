import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// 1. Update schema to use 'adminPassword'
const formSchema = z.object({
  symbol: z
    .string()
    .min(1, "Symbol is required")
    .max(10)
    .toUpperCase(),
  type: z.enum(["stock", "crypto"], { required_error: "Type is required" }),
  adminPassword: z.string().min(1, "Admin password is required"), // Changed from secretKey
});

type FormData = z.infer<typeof formSchema>;

// 2. Update API submission function
const addSymbol = async ({ symbol, type, adminPassword }: FormData) => {
  const { data } = await axios.post(
    `${API_URL}/api/v1/add-symbol`,
    {
      symbol: symbol,
      type: type,
    },
    {
      headers: {
        "X-Admin-Password": adminPassword, // Changed from X-Task-Secret
        "Content-Type": "application/json",
      },
    },
  );
  return data;
};

export const AddSymbol = () => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symbol: "",
      type: "stock",
      adminPassword: "", // 3. Update default value
    },
  });

  const mutation = useMutation({
    mutationFn: addSymbol,
    // ... (onSuccess, onError, onSettled are the same) ...
    onSuccess: (data) => {
      toast.success(data.message || "Symbol added successfully!");
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["search"] });
    },
    onError: (error: any) => {
      const detail = error.response?.data?.detail || "An error occurred.";
      toast.error(`Failed to add symbol: ${detail}`);
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const onSubmit = (values: FormData) => {
    setIsLoading(true);
    toast.info(`Attempting to add ${values.symbol}...`);
    mutation.mutate(values);
  };

  return (
    <Card className="glass-card p-6 animate-fade-in-up">
      <CardHeader className="p-0 mb-4">
        <CardTitle className="text-lg font-semibold">Add New Symbol</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* ... (Symbol and Type fields are the same) ... */}
            <FormField
              control={form.control}
              name="symbol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Symbol</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., AAPL, ETH" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="stock">Stock</SelectItem>
                      <SelectItem value="crypto">Crypto</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* 4. Update the password field */}
            <FormField
              control={form.control}
              name="adminPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admin Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Admin Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Adding..." : "Add Symbol"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};