import { z } from "zod";

// Schema for a single ticket selection
export const ticketSelectionSchema = z.object({
  name: z.string({
    required_error: "Nama kategori tiket wajib diisi",
    invalid_type_error: "Nama kategori tiket harus berupa text",
  }),
  price: z
    .string({
      required_error: "Harga tiket wajib diisi",
      invalid_type_error: "Harga tiket harus berupa text",
    })
    .regex(/^\d+$/, {
      message: "Harga tiket harus berupa angka",
    }),
  quantity: z
    .number({
      required_error: "Jumlah tiket wajib diisi",
      invalid_type_error: "Jumlah tiket harus berupa angka",
    })
    .int({
      message: "Jumlah tiket harus berupa bilangan bulat",
    })
    .positive({
      message: "Jumlah tiket harus lebih dari 0",
    }),
});

// Schema for create order request
export const createOrderSchema = z.object({
  eventId: z
    .string({
      required_error: "ID event wajib diisi",
      invalid_type_error: "ID event harus berupa text",
    })
    .uuid({
      message: "Format ID event tidak valid",
    }),
  selections: z
    .array(ticketSelectionSchema, {
      required_error: "Pilihan tiket wajib diisi",
      invalid_type_error: "Pilihan tiket harus berupa array",
    })
    .min(1, {
      message: "Minimal harus memilih 1 tiket",
    }),
});

// Export type for TypeScript usage
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type TicketSelection = z.infer<typeof ticketSelectionSchema>;
