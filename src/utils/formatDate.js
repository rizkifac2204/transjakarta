function dateIsValid(date) {
  return date instanceof Date && !isNaN(date);
}

export const formatedDate = (date, hari = false, showTime = false) => {
  if (!date) return "-";

  const d = new Date(date);
  if (!dateIsValid(d)) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    weekday: hari ? "long" : undefined,
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: showTime ? "2-digit" : undefined,
    minute: showTime ? "2-digit" : undefined,
    hourCycle: "h23",
  }).format(d);
};

export function formatOutputTime(date) {
  if (!date) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}
