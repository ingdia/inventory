import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Printer, FileText, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Button from '../../../shared/components/Button';

const buildCSV = (headers, rows) => {
  const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  return [headers, ...rows].map((r) => r.map(escape).join(',')).join('\n');
};

export default function ReportExportBar({ printRef, title, csvHeaders, csvRows }) {
  const handlePrint = useReactToPrint({ content: () => printRef.current });

  const handleCSV = () => {
    const csv = buildCSV(csvHeaders, csvRows);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(title, 14, 15);
    autoTable(doc, { head: [csvHeaders], body: csvRows, startY: 22, styles: { fontSize: 8 } });
    doc.save(`${title}.pdf`);
  };

  return (
    <div className="flex items-center gap-2 print:hidden">
      <Button variant="ghost" onClick={handlePrint} className="py-2 px-3 text-xs gap-1.5">
        <Printer size={13} /> Print
      </Button>
      <Button variant="ghost" onClick={handleCSV} className="py-2 px-3 text-xs gap-1.5">
        <Download size={13} /> CSV
      </Button>
      <Button variant="ghost" onClick={handlePDF} className="py-2 px-3 text-xs gap-1.5">
        <FileText size={13} /> PDF
      </Button>
    </div>
  );
}
