import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const downloadInvoicePDF = (invoice: any) => {
  const doc = new jsPDF();
  
  // Custom Fonts (Using standard helvetica but styling it well)
  const font = 'helvetica';
  
  // Theme Colors from Design System
  const primaryNavy = [10, 25, 47]; // #0A192F
  const electricBlue = [37, 99, 235]; // #2563EB
  const emeraldGreen = [16, 185, 129]; // #10B981
  const slateGray = [100, 116, 139]; // #64748B
  const lightGray = [241, 245, 249]; // #F1F5F9
  
  // 1. Header Banner
  doc.setFillColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.rect(0, 0, 210, 40, 'F'); // Full width banner (A4 width is 210mm)
  
  // Header Text
  doc.setFont(font, 'bold');
  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.text('Elevation by Prudata Tech', 14, 20);
  
  doc.setFont(font, 'normal');
  doc.setFontSize(10);
  doc.setTextColor(200, 200, 200);
  doc.text('123 Education Boulevard, New Delhi, 110001', 14, 28);
  doc.text('Tel: +91 98765 43210 | Email: accounts@elevation.edu', 14, 33);
  
  // Invoice/Salary Badge
  doc.setFillColor(electricBlue[0], electricBlue[1], electricBlue[2]);
  
  const isSalary = invoice.receiptType === 'Salary';
  const badgeText = isSalary ? 'SALARY SLIP' : 'INVOICE';
  
  doc.roundedRect(150, 12, 45, 16, 2, 2, 'F');
  doc.setFont(font, 'bold');
  doc.setFontSize(14); // slightly smaller to fit "SALARY SLIP"
  doc.setTextColor(255, 255, 255);
  doc.text(badgeText, 172.5, 22.5, { align: 'center' });
  
  // 2. Invoice Meta Data
  doc.setFont(font, 'bold');
  doc.setFontSize(12);
  doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.text(isSalary ? 'Salary Details' : 'Invoice Details', 14, 55);
  
  doc.setFont(font, 'normal');
  doc.setFontSize(10);
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  doc.text(isSalary ? `Transaction ID:` : `Invoice No:`, 14, 62);
  doc.text(`Date:`, 14, 68);
  
  doc.setFont(font, 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text(invoice.id, 45, 62);
  doc.text(invoice.date, 45, 68);
  
  // 3. Billed To Area (with a soft background box)
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.roundedRect(120, 48, 75, 25, 3, 3, 'F');
  
  doc.setFont(font, 'bold');
  doc.setFontSize(10);
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  doc.text(isSalary ? 'PAID TO' : 'BILLED TO', 125, 55);
  
  doc.setFont(font, 'bold');
  doc.setFontSize(14);
  doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.text(invoice.student || invoice.staffName, 125, 63);
  
  doc.setFont(font, 'normal');
  doc.setFontSize(10);
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  doc.text(isSalary ? `Designation: ${invoice.designation}` : `Class: ${invoice.cls}`, 125, 69);
  
  // Helper to fix the Rupee symbol which isn't supported by basic PDF fonts
  const formatAmt = (amt: string) => amt.replace('₹', 'Rs. ');

  // 4. Line Items Table (using autoTable for beautiful grids)
  autoTable(doc, {
    startY: 85,
    headStyles: { 
      fillColor: primaryNavy as [number, number, number], 
      textColor: [255, 255, 255], 
      fontStyle: 'bold',
      fontSize: 11,
      cellPadding: 6
    },
    bodyStyles: { 
      textColor: [30, 30, 30],
      fontSize: 11,
      cellPadding: 6
    },
    alternateRowStyles: {
      fillColor: [250, 250, 250]
    },
    head: [['Description', 'Amount']],
    body: [
      [invoice.type, formatAmt(invoice.amount)]
    ],
    theme: 'grid',
    styles: { lineColor: [220, 220, 220], lineWidth: 0.1 }
  });
  
  const finalY = (doc as any).lastAutoTable.finalY + 15;
  
  // 5. Totals Section
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.roundedRect(130, finalY, 65, 35, 3, 3, 'F');
  
  doc.setFont(font, 'normal');
  doc.setFontSize(11);
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  doc.text('Subtotal:', 135, finalY + 8);
  doc.setFont(font, 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text(formatAmt(invoice.amount), 190, finalY + 8, { align: 'right' });
  
  doc.setDrawColor(200, 200, 200);
  doc.line(135, finalY + 12, 190, finalY + 12);
  
  doc.setFont(font, 'bold');
  doc.setFontSize(14);
  doc.setTextColor(electricBlue[0], electricBlue[1], electricBlue[2]);
  doc.text('Total Paid:', 135, finalY + 22);
  doc.setFontSize(16);
  doc.text(formatAmt(invoice.amount), 190, finalY + 22, { align: 'right' });
  
  doc.setFont(font, 'normal');
  doc.setFontSize(9);
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  doc.text(`Payment Mode: ${invoice.mode}`, 190, finalY + 30, { align: 'right' });
  
  // 6. Footer & Signatory
  const pageHeight = doc.internal.pageSize.height;
  
  // Status Badge
  const isPaid = invoice.status === 'Paid';
  const statusColor = isPaid ? emeraldGreen : [239, 68, 68];
  doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.roundedRect(14, pageHeight - 45, 30, 10, 2, 2, 'F');
  doc.setFont(font, 'bold');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text(invoice.status.toUpperCase(), 29, pageHeight - 38, { align: 'center' });
  
  doc.setFont(font, 'normal');
  doc.setFontSize(10);
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  doc.text('Thank you for your timely payment. This is a computer', 14, pageHeight - 25);
  doc.text('generated invoice and does not require a physical signature.', 14, pageHeight - 20);
  
  // Signatory
  doc.setDrawColor(slateGray[0], slateGray[1], slateGray[2]);
  doc.line(145, pageHeight - 30, 195, pageHeight - 30);
  doc.setFont(font, 'bold');
  doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.text('Authorized Signatory', 195, pageHeight - 24, { align: 'right' });
  doc.setFont(font, 'normal');
  doc.setFontSize(9);
  doc.setTextColor(slateGray[0], slateGray[1], slateGray[2]);
  doc.text('Elevation Finance Dept.', 195, pageHeight - 19, { align: 'right' });

  doc.save(`Elevation_Invoice_${invoice.id}.pdf`);
};

export const exportToPDF = (elementId: string, filename: string) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found.`);
    return;
  }
  
  // Create a hidden iframe for perfect print isolation
  const iframe = document.createElement('iframe');
  iframe.style.position = 'absolute';
  iframe.style.width = '0px';
  iframe.style.height = '0px';
  iframe.style.border = 'none';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    document.body.removeChild(iframe);
    return;
  }

  // Copy all stylesheets from parent document to ensure Tailwind works
  const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
    .map(style => style.outerHTML)
    .join('\n');

  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${filename}</title>
        ${styles}
        <style>
          @page { margin: 0.5in; size: auto; }
          body { 
            margin: 0; 
            padding: 0; 
            background: white !important; 
          }
          * { 
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important; 
          }
          /* Ensure no dark mode overrides */
          @media print {
            body { background-color: white !important; color: black !important; }
          }
        </style>
      </head>
      <body>
        ${element.outerHTML}
      </body>
    </html>
  `);
  doc.close();

  // Wait a moment for stylesheets to apply in the iframe, then print
  setTimeout(() => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
    
    // Cleanup after print dialog is closed
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    }, 1000);
  }, 500);
};

export const exportToCSV = (data: any[], filename: string) => {
  if (!data || !data.length) {
    alert('No data available to export.');
    return;
  }
  
  // Extract headers
  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(',')];

  for (const row of data) {
    const values = headers.map(header => {
      let val = row[header];
      if (val === null || val === undefined) {
        val = '';
      } else if (typeof val === 'object') {
        // Flatten arrays or objects to prevent [object Object] in CSV
        val = JSON.stringify(val);
      }
      const escaped = ('' + val).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }

  const csvContent = "\uFEFF" + csvRows.join('\n'); // Add BOM for Excel UTF-8 support
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = `${filename}.csv`;
  
  document.body.appendChild(a);
  a.click();
  
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
