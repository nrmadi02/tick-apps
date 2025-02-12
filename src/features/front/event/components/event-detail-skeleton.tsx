import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";

export default function EventDetailSkeleton() {
  return (
    <div className="container mx-auto p-4">
      <Card className="mx-auto w-full max-w-4xl">
        <CardHeader>
          <div className="h-8 w-2/3 animate-pulse rounded-lg bg-neutral-200" />
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Image placeholder */}
          <div className="h-64 w-full animate-pulse rounded-lg bg-neutral-200" />

          {/* Description placeholder */}
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-neutral-200" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-neutral-200" />
          </div>

          {/* Event details placeholder */}
          <div className="flex flex-col space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="h-4 w-20 animate-pulse rounded bg-neutral-200" />
                <div className="h-4 w-40 animate-pulse rounded bg-neutral-200" />
              </div>
            ))}
          </div>

          {/* Tickets section placeholder */}
          <div className="border-t pt-4">
            <div className="mb-4 h-6 w-32 animate-pulse rounded bg-neutral-200" />

            {/* Ticket items */}
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between border-b py-4"
              >
                <div className="space-y-2">
                  <div className="h-5 w-32 animate-pulse rounded bg-neutral-200" />
                  <div className="h-4 w-24 animate-pulse rounded bg-neutral-200" />
                  <div className="h-6 w-28 animate-pulse rounded bg-neutral-200" />
                </div>

                {/* Quantity controls placeholder */}
                <div className="flex items-center space-x-2">
                  <div className="size-9 animate-pulse rounded bg-neutral-200" />
                  <div className="h-9 w-16 animate-pulse rounded bg-neutral-200" />
                  <div className="size-9 animate-pulse rounded bg-neutral-200" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-stretch">
          <div className="mb-4 h-7 w-40 animate-pulse rounded bg-neutral-200" />
          <div className="h-10 w-full animate-pulse rounded bg-neutral-200" />
        </CardFooter>
      </Card>
    </div>
  );
}
