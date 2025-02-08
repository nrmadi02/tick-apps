export interface IEvent {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  venue: string;
  city: string;
  status: "DRAFT" | "PUBLISHED" | "CANCELLED";
  availableTickets: number;
  categories: Array<{
    name: string;
    price: number;
  }>;
}
