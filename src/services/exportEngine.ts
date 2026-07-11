import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import Papa from 'papaparse';

/**
 * Exports an array of objects to a CSV file.
 * @param data Array of objects to export
 * @param filename Name of the file (without .csv extension)
 */
export const exportToCSV = (data: any[], filename: string) => {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Exports structured table data to a PDF file.
 * @param title Document title
 * @param columns Array of column headers
 * @param data 2D array of row data
 * @param filename Name of the file (without .pdf extension)
 */
export const exportTableToPDF = (title: string, columns: string[], data: any[][], filename: string) => {
  const doc = new jsPDF();
  
  // Add Title
  doc.setFontSize(18);
  doc.setTextColor(7, 19, 61); // brand-navy
  doc.text(title, 14, 22);
  
  // Add Timestamp
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
  
  autoTable(doc, {
    startY: 35,
    head: [columns],
    body: data,
    theme: 'grid',
    styles: { 
      fontSize: 9, 
      cellPadding: 4,
      font: 'helvetica'
    },
    headStyles: { 
      fillColor: [14, 99, 139], // brand-azure
      textColor: 255,
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250]
    }
  });
  
  doc.save(`${filename}.pdf`);
};

/**
 * Takes a screenshot of an HTML element and exports it as a PDF.
 * Useful for complex visual layouts like charts or portfolios.
 * @param elementId The DOM ID of the element to capture
 * @param filename Name of the file (without .pdf extension)
 */
export const exportViewToPDF = async (elementId: string, filename: string) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found.`);
    return;
  }
  
  try {
    const canvas = await html2canvas(element, { 
      scale: 2, // Higher resolution
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });
    
    const imgData = canvas.toDataURL('image/png');
    
    // A4 dimensions in mm
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error('Error generating PDF from view:', error);
  }
};

export const exportLearningStoryPDF = (entry: { title: string; child: string; educator: string; date: string; text: string; outcomes: string[] }) => {
  const doc = new jsPDF();
  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth() - margin * 2;
  let y = margin;

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text('Sunshine Early Learning Centre', margin, y);
  y += 6;
  doc.setFontSize(8);
  doc.text('Learning Story', margin, y);
  y += 12;

  doc.setFontSize(18);
  doc.setTextColor(30, 30, 60);
  const titleLines = doc.splitTextToSize(entry.title, pageWidth);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 8 + 4;

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Child: ${entry.child}  |  Educator: ${entry.educator}  |  Date: ${entry.date}`, margin, y);
  y += 10;

  doc.setDrawColor(200);
  doc.line(margin, y, margin + pageWidth, y);
  y += 8;

  doc.setFontSize(11);
  doc.setTextColor(40, 40, 40);
  const textLines = doc.splitTextToSize(entry.text, pageWidth);
  doc.text(textLines, margin, y);
  y += textLines.length * 5.5 + 8;

  if (entry.outcomes.length > 0) {
    doc.setFontSize(10);
    doc.setTextColor(14, 99, 139);
    doc.text('EYLF Outcomes: ' + entry.outcomes.join(', '), margin, y);
  }

  doc.save(`${entry.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
};

export const exportIncidentPDF = (incident: { date: string; time?: string; child: string; type: string; location?: string; description: string; injuryDetails?: string; bodyArea?: string; firstAid?: string; action: string; educatorOnDuty?: string; witnesses?: string; parentNotified: boolean; parentNotifiedTime?: string; status: string }) => {
  const doc = new jsPDF();
  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth() - margin * 2;
  let y = margin;

  doc.setFontSize(16);
  doc.setTextColor(180, 55, 43);
  doc.text('Incident Report', margin, y);
  y += 10;

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Date: ${incident.date}${incident.time ? ` at ${incident.time}` : ''}  |  Status: ${incident.status}`, margin, y);
  y += 12;

  const fields: [string, string][] = [
    ['Child', incident.child],
    ['Incident Type', incident.type],
    ...(incident.location ? [['Location', incident.location] as [string, string]] : []),
    ['Description', incident.description],
    ...(incident.injuryDetails && incident.injuryDetails !== 'N/A' ? [['Injury Details', `${incident.injuryDetails} (${incident.bodyArea || 'N/A'})`] as [string, string]] : []),
    ...(incident.firstAid ? [['First Aid', incident.firstAid] as [string, string]] : []),
    ['Action Taken', incident.action],
    ...(incident.educatorOnDuty ? [['Educator on Duty', incident.educatorOnDuty] as [string, string]] : []),
    ...(incident.witnesses ? [['Witnesses', incident.witnesses] as [string, string]] : []),
    ['Parent Notified', incident.parentNotified ? `Yes${incident.parentNotifiedTime ? ` at ${incident.parentNotifiedTime}` : ''}` : 'No'],
  ];

  fields.forEach(([label, value]) => {
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(label.toUpperCase(), margin, y);
    y += 5;
    doc.setFontSize(11);
    doc.setTextColor(40, 40, 40);
    const lines = doc.splitTextToSize(value, pageWidth);
    doc.text(lines, margin, y);
    y += lines.length * 5.5 + 6;
  });

  y += 10;
  doc.setFontSize(9);
  doc.setTextColor(150);
  doc.text('Educator Signature: ________________________    Date: ___________', margin, y);
  y += 8;
  doc.text('Parent Signature:   ________________________    Date: ___________', margin, y);

  doc.save(`Incident_Report_${incident.date}_${incident.child.replace(/\s/g, '_')}.pdf`);
};
