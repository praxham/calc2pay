export const exportBillsToCSV = (bills: any[]) => {
  if (!bills || bills.length === 0) return;

  // Define the CSV headers
  const headers = ["ID", "Date", "Items", "Deductions", "Total"];

  // Map the bill data to CSV rows
  const csvRows = bills.map((bill) => {
    // Join arrays with a semicolon and wrap in quotes to prevent breaking the CSV format if commas exist
    const items = `"${bill.items?.join("; ") || ""}"`;
    const deductions = `"${bill.deductions?.join("; ") || ""}"`;
    const date = `"${new Date(bill.date).toLocaleString()}"`;

    return `${bill.id},${date},${items},${deductions},${bill.total}`;
  });

  // Combine headers and rows
  const csvString = [headers.join(","), ...csvRows].join("\n");

  // Create a Blob and trigger download
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement("a");

  downloadLink.href = url;
  downloadLink.download = `bills-${Date.now()}.csv`;

  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
};
