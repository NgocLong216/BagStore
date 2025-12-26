package com.example.BagStore.service;

import com.example.BagStore.entity.Order;
import com.example.BagStore.entity.OrderItem;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.*;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;

@Service
public class InvoicePdfService {

    public byte[] generateInvoice(Order order) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, out);
        document.open();

        Font titleFont = new Font(Font.HELVETICA, 18, Font.BOLD);
        Font boldFont = new Font(Font.HELVETICA, 12, Font.BOLD);

        Paragraph title = new Paragraph("HÓA ĐƠN BÁN HÀNG", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);
        document.add(Chunk.NEWLINE);

        document.add(new Paragraph("Mã đơn: #" + order.getPaymentRef(), boldFont));
        document.add(new Paragraph("Khách hàng: " + order.getFullName()));
        document.add(new Paragraph("SĐT: " + order.getPhone()));
        document.add(new Paragraph(
                "Địa chỉ: " + order.getSubAddress() + ", " + order.getAddress()
        ));
        document.add(new Paragraph("Ngày đặt: " + order.getCreatedAt()));
        document.add(Chunk.NEWLINE);

        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);
        table.setWidths(new int[]{4, 2, 1, 2});

        addHeader(table, "Sản phẩm");
        addHeader(table, "Giá");
        addHeader(table, "SL");
        addHeader(table, "Thành tiền");

        BigDecimal total = BigDecimal.ZERO;

        for (OrderItem item : order.getItems()) {
            BigDecimal sub =
                    item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));

            table.addCell(item.getProduct().getName());
            table.addCell(item.getPrice().toString());
            table.addCell(item.getQuantity().toString());
            table.addCell(sub.toString());

            total = total.add(sub);
        }

        document.add(table);
        document.add(Chunk.NEWLINE);

        Paragraph totalP = new Paragraph(
                "TỔNG TIỀN: " + total + " VND",
                boldFont
        );
        totalP.setAlignment(Element.ALIGN_RIGHT);
        document.add(totalP);

        document.close();
        return out.toByteArray();
    }

    private void addHeader(PdfPTable table, String text) {
        PdfPCell cell = new PdfPCell(new Phrase(text));
        cell.setBackgroundColor(Color.LIGHT_GRAY);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        table.addCell(cell);
    }
}

