"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Separator } from "~/components/ui/separator";
import { useToast } from "~/hooks/use-toast";

const checkoutFormSchema = z.object({
  fullName: z.string().min(3, "Nama harus minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  phone: z.string().min(10, "Nomor telepon tidak valid"),
  paymentMethod: z.enum(["shopeepay", "dana", "gopay"], {
    required_error: "Pilih metode pembayaran",
  }),
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

// E-wallet payment methods
const ewalletMethods = [
  {
    id: "shopeepay",
    name: "ShopeePay",
    description: "Bayar dengan ShopeePay",
    logo: "/logo-shoopepay.png", // Add your logo paths
    bgColor: "bg-rose-50",
    borderColor: "border-rose-200",
    iconColor: "text-rose-500",
  },
  {
    id: "dana",
    name: "DANA",
    description: "Bayar dengan DANA",
    logo: "/logo-dana.png",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    iconColor: "text-blue-500",
  },
  {
    id: "gopay",
    name: "GoPay",
    description: "Bayar dengan GoPay",
    logo: "/logo-gopay.png",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    iconColor: "text-green-500",
  },
] as const;

export default function CheckoutEventSection() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      paymentMethod: undefined,
    },
  });

  // Dummy order details
  const orderDetails = {
    items: [
      {
        name: "Tiket Konser Coldplay",
        type: "CAT 1",
        price: 5000000,
        quantity: 1,
      },
    ],
    subtotal: 5000000,
    tax: 550000, // 11% tax
    total: 5550000,
  };

  async function onSubmit(data: CheckoutFormValues) {
    setLoading(true);

    try {
      // Call Midtrans API for e-wallet payment
      const response = await fetch("/api/payment/ewallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          amount: orderDetails.total,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Pembayaran gagal");
      }

      // Redirect to e-wallet payment page
      if (result.redirectUrl) {
        window.location.href = result.redirectUrl;
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal memproses pembayaran. Silakan coba lagi.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-5">
      <div>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 font-bold"
        >
          <ArrowLeft />
          Kembali
        </button>
      </div>
      <h1 className="my-3 text-2xl font-bold">Checkout</h1>

      <div className="grid gap-8">
        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Detail Pesanan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {orderDetails.items.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.type}</p>
                  <p className="text-sm">Jumlah: {item.quantity}</p>
                </div>
                <p className="font-medium">
                  Rp {item.price.toLocaleString("id-ID")}
                </p>
              </div>
            ))}
            <Separator className="my-4" />
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>Rp {orderDetails.subtotal.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>PPN (11%)</span>
                <span>Rp {orderDetails.tax.toLocaleString("id-ID")}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between text-lg font-medium">
                <span>Total</span>
                <span>Rp {orderDetails.total.toLocaleString("id-ID")}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Form */}
        <Card>
          <CardHeader>
            <CardTitle>Pembayaran</CardTitle>
            <CardDescription>Pilih e-wallet untuk pembayaran</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Payment Method Selection */}
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="grid gap-4"
                        >
                          {ewalletMethods.map((method) => (
                            <FormItem
                              key={method.id}
                              className="flex items-center space-x-3 space-y-0"
                            >
                              <FormControl>
                                <RadioGroupItem value={method.id} />
                              </FormControl>
                              <FormLabel
                                className={`flex flex-1 cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors ${method.bgColor} ${method.borderColor} hover:bg-accent`}
                              >
                                <div className="space-y-1">
                                  <p className="font-medium">{method.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {method.description}
                                  </p>
                                </div>
                                <div className="relative size-12">
                                  <Image
                                    src={method.logo}
                                    alt={method.name}
                                    fill
                                    className="object-contain"
                                  />
                                </div>
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Customer Details */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Lengkap</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Masukkan nama lengkap"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Masukkan email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nomor Telepon</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="Masukkan nomor telepon"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    `Bayar Rp ${orderDetails.total.toLocaleString("id-ID")}`
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
