import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Asset, License, Accessory, Consumable, ActivityLog, EventItem } from '../types';

export const exportAssetsToCSV = (assets: Asset[], filename = 'acipl_ipnet_assets') => {
  const headers = ['Asset Tag', 'Name', 'Model', 'Category', 'Serial', 'Status', 'Assigned To', 'Location', 'Purchase Date', 'Cost'];
  const rows = assets.map(a => [
    a.assetTag,
    `"${(a.name || '').replace(/"/g, '""')}"`,
    `"${(a.model || '').replace(/"/g, '""')}"`,
    a.category,
    a.serial || 'N/A',
    a.status,
    a.assignedToName ? `"${a.assignedToName.replace(/"/g, '""')}"` : 'Unassigned',
    `"${(a.location || '').replace(/"/g, '""')}"`,
    a.purchaseDate,
    a.purchaseCost ?? 0
  ]);
  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportAssetsToPDF = (assets: Asset[], title = 'Hardware Assets Inventory Report') => {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  const totalValue = assets.reduce((sum, a) => sum + (a.purchaseCost || 0), 0);
  const deployedCount = assets.filter(a => a.status === 'Deployed').length;
  const readyCount = assets.filter(a => a.status === 'Ready to Deploy').length;
  const repairCount = assets.filter(a => a.status === 'In Repair').length;

  // Header Banner
  doc.setFillColor(15, 23, 42); // Slate 900
  doc.rect(0, 0, 297, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('ACIPL/IPNET IMS', 14, 12);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(186, 230, 253);
  doc.text(title, 14, 18);

  const dateStr = `Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text(dateStr, 297 - 14 - doc.getTextWidth(dateStr), 15);

  // Summary Metrics Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, 28, 269, 14, 2, 2, 'FD');

  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'bold');
  doc.text(`Total Assets: ${assets.length}`, 18, 37);
  doc.text(`Deployed: ${deployedCount}`, 68, 37);
  doc.text(`Ready: ${readyCount}`, 118, 37);
  doc.text(`In Repair: ${repairCount}`, 168, 37);
  doc.text(`Total Valuation: $${totalValue.toLocaleString()}`, 218, 37);

  // Table
  const tableData = assets.map(a => [
    a.assetTag,
    a.name,
    a.model,
    a.category,
    a.serial || '—',
    a.status,
    a.assignedToName || 'Unassigned',
    a.location,
    `$${(a.purchaseCost || 0).toLocaleString()}`
  ]);

  autoTable(doc, {
    startY: 46,
    head: [['Asset Tag', 'Asset Name', 'Model', 'Category', 'Serial', 'Status', 'Assigned To', 'Location', 'Cost']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [30, 41, 59], // Slate 800
      textColor: [255, 255, 255],
      fontSize: 8.5,
      fontStyle: 'bold',
      halign: 'left'
    },
    styles: {
      fontSize: 8,
      cellPadding: 2.5,
      textColor: [51, 65, 85]
    },
    columnStyles: {
      0: { fontStyle: 'bold', halign: 'left', cellWidth: 26 },
      4: { font: 'courier', fontSize: 7.5 },
      8: { halign: 'right', fontStyle: 'bold' }
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    didDrawPage: (data) => {
      // Footer page numbers
      const str = `Page ${doc.getNumberOfPages()} | ACIPL/IPNET IMS Confidential Inventory Document`;
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(str, 14, 205);
    }
  });

  doc.save(`acipl_ipnet_assets_${new Date().toISOString().slice(0, 10)}.pdf`);
};

export const exportAuditLogsToCSV = (logs: ActivityLog[], filename = 'acipl_ipnet_audit_logs') => {
  const headers = ['Timestamp', 'Action', 'Item Type', 'Item Name', 'Target User', 'Admin', 'Notes'];
  const rows = logs.map(l => [
    l.timestamp,
    l.action,
    l.itemType,
    `"${(l.itemName || '').replace(/"/g, '""')}"`,
    l.targetUserName ? `"${l.targetUserName.replace(/"/g, '""')}"` : 'N/A',
    `"${(l.adminName || '').replace(/"/g, '""')}"`,
    l.notes ? `"${l.notes.replace(/"/g, '""')}"` : ''
  ]);
  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportAuditLogsToPDF = (logs: ActivityLog[]) => {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  // Header Banner
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 297, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('ACIPL/IPNET IMS', 14, 12);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(186, 230, 253);
  doc.text('System Audit & Activity Logs Report', 14, 18);

  const dateStr = `Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text(dateStr, 297 - 14 - doc.getTextWidth(dateStr), 15);

  const tableData = logs.map(l => [
    l.timestamp,
    l.action.toUpperCase(),
    l.itemType.toUpperCase(),
    l.itemName,
    l.targetUserName || '—',
    l.adminName,
    l.notes || '—'
  ]);

  autoTable(doc, {
    startY: 32,
    head: [['Timestamp', 'Action', 'Type', 'Item Name / Tag', 'Recipient / User', 'Admin', 'Notes / Remarks']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontSize: 8.5,
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 8,
      cellPadding: 2.5,
      textColor: [51, 65, 85]
    },
    columnStyles: {
      0: { font: 'courier', fontSize: 7.5, cellWidth: 38 },
      1: { fontStyle: 'bold', cellWidth: 24 }
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    didDrawPage: () => {
      const str = `Page ${doc.getNumberOfPages()} | ACIPL/IPNET IMS Audit Log`;
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(str, 14, 205);
    }
  });

  doc.save(`acipl_ipnet_audit_logs_${new Date().toISOString().slice(0, 10)}.pdf`);
};

export const exportComprehensiveReportPDF = (
  assets: Asset[],
  licenses: License[],
  accessories: Accessory[],
  consumables: Consumable[]
) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // Cover / Header Banner
  doc.setFillColor(15, 23, 42); // Slate 900
  doc.rect(0, 0, 210, 32, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('ACIPL/IPNET IMS', 14, 15);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(186, 230, 253);
  doc.text('Executive Comprehensive Inventory & Asset Summary Report', 14, 24);

  const totalAssetValue = assets.reduce((sum, a) => sum + (a.purchaseCost || 0), 0);
  const totalLicenseAnnual = licenses.reduce((sum, l) => sum + l.purchaseCost, 0);

  // Executive KPI summary
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, 38, 182, 34, 2, 2, 'FD');

  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text('Executive Inventory Status Overview', 20, 46);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);

  doc.text(`• Total Physical Assets: ${assets.length} units (Valuation: $${totalAssetValue.toLocaleString()})`, 20, 53);
  doc.text(`• Hardware Deployed to Employees: ${assets.filter(a => a.status === 'Deployed').length} units (${assets.filter(a => a.status === 'Ready to Deploy').length} ready for deployment)`, 20, 59);
  doc.text(`• Active Software Licenses: ${licenses.length} packages (Annual Cost: $${totalLicenseAnnual.toLocaleString()})`, 20, 65);

  // Section 1: Hardware Assets
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('1. Hardware Assets Inventory', 14, 80);

  const assetRows = assets.map(a => [
    a.assetTag,
    a.name,
    a.category,
    a.status,
    a.assignedToName || 'Unassigned',
    `$${(a.purchaseCost || 0).toLocaleString()}`
  ]);

  autoTable(doc, {
    startY: 84,
    head: [['Asset Tag', 'Name', 'Category', 'Status', 'Assigned To', 'Cost']],
    body: assetRows,
    theme: 'striped',
    headStyles: { fillColor: [30, 41, 59], fontSize: 8 },
    styles: { fontSize: 7.5, cellPadding: 2 },
    columnStyles: {
      0: { fontStyle: 'bold' },
      5: { halign: 'right' }
    }
  });

  // Section 2: Software Licenses (new page if needed)
  doc.addPage();
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('2. Software Licenses & Subscriptions', 14, 18);

  const licenseRows = licenses.map(l => [
    l.name,
    l.category,
    `${l.assignedUserIds.length} / ${l.totalSeats}`,
    l.expirationDate,
    `$${l.purchaseCost.toLocaleString()}/yr`
  ]);

  autoTable(doc, {
    startY: 22,
    head: [['License Name', 'Category', 'Seat Utilization', 'Expiration', 'Annual Cost']],
    body: licenseRows,
    theme: 'striped',
    headStyles: { fillColor: [30, 41, 59], fontSize: 8 },
    styles: { fontSize: 7.5, cellPadding: 2 },
    columnStyles: {
      4: { halign: 'right' }
    }
  });

  // Section 3: Accessories & Consumables
  // @ts-expect-error autoTable adds lastAutoTable on doc
  const nextY = (doc.lastAutoTable ? doc.lastAutoTable.finalY : 70) + 12;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('3. Accessories & Consumable Supplies', 14, nextY);

  const accessoryRows = accessories.map(a => [
    a.name,
    'Accessory',
    `${a.remainingQuantity} / ${a.totalQuantity}`,
    a.location,
    a.remainingQuantity <= a.minQuantity ? 'LOW STOCK' : 'IN STOCK'
  ]);

  const consumableRows = consumables.map(c => [
    c.name,
    'Consumable',
    `${c.remainingQuantity} / ${c.totalQuantity}`,
    c.location,
    c.remainingQuantity <= c.minQuantity ? 'LOW STOCK' : 'IN STOCK'
  ]);

  autoTable(doc, {
    startY: nextY + 4,
    head: [['Item Name', 'Class', 'Quantity Remaining / Total', 'Location', 'Status']],
    body: [...accessoryRows, ...consumableRows],
    theme: 'striped',
    headStyles: { fillColor: [30, 41, 59], fontSize: 8 },
    styles: { fontSize: 7.5, cellPadding: 2 }
  });

  doc.save(`acipl_ipnet_comprehensive_report_${new Date().toISOString().slice(0, 10)}.pdf`);
};

export const exportComprehensiveReportCSV = (
  assets: Asset[],
  licenses: License[],
  accessories: Accessory[],
  consumables: Consumable[]
) => {
  const lines: string[] = [];

  // Section 1
  lines.push('=== HARDWARE ASSETS ===');
  lines.push('Asset Tag,Name,Model,Category,Serial,Status,Assigned To,Location,Purchase Date,Cost');
  assets.forEach(a => {
    lines.push([
      a.assetTag,
      `"${(a.name || '').replace(/"/g, '""')}"`,
      `"${(a.model || '').replace(/"/g, '""')}"`,
      a.category,
      a.serial || 'N/A',
      a.status,
      a.assignedToName ? `"${a.assignedToName.replace(/"/g, '""')}"` : 'Unassigned',
      `"${(a.location || '').replace(/"/g, '""')}"`,
      a.purchaseDate,
      a.purchaseCost ?? 0
    ].join(','));
  });

  lines.push('');
  lines.push('=== SOFTWARE LICENSES ===');
  lines.push('License Name,Category,Seats Used,Total Seats,Seats Available,Expiration Date,Annual Cost');
  licenses.forEach(l => {
    lines.push([
      `"${l.name.replace(/"/g, '""')}"`,
      l.category,
      l.assignedUserIds.length,
      l.totalSeats,
      l.totalSeats - l.assignedUserIds.length,
      l.expirationDate,
      l.purchaseCost
    ].join(','));
  });

  lines.push('');
  lines.push('=== ACCESSORIES & CONSUMABLES ===');
  lines.push('Item Name,Type,Model / Part No,Remaining,Total Capacity,Location');
  accessories.forEach(acc => {
    lines.push([
      `"${acc.name.replace(/"/g, '""')}"`,
      'Accessory',
      acc.modelNumber,
      acc.remainingQuantity,
      acc.totalQuantity,
      `"${acc.location.replace(/"/g, '""')}"`
    ].join(','));
  });
  consumables.forEach(c => {
    lines.push([
      `"${c.name.replace(/"/g, '""')}"`,
      'Consumable',
      c.modelNumber,
      c.remainingQuantity,
      c.totalQuantity,
      `"${c.location.replace(/"/g, '""')}"`
    ].join(','));
  });

  const csvContent = 'data:text/csv;charset=utf-8,' + lines.join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `acipl_ipnet_full_inventory_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportEventsToCSV = (events: EventItem[], allAssets: Asset[]) => {
  const headers = [
    'Event ID',
    'Event Name',
    'Department',
    'From Date',
    'To Date',
    'Location',
    'Primary Requester',
    'All Requesters',
    'Status',
    'Dispatch Status',
    'Dispatched Asset Count',
    'Dispatched Assets (Tags)',
    'Project Code',
    'Contact Phone',
    'Contact Email',
    'Purpose / Description'
  ];

  const rows = events.map(e => {
    const assetTags = e.assetIds.map(id => {
      const a = allAssets.find(x => x.id === id);
      return a ? a.assetTag : id;
    }).join('; ');

    return [
      e.id,
      `"${(e.name || '').replace(/"/g, '""')}"`,
      `"${(e.department || '').replace(/"/g, '""')}"`,
      e.startDate,
      e.endDate,
      `"${(e.location || '').replace(/"/g, '""')}"`,
      `"${(e.primaryRequesterName || '').replace(/"/g, '""')}"`,
      `"${(e.requesterNames || []).join(', ').replace(/"/g, '""')}"`,
      e.status,
      e.dispatchStatus,
      e.assetIds.length,
      `"${assetTags}"`,
      `"${(e.projectCode || '').replace(/"/g, '""')}"`,
      `"${(e.contactPhone || '').replace(/"/g, '""')}"`,
      `"${(e.contactEmail || '').replace(/"/g, '""')}"`,
      `"${(e.purposeOrDescription || '').replace(/"/g, '""')}"`
    ];
  });

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `acipl_ipnet_events_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportEventsToPDF = (events: EventItem[], allAssets: Asset[]) => {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  // Header Banner
  doc.setFillColor(15, 23, 42); // Slate 900
  doc.rect(0, 0, 297, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('ACIPL/IPNET IMS', 14, 12);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(186, 230, 253);
  doc.text('Company Events & Hardware Dispatch Master Schedule', 14, 18);

  const dateStr = `Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text(dateStr, 297 - 14 - doc.getTextWidth(dateStr), 15);

  // Summary Metrics Box
  const upcomingCount = events.filter(e => e.status === 'Upcoming').length;
  const activeCount = events.filter(e => e.status === 'Active').length;
  const completedCount = events.filter(e => e.status === 'Completed').length;
  const totalAssetsDispatched = events.reduce((sum, e) => sum + (e.assetIds ? e.assetIds.length : 0), 0);

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, 28, 269, 14, 2, 2, 'FD');

  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'bold');
  doc.text(`Total Events: ${events.length}`, 18, 37);
  doc.text(`Upcoming: ${upcomingCount}`, 70, 37);
  doc.text(`Active / Ongoing: ${activeCount}`, 120, 37);
  doc.text(`Completed: ${completedCount}`, 180, 37);
  doc.text(`Allocated Hardware Assets: ${totalAssetsDispatched}`, 225, 37);

  const tableBody = events.map(e => {
    const assetNames = e.assetIds.map(id => {
      const a = allAssets.find(x => x.id === id);
      return a ? `${a.assetTag}` : id;
    }).slice(0, 3).join(', ') + (e.assetIds.length > 3 ? ` +${e.assetIds.length - 3} more` : '');

    return [
      e.name,
      `${e.startDate} to ${e.endDate}`,
      e.location,
      e.primaryRequesterName,
      `${e.assetIds.length} items (${assetNames || 'None'})`,
      e.status,
      e.dispatchStatus
    ];
  });

  autoTable(doc, {
    startY: 46,
    head: [['Event Name', 'Date Range', 'Venue / Location', 'Requested By', 'Assets Dispatched', 'Event Status', 'Dispatch State']],
    body: tableBody,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2.5,
      textColor: [30, 41, 59],
      lineColor: [226, 232, 240],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { left: 14, right: 14 },
    didDrawPage: (data) => {
      const pageCount = (doc as any).internal.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `Page ${data.pageNumber} of ${pageCount} | Confidential - Internal Operations Only`,
        14,
        doc.internal.pageSize.height - 8
      );
    }
  });

  doc.save(`acipl_ipnet_events_report_${new Date().toISOString().slice(0, 10)}.pdf`);
};

export const exportEventGatePassPDF = (event: EventItem, allAssets: Asset[]) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // Top header box
  doc.setFillColor(15, 23, 42); // Slate 900
  doc.rect(0, 0, 210, 26, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('ACIPL/IPNET IMS', 14, 12);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(186, 230, 253);
  doc.text('EQUIPMENT DISPATCH GATE PASS & MANIFEST', 14, 18);

  const slipNumber = `PASS-${event.id.toUpperCase()}`;
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text(slipNumber, 210 - 14 - doc.getTextWidth(slipNumber), 12);
  const genDate = `Date: ${new Date().toLocaleDateString()}`;
  doc.text(genDate, 210 - 14 - doc.getTextWidth(genDate), 18);

  // Event & Requester Details Grid
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, 32, 182, 38, 2, 2, 'FD');

  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('EVENT NAME:', 18, 40);
  doc.text('TIMEFRAME:', 18, 48);
  doc.text('VENUE / DESTINATION:', 18, 56);
  doc.text('PROJECT / DEPT:', 18, 64);

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text(event.name, 48, 40);
  doc.setFont('helvetica', 'normal');
  doc.text(`${event.startDate}  to  ${event.endDate}  (Return: ${event.expectedReturnDate || 'N/A'})`, 48, 48);
  doc.text(event.location, 62, 56);
  doc.text(`${event.department} ${event.projectCode ? `[${event.projectCode}]` : ''}`, 48, 64);

  doc.setTextColor(100, 116, 139);
  doc.text('PRIMARY REQUESTER:', 115, 40);
  doc.text('CONTACT PHONE:', 115, 48);
  doc.text('CONTACT EMAIL:', 115, 56);
  doc.text('DISPATCH STATE:', 115, 64);

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text(event.primaryRequesterName, 155, 40);
  doc.setFont('helvetica', 'normal');
  doc.text(event.contactPhone || 'On File', 155, 48);
  doc.text(event.contactEmail || 'On File', 155, 56);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(event.dispatchStatus === 'Dispatched' ? 14 : 220, 100, 50);
  doc.text(event.dispatchStatus.toUpperCase(), 155, 64);

  // Asset Manifest Section
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`Dispatched Equipment Manifest (${event.assetIds.length} Items)`, 14, 78);

  const eventAssets = event.assetIds.map(id => allAssets.find(a => a.id === id)).filter(Boolean) as Asset[];

  const tableBody = eventAssets.map((a, idx) => [
    (idx + 1).toString(),
    a.assetTag,
    a.name,
    a.model,
    a.category,
    a.serial || 'N/A',
    a.status
  ]);

  autoTable(doc, {
    startY: 82,
    head: [['#', 'Asset Tag', 'Item Description', 'Model', 'Category', 'Serial #', 'Status']],
    body: tableBody.length > 0 ? tableBody : [['-', 'No assets allocated', '-', '-', '-', '-', '-']],
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2,
      textColor: [30, 41, 59],
      lineColor: [226, 232, 240],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { left: 14, right: 14 },
  });

  const finalY = (doc as any).lastAutoTable.finalY + 8;

  // Logistics / Special Instructions Box
  if (event.specialInstructions || event.purposeOrDescription) {
    doc.setFillColor(254, 252, 232); // Amber 50
    doc.setDrawColor(253, 230, 138); // Amber 200
    doc.roundedRect(14, finalY, 182, 20, 2, 2, 'FD');

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(146, 64, 14); // Amber 800
    doc.text('HANDLING & DISPATCH INSTRUCTIONS:', 18, finalY + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(120, 53, 15);
    const noteText = event.specialInstructions || event.purposeOrDescription || 'Standard inventory dispatch guidelines apply.';
    const splitNote = doc.splitTextToSize(noteText, 174);
    doc.text(splitNote.slice(0, 2), 18, finalY + 12);
  }

  // Sign-off verification boxes at the bottom
  const signY = Math.max(finalY + 28, 230);

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.rect(14, signY, 55, 36, 'FD');
  doc.rect(77, signY, 55, 36, 'FD');
  doc.rect(141, signY, 55, 36, 'FD');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(51, 65, 85);
  doc.text('ISSUED BY (IT DISPATCH):', 18, signY + 6);
  doc.text('RECEIVED BY (REQUESTER):', 81, signY + 6);
  doc.text('SECURITY / GATE PASS:', 145, signY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Sign: ____________________', 18, signY + 22);
  doc.text('Date: ____________________', 18, signY + 30);

  doc.text(`Name: ${event.primaryRequesterName}`, 81, signY + 14);
  doc.text('Sign: ____________________', 81, signY + 22);
  doc.text('Date: ____________________', 81, signY + 30);

  doc.text('Checked at Gate Out: [  ]', 145, signY + 14);
  doc.text('Sign: ____________________', 145, signY + 22);
  doc.text('Date: ____________________', 145, signY + 30);

  doc.save(`gate_pass_${event.id}_${event.name.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
};

