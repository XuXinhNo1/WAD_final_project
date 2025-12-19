// src/tables/tables-export.service.ts
import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';
import * as PDFDocument from 'pdfkit';
import * as archiver from 'archiver';
import { Response } from 'express';

@Injectable()
export class TablesExportService {
  
  // Helper: Tạo URL
  // Lưu ý: Đảm bảo field token khớp với database (thường Prisma trả về camelCase là qrToken)
  private generateQrUrl(tableId: string, token: string | null): string {
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const safeToken = token || 'no-token';
    return `${baseUrl}/menu?table=${tableId}&token=${safeToken}`;
  }

  // --- Feature: PDF 1 Bàn ---
  async generateTablePdf(table: any, res: Response) {
    const doc = new PDFDocument({ size: 'A6', margin: 20 });
    
    // SỬA: Dùng qrToken thay vì qr_token
    const qrUrl = this.generateQrUrl(table.id, table.qrToken); 

    // Tạo QR Buffer
    const qrBuffer = await QRCode.toBuffer(qrUrl, { scale: 8 });

    // SỬA: Dùng tableNumber thay vì table_number
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=Table-${table.tableNumber}.pdf`,
    });

    doc.pipe(res);

    // Header
    // SỬA: Dùng tableNumber
    doc.fontSize(24).font('Helvetica-Bold').text(`TABLE ${table.tableNumber}`, { align: 'center' });
    doc.moveDown(0.5);
    
    // QR Code (Căn giữa)
    const pageWidth = doc.page.width; 
    const qrSize = 150;
    const qrX = (pageWidth - qrSize) / 2;
    doc.image(qrBuffer, qrX, doc.y, { width: qrSize });
    
    // Footer
    doc.moveDown(12);
    doc.fontSize(12).font('Helvetica').text('Scan to Order', { align: 'center' });
    
    doc.end();
  }

  // --- Feature: ZIP tất cả bàn ---
  async generateAllQrsZip(tables: any[], res: Response) {
    const archive = archiver('zip', { zlib: { level: 9 } });

    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename=All-Tables-QR.zip',
    });

    archive.pipe(res);

    for (const table of tables) {
      // SỬA: Dùng qrToken
      if (table.qrToken) {
        const qrUrl = this.generateQrUrl(table.id, table.qrToken);
        const qrBuffer = await QRCode.toBuffer(qrUrl);
        
        // Thêm vào zip - SỬA: Dùng tableNumber
        archive.append(qrBuffer, { name: `Table-${table.tableNumber}.png` });
      }
    }

    await archive.finalize();
  }
}