import type { bill } from "@/types";

export const printBill = (bill: bill, upiId: string) => {
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.top = "-9999px";
  iframe.style.left = "-9999px";
  iframe.style.width = "0px";
  iframe.style.height = "0px";
  iframe.style.border = "none";
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!doc) return;

  const itemRows = (bill.items || [])
    .map(
      (item, idx) => `
        <div class="row">
          <span>Item ${idx + 1}</span>
          <span>${item}</span>
        </div>
      `,
    )
    .join("");

  const deductionRows = (bill.deductions || [])
    .map(
      (ded, idx) => `
        <div class="row">
          <span>Ded ${idx + 1}</span>
          <span>-${ded}</span>
        </div>
      `,
    )
    .join("");

  // Modern replacement for doc.write()
  doc.head.innerHTML = `
    <meta charset="UTF-8" />
    <title>Receipt-${bill.id}</title>
    <style>
      @page {
        margin: 0;
      }
      body {
        font-family: 'Courier New', Courier, monospace;
        color: #000;
        background: #fff;
        margin: 0;
        padding: 10px;
        max-width: 320px; 
        font-size: 18px;
        font-weight: bold;
        line-height: 1.4;
      }
      .center {
        text-align: center;
      }
      .dashed-line {
        border-bottom: 2px dashed #000;
        margin: 10px 0;
      }
      .row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 4px;
      }
      .total-row {
        font-size: 22px;
        margin-top: 5px;
      }
      .header-text {
        font-size: 24px;
        margin-bottom: 5px;
      }
      .meta-text {
        font-size: 14px;
        margin-bottom: 15px;
      }
    </style>
  `;

  doc.body.innerHTML = `
    <div class="center">
      <div class="header-text">BILL</div>
      <div class="meta-text">
        Bill No: ${bill.id}<br/>
        Date: ${new Date().toLocaleDateString("en-IN")} ${new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
      </div>
    </div>

    <div class="dashed-line"></div>
    
    <div class="row">
      <span>ITEM</span>
      <span>Rs</span>
    </div>
    
    <div class="dashed-line"></div>

    ${itemRows}
    ${deductionRows}

    <div class="dashed-line"></div>

    <div class="row total-row">
      <span>Total:</span>
      <span>${bill.total}</span>
    </div>

    <div class="dashed-line"></div>
    
    <div class="center" style="margin-top: 15px; font-size: 14px;">
      ${upiId ? `Recived On: ${upiId}<br/>` : ""}
      Thank you for visiting!
    </div>
  `;

  iframe.contentWindow?.focus();
  setTimeout(() => {
    iframe.contentWindow?.print();
    document.body.removeChild(iframe);
  }, 250);
};
