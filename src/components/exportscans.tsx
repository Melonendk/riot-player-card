type CheckIn = {
  riotId: string;
  checkedInAt: string;
};

export function exportCheckIns(checkIns: CheckIn[]) {
  const headers = ["Riot ID"];

  const rows = checkIns.map((player) => [
    player.riotId,
  ]);

  // Escape CSV fields correctly, including commas and quotes.
  const escapeCsv = (value: string) =>
    `"${value.replace(/"/g, '""')}"`;

  const csv = [headers, ...rows]
    .map((row) => row.map(escapeCsv).join(","))
    .join("\r\n");

  // UTF-8 BOM helps Excel display Japanese and other Unicode correctly.
  const blob = new Blob(["\uFEFF", csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `check-ins-${new Date()
    .toISOString()
    .slice(0, 10)}.csv`;

  link.click();
  URL.revokeObjectURL(url);
}