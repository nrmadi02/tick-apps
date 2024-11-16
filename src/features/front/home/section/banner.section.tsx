"use client";

import Autoplay from "embla-carousel-autoplay";
import { useEffect, useState } from "react";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "~/components/ui/carousel";
import { cn } from "~/lib/utils";

export const BannerSection = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <section>
      <Carousel
        setApi={setApi}
        plugins={[Autoplay({ delay: 2000 })]}
        opts={{ loop: true }}
      >
        <CarouselContent className="-ml-4">
          <CarouselItem className="pl-4">
            <div className="flex min-h-[200px] items-center justify-center rounded bg-neutral-100">
              <p className="text-2xl font-bold text-neutral-800">1</p>
            </div>
          </CarouselItem>
          <CarouselItem className="pl-4">
            <div className="flex min-h-[200px] items-center justify-center rounded bg-neutral-100">
              <p className="text-2xl font-bold text-neutral-800">2</p>
            </div>
          </CarouselItem>
          <CarouselItem className="pl-4">
            <div className="flex min-h-[200px] items-center justify-center rounded bg-neutral-100">
              <p className="text-2xl font-bold text-neutral-800">3</p>
            </div>
          </CarouselItem>
        </CarouselContent>
      </Carousel>
      <div className="mt-2 flex w-full items-center justify-center">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "size-2 rounded-full bg-purple-400 transition-all",
              current === 1 && "w-4 bg-primary",
            )}
          />
          <div
            className={cn(
              "size-2 rounded-full bg-purple-400 transition-all",
              current === 2 && "w-4 bg-primary",
            )}
          />
          <div
            className={cn(
              "size-2 rounded-full bg-purple-400 transition-all",
              current === 3 && "w-4 bg-primary",
            )}
          />
        </div>
      </div>
    </section>
  );
};
