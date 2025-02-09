"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import AddEventForm from "../components/add-event.form";

export default function EditEventSection(props: { id: string }) {
  const router = useRouter();
  return (
    <div>
      <div className="my-5 flex items-center">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="size-5" />
          <p className="text-sm font-bold">Back to Event</p>
        </button>
      </div>
      <AddEventForm isEdit id={props.id} />
    </div>
  );
}
