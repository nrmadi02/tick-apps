"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { CalendarIcon, Plus, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";

import LocationPicker from "~/components/common/location-picker";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Textarea } from "~/components/ui/textarea";
import { UploadButton } from "~/lib/uploadthing";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

import {
  CreateEventRequest,
  createEventSchema,
} from "../types/admin-event.request";

export default function AddEventForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateEventRequest>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      name: "",
      description: "",
      venue: "",
      address: "",
      city: "",
      province: "",
      country: "Indonesia",
      categories: [{ name: "", price: "", quota: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "categories",
    control: form.control,
  });

  const createEvent = api.adminEvent.create.useMutation({
    onSuccess: () => {
      toast.success("Event created successfully");
      setIsSubmitting(false);
      form.reset();
      router.push("/admin/event");
    },
    onError: (error) => {
      // Handle error (e.g., show error message)
      setIsSubmitting(false);
      console.error(error);
    },
  });

  function onSubmit(data: CreateEventRequest) {
    setIsSubmitting(true);
    createEvent.mutate(data);
  }

  const errorsCategory = (message: string) => {
    return message ? ` (${message})` : "";
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-3 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Event</CardTitle>
            <CardDescription>
              Masukkan detail informasi event yang akan dibuat.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Nama Event */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Event</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nama event" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Deskripsi */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Jelaskan detail event Anda"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tanggal Event */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Tanggal Mulai</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: id })
                            ) : (
                              <span>Pilih tanggal</span>
                            )}
                            <CalendarIcon className="ml-auto size-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Tanggal Selesai</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: id })
                            ) : (
                              <span>Pilih tanggal</span>
                            )}
                            <CalendarIcon className="ml-auto size-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < form.getValues("startDate")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Lokasi */}
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="venue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lokasi</FormLabel>
                    <FormControl>
                      <Input placeholder="Lokasi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat</FormLabel>
                    <FormControl>
                      <Input placeholder="Alamat lengkap" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kota</FormLabel>
                      <FormControl>
                        <Input placeholder="Kota" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="province"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Provinsi</FormLabel>
                      <FormControl>
                        <Input placeholder="Provinsi" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="coordinates"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pilih dari Map</FormLabel>
                    <FormControl>
                      <LocationPicker
                        onChange={field.onChange}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex w-full gap-4">
                <div className="w-full">
                  <FormField
                    control={form.control}
                    name="thumbnail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Thumbnail (opsional)</FormLabel>
                        <FormControl>
                          <div className="relative mt-2 flex h-40 w-full justify-center overflow-hidden rounded-md border border-primary transition-all hover:bg-indigo-100">
                            {field.value && (
                              <>
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  className="absolute right-2 top-2 z-50"
                                  onClick={() => field.onChange("")}
                                >
                                  <X className="size-4" />
                                </Button>
                                <Image
                                  src={field.value}
                                  alt="Thumbnail"
                                  width={200}
                                  height={200}
                                />
                              </>
                            )}
                            {!field.value && (
                              <UploadButton
                                endpoint="imageUploader"
                                className="[&_label]:bg-primary [&_label]:text-sm"
                                onClientUploadComplete={(res) => {
                                  field.onChange(res[0]?.url);
                                  toast.success("Upload Completed");
                                }}
                                onUploadError={(error: Error) => {
                                  toast.error(error.message);
                                }}
                              />
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="w-full">
                  <FormField
                    control={form.control}
                    name="banner"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Banner (opsional)</FormLabel>
                        <FormControl>
                          <div className="relative mt-2 flex h-40 w-full justify-center overflow-hidden rounded-md border border-primary transition-all hover:bg-indigo-100">
                            {field.value && (
                              <>
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  className="absolute right-2 top-2 z-50"
                                  onClick={() => field.onChange("")}
                                >
                                  <X className="size-4" />
                                </Button>
                                <Image
                                  src={field.value}
                                  alt="Thumbnail"
                                  width={200}
                                  height={200}
                                />
                              </>
                            )}
                            {!field.value && (
                              <UploadButton
                                endpoint="imageUploader"
                                className="[&_label]:bg-primary [&_label]:text-sm"
                                onClientUploadComplete={(res) => {
                                  field.onChange(res[0]?.url);
                                  toast.success("Upload Completed");
                                }}
                                onUploadError={(error: Error) => {
                                  toast.error(error.message);
                                }}
                              />
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="w-full">
                  <FormField
                    control={form.control}
                    name="poster"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Poster (opsional)</FormLabel>
                        <FormControl>
                          <div className="relative mt-2 flex h-40 w-full justify-center overflow-hidden rounded-md border border-primary transition-all hover:bg-indigo-100">
                            {field.value && (
                              <>
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  className="absolute right-2 top-2 z-50"
                                  onClick={() => field.onChange("")}
                                >
                                  <X className="size-4" />
                                </Button>
                                <Image
                                  src={field.value}
                                  alt="Thumbnail"
                                  width={200}
                                  height={200}
                                />
                              </>
                            )}
                            {!field.value && (
                              <UploadButton
                                endpoint="imageUploader"
                                className="[&_label]:bg-primary [&_label]:text-sm"
                                onClientUploadComplete={(res) => {
                                  field.onChange(res[0]?.url);
                                  toast.success("Upload Completed");
                                }}
                                onUploadError={(error: Error) => {
                                  toast.error(error.message);
                                }}
                              />
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Kategori Tiket */}
        <Card>
          <CardHeader>
            <CardTitle>Kategori Tiket</CardTitle>
            <CardDescription>
              Tambahkan kategori dan harga tiket untuk event.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-12 items-end gap-4">
                <div className="col-span-4">
                  <FormField
                    control={form.control}
                    name={`categories.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Kategori</FormLabel>
                        <FormControl>
                          <Input placeholder="VIP, Regular, dll" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-4">
                  <FormField
                    control={form.control}
                    name={`categories.${index}.price`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Harga
                          {errorsCategory(
                            form.formState.errors.categories?.[index]?.price
                              ?.message ?? "",
                          )}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-3">
                  <FormField
                    control={form.control}
                    name={`categories.${index}.quota`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Kuota
                          {errorsCategory(
                            form.formState.errors.categories?.[index]?.quota
                              ?.message ?? "",
                          )}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="1"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-1">
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => append({ name: "", price: "", quota: "" })}
            >
              <Plus className="mr-2 size-4" />
              Tambah Kategori
            </Button>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Menyimpan..." : "Buat Event"}
        </Button>
      </form>
    </Form>
  );
}
