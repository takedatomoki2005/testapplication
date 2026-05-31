import type { SendStatus } from "@/data/types";

export function isPendingSendStatus(status: SendStatus): boolean {
  return status === "unsent";
}

export function isHandledSendStatus(status: SendStatus): boolean {
  return status === "sent" || status === "no_line_exchange" || status === "no_contact";
}

/** Badge on the thank-you list */
export function listStatusLabel(status: SendStatus): string {
  return isPendingSendStatus(status) ? "対応前" : "対応済み";
}

/** Outcome shown in swipe stamps and detail modal */
export function outcomeLabel(status: SendStatus): string {
  switch (status) {
    case "sent":
      return "送信済み ✓";
    case "no_line_exchange":
      return "LINE未交換";
    case "no_contact":
      return "連絡しない";
    default:
      return "対応前";
  }
}
