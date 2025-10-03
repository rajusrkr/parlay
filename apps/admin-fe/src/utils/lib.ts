export function dateFormater({ timestamp }: { timestamp: number }) {
    const date = new Date(timestamp * 1000);
    const formatted = date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true
    }).replace(",", "")

    return formatted
}