import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale"; // Optional: dùng tiếng Việt

export function formatDate(dateInput) {
  const date = new Date(dateInput);
  return formatDistanceToNow(date, { locale: vi });
}
