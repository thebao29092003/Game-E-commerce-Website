import { format, parse } from "date-fns";

export function formatDate(dateInput) {
  const date = parse(dateInput, "yyyy-MM-dd", new Date()); // Chuyển string → Date object

  return format(date, "dd/MM/yyyy");
}

export function formatDateMonth(dateInput) {
  const date = parse(dateInput, "yyyy-MM", new Date()); // Chuyển string → Date object

  return format(date, "MM/yyyy");
}