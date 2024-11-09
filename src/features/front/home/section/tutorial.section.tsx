"use client";

import { useState } from "react";

import { Button } from "~/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "~/components/ui/drawer";

export default function TutorialSection() {
  const [open, setOpen] = useState(false);
  return (
    <section className="p-5">
      <Button onClick={() => setOpen(!open)} className="w-full">
        Cara Membeli Tiket
      </Button>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="max-h-screen">
          <DrawerHeader>
            <DrawerTitle>Cara Membeli Tiket</DrawerTitle>
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto px-5">
            <p className="text-md">
              Tiket konser musik terbaru di atas bisa kamu dapatkan melalui Tick
              Apps. Dengan menggunakan Tick Apps, kamu tak bisa mendapatkan
              harga termurah dengan aman, mudah, dan cepat, berikut ini adalah
              beberapa langkah yang harus kamu ikuti untuk melakukan pembelian:
            </p>
            <ol className="text-md mt-2 list-decimal pl-5">
              <li>Buka halaman Tick Apps.</li>
              <li>
                Pilih menu &quot;Pemesanan Tiket&quot; dan pilih jenis tiket
                yang ingin kamu beli.
              </li>
              <li>
                Masukkan jumlah tiket yang ingin kamu beli dan pilih metode
                pembayaran yang kamu inginkan.
              </li>
              <li>
                Masukkan detail pembayaran seperti nomor kartu kredit, nama
                pemilik kartu, dan tanggal kadaluarsa kartu.
              </li>
              <li>
                Tekan tombol &quot;Beli Tiket&quot; untuk melakukan pembayaran
                dan membeli tiket.
              </li>
            </ol>
            <p className="text-md mt-2">
              Selain itu Tick Apps juga menyediakan fitur pencarian tiket, dan
              social media Tick Apps @tick_apps
            </p>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Tutup</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </section>
  );
}
