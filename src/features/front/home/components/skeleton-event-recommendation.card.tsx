import { Building2, Pin } from "lucide-react";

import { Calendar } from "~/components/ui/calendar";
import { Card, CardContent, CardFooter } from "~/components/ui/card";

export default function SkeletonEventRecommendationCard() {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="flex min-h-[300px] animate-pulse items-center justify-center rounded bg-neutral-200"></div>
        <div className="mt-2 space-y-3 p-3">
          <div className="h-6 w-3/4 animate-pulse rounded bg-neutral-200"></div>
          <div className="space-y-2">
            <div className="h-4 animate-pulse rounded bg-neutral-200"></div>
            <div className="h-4 w-5/6 animate-pulse rounded bg-neutral-200"></div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {[Calendar, Pin, Building2].map((_Icon, idx) => (
              <div key={idx} className="flex items-center gap-1">
                <div className="size-4 animate-pulse rounded bg-neutral-200"></div>
                <div className="h-4 w-16 animate-pulse rounded bg-neutral-200"></div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-2 p-3">
        <div className="h-5 w-32 animate-pulse rounded bg-neutral-200"></div>
        <div className="h-9 w-28 animate-pulse rounded bg-neutral-200"></div>
      </CardFooter>
    </Card>
  );
}
