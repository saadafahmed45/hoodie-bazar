"use client";

import { useEffect, useRef, useState } from "react";
import { Printer, Download, X, ExternalLink, CheckCircle2, Loader2 } from "lucide-react";
import HoodieBazarLogo from "./HoodieBazarLogo";
import { BRAND_NAME } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

export default function OrderInvoice({ order, onClose, autoPrint = false }) {
  const invoiceRef = useRef(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [printing, setPrinting] = useState(false);

  useEffect(() => {
    if (autoPrint) {
      const timer = setTimeout(() => {
        handlePrint();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [autoPrint]);

  if (!order) return null;

  const invoiceId = `INV-${order.orderId || order._id}`;
  const orderDate = new Date(order.createdAt || Date.now()).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Load local or CDN jsPDF and html2canvas libraries reliably
  const loadJsPdfLibraries = () => {
    return new Promise((resolve, reject) => {
      if (typeof window === "undefined") {
        return reject(new Error("Browser required"));
      }

      const getJsPdf = () => window.jspdf?.jsPDF || window.jsPDF;
      if (getJsPdf()) {
        return resolve({ jsPDF: getJsPdf(), html2canvas: window.html2canvas });
      }

      const loadScript = (id, src) => {
        return new Promise((res, rej) => {
          const existing = document.getElementById(id);
          if (existing && existing.dataset.loaded === "true") {
            return res();
          }

          const s = document.createElement("script");
          s.id = id;
          s.src = src;
          s.async = false;
          s.onload = () => {
            s.dataset.loaded = "true";
            res();
          };
          s.onerror = () => rej(new Error(`Failed to load ${src}`));
          document.head.appendChild(s);
        });
      };

      // Try local scripts first, fallback to CDN if needed
      loadScript("h2c-script", "/js/html2canvas.min.js")
        .catch(() =>
          loadScript("h2c-script-cdn", "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js")
        )
        .then(() =>
          loadScript("jspdf-script", "/js/jspdf.umd.min.js").catch(() =>
            loadScript("jspdf-script-cdn", "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js")
          )
        )
        .then(() => {
          const jsPDF = getJsPdf();
          if (!jsPDF) {
            throw new Error("jsPDF failed to initialize");
          }
          resolve({ jsPDF, html2canvas: window.html2canvas });
        })
        .catch(reject);
    });
  };

  // Pure jsPDF Vector Generator: Instant, crisp vector PDF with zero canvas dependency
  const generatePureJsPdf = (jsPDF) => {
    const doc = new jsPDF("p", "mm", "a4");

    // Header Accent Line
    doc.setFillColor(17, 17, 17);
    doc.rect(15, 12, 180, 1.5, "F");

    // Store Branding
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(17, 17, 17);
    doc.text(BRAND_NAME || "HOODIE BAZAR", 15, 24);

    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text("Premium Winter Outerwear & Heavyweight Hoodies", 15, 30);
    doc.text("Dhaka, Bangladesh • support@hoodiebazar.com • +880 1890-195058", 15, 35);

    // Invoice Meta (Right-aligned)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text("TAX INVOICE / CASH MEMO", 195, 22, { align: "right" });
    doc.setFontSize(13);
    doc.text(`#${order.orderId || order._id}`, 195, 28, { align: "right" });

    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.text(`Date: ${orderDate}`, 195, 34, { align: "right" });
    doc.text(
      `Payment: ${order.paymentMethod === "CASH_ON_DELIVERY" ? "Cash On Delivery (COD)" : order.paymentMethod || "COD"}`,
      195,
      39,
      { align: "right" }
    );

    // Customer & Shipping Box
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(15, 44, 180, 26, 2, 2, "F");
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(15, 44, 180, 26, 2, 2, "S");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text("BILLED & SHIPPED TO:", 20, 50);

    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text(order.customer?.name || "Customer", 20, 56);

    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.text(`Phone: ${order.customer?.phone || "N/A"}`, 20, 61);
    doc.text(
      `Address: ${order.customer?.address || "N/A"}${order.customer?.area ? `, ${order.customer.area}` : ""} (${order.customer?.district || "Dhaka"})`,
      20,
      66
    );

    // Status Badge
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(5, 150, 105);
    doc.text(`STATUS: ${(order.status || "CONFIRMED").toUpperCase()}`, 190, 56, { align: "right" });

    // Table Header
    let y = 76;
    doc.setFillColor(15, 23, 42);
    doc.rect(15, y, 180, 7, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text("#", 18, y + 4.8);
    doc.text("ITEM DESCRIPTION", 28, y + 4.8);
    doc.text("SIZE", 110, y + 4.8, { align: "center" });
    doc.text("COLOR", 130, y + 4.8, { align: "center" });
    doc.text("QTY", 150, y + 4.8, { align: "center" });
    doc.text("PRICE (BDT)", 172, y + 4.8, { align: "right" });
    doc.text("TOTAL (BDT)", 192, y + 4.8, { align: "right" });

    // Table Items
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);

    (order.items || []).forEach((item, idx) => {
      y += 6;
      doc.text(String(idx + 1), 18, y);
      doc.text(item.name || "Winter Apparel", 28, y);
      doc.text(item.size || "M", 110, y, { align: "center" });
      doc.text(item.color || "Standard", 130, y, { align: "center" });
      doc.text(String(item.quantity || 1), 150, y, { align: "center" });
      doc.text(String(item.price || 0), 172, y, { align: "right" });
      doc.text(String((item.price || 0) * (item.quantity || 1)), 192, y, { align: "right" });

      doc.setDrawColor(241, 245, 249);
      doc.line(15, y + 2, 195, y + 2);
    });

    // Totals Section
    y += 10;
    doc.setDrawColor(15, 23, 42);
    doc.line(125, y, 195, y);

    y += 5.5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text("Subtotal:", 145, y);
    doc.text(`BDT ${order.subtotal || order.total - (order.deliveryCharge || 70)}`, 192, y, { align: "right" });

    y += 5;
    doc.text("Delivery Fee:", 145, y);
    doc.text(`BDT ${order.deliveryCharge || 70}`, 192, y, { align: "right" });

    if (order.discount && order.discount > 0) {
      y += 5;
      doc.text("Discount:", 145, y);
      doc.text(`-BDT ${order.discount}`, 192, y, { align: "right" });
    }

    y += 6;
    doc.setFillColor(15, 23, 42);
    doc.rect(130, y, 65, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(255, 255, 255);
    doc.text("TOTAL DUE:", 135, y + 5.5);
    doc.text(`BDT ${order.total}`, 192, y + 5.5, { align: "right" });

    // Footer
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text("Please inspect parcel upon delivery. For queries: support@hoodiebazar.com", 15, 275);
    doc.text("Thank you for shopping with Hoodie Bazar!", 15, 279);

    doc.setDrawColor(203, 213, 225);
    doc.line(15, 263, 65, 263);
    doc.text("Customer Signature", 15, 268);

    doc.line(145, 263, 195, 263);
    doc.text("Authorized Seal & Dispatch", 145, 268);

    doc.save(`CashMemo_${order.orderId || order._id}.pdf`);
  };

  // Direct Download of Cash Memo as genuine PDF using jsPDF
  const handleDownloadPdf = async () => {
    setDownloadingPdf(true);

    try {
      const { jsPDF, html2canvas } = await loadJsPdfLibraries();
      const element = invoiceRef.current;

      if (html2canvas && element) {
        try {
          const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            logging: false,
            backgroundColor: "#ffffff",
            onclone: (clonedDoc) => {
              // Sanitize any remaining Tailwind v4 oklch colors in clone
              const clonedNode = clonedDoc.getElementById("printable-cashmemo");
              if (clonedNode) {
                clonedNode.style.backgroundColor = "#ffffff";
                clonedNode.style.color = "#111111";
                const all = clonedNode.querySelectorAll("*");
                all.forEach((el) => {
                  try {
                    const style = window.getComputedStyle(el);
                    if (style.color && style.color.includes("oklch")) {
                      el.style.color = "#111111";
                    }
                    if (style.backgroundColor && style.backgroundColor.includes("oklch")) {
                      el.style.backgroundColor = "transparent";
                    }
                    if (style.borderColor && style.borderColor.includes("oklch")) {
                      el.style.borderColor = "#e2e8f0";
                    }
                  } catch (e) {
                    // Ignore style read issues
                  }
                });
              }
            },
          });

          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF("p", "mm", "a4");
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          const imgHeight = (canvas.height * pdfWidth) / canvas.width;

          pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, Math.min(imgHeight, pdfHeight));
          pdf.save(`CashMemo_${order.orderId || order._id}.pdf`);
          toast.success("Cash memo PDF downloaded successfully!");
          return;
        } catch (canvasErr) {
          console.warn("Canvas capture note, using high-fidelity vector jsPDF:", canvasErr);
        }
      }

      // Pure jsPDF Vector (Always produces crisp PDF file, instant download)
      generatePureJsPdf(jsPDF);
      toast.success("Cash memo PDF downloaded successfully!");
    } catch (err) {
      console.error("jsPDF generation failed:", err);
      toast.error("Download fallback: Opening print dialog...");
      handlePrint();
    } finally {
      setDownloadingPdf(false);
    }
  };

  // Safe Browser Print (100% visible, NEVER blank)
  const handlePrint = () => {
    const printContent = invoiceRef.current;
    if (!printContent) return;

    setPrinting(true);

    try {
      // Mark body so print media query hides background main dashboard & overlays
      const isInDialog = Boolean(printContent.closest('[role="dialog"]'));
      if (isInDialog) {
        document.body.classList.add("printing-from-dialog");
      }

      // Trigger browser print
      window.print();

      // Clean up class after print dialog is handled
      setTimeout(() => {
        document.body.classList.remove("printing-from-dialog");
        setPrinting(false);
      }, 500);
    } catch (err) {
      console.error("Print error:", err);
      document.body.classList.remove("printing-from-dialog");
      setPrinting(false);
    }
  };

  return (
    <div className="bg-white text-[#111111] font-sans">
      {/* Top action toolbar (Hidden when printing) */}
      <div className="no-print bg-[#0f172a] text-white px-5 py-3 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#cbd5e1]">
            Cash Memo: <span className="text-[#b6e600] font-mono">#{order.orderId || order._id}</span>
          </span>
          <span className="hidden sm:inline-block text-[11px] bg-[#1e293b] text-[#cbd5e1] px-2.5 py-0.5 rounded font-mono uppercase">
            {order.status || "Pending"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Download PDF via jsPDF (Primary Action) */}
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={downloadingPdf}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#b6e600] hover:bg-[#a4cf00] text-[#111111] font-bold text-xs uppercase tracking-wider rounded-lg transition active:scale-95 shadow-sm cursor-pointer disabled:opacity-60"
          >
            {downloadingPdf ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>DOWNLOADING PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>DOWNLOAD CASH MEMO (PDF)</span>
              </>
            )}
          </button>

          {/* Clean Print Action */}
          <button
            type="button"
            onClick={handlePrint}
            disabled={printing || downloadingPdf}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#1e293b] hover:bg-[#334155] text-[#e2e8f0] text-xs font-bold uppercase tracking-wider rounded-lg transition active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {printing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Printer className="w-3.5 h-3.5 text-[#cbd5e1]" />
            )}
            <span>Print</span>
          </button>

          {/* Standalone View */}
          <a
            href={`/admin/orders/${order._id}/invoice`}
            target="_blank"
            rel="noreferrer"
            title="Open Clean Standalone Cash Memo"
            className="hidden md:inline-flex items-center gap-1 px-3 py-2 bg-[#1e293b] hover:bg-[#334155] text-[#cbd5e1] text-xs font-bold uppercase tracking-wider rounded-lg transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Standalone</span>
          </a>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-[#94a3b8] hover:text-white rounded-lg hover:bg-[#1e293b] transition cursor-pointer"
              aria-label="Close invoice"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Printable Cash Memo Canvas (A4 Single-Page Optimized with Explicit Safe Hex Colors) */}
      <div
        id="printable-cashmemo"
        ref={invoiceRef}
        style={{ backgroundColor: "#ffffff", color: "#111111" }}
        className="max-w-3xl mx-auto p-6 sm:p-8"
      >
        {/* Header: Brand & Tax Memo */}
        <div
          style={{ borderColor: "#111111" }}
          className="flex justify-between items-start gap-4 pb-4 border-b-2"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <HoodieBazarLogo className="h-8 w-8" />
              <span className="font-editorial font-black text-xl text-[#111111] tracking-tight uppercase">
                {BRAND_NAME}
              </span>
            </div>
            <p className="text-[11px] text-[#64748b] font-medium leading-tight">
              Premium Winter Outerwear & Heavyweight Hoodies
            </p>
            <p className="text-[10px] text-[#94a3b8] mt-0.5 leading-tight">
              Dhaka, Bangladesh • support@hoodiebazar.com • +880 1890-195058
            </p>
          </div>

          <div className="text-right">
            <span
              style={{ backgroundColor: "#f1f5f9", color: "#1e293b" }}
              className="inline-block text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded mb-1"
            >
              TAX INVOICE / CASH MEMO
            </span>
            <h2 className="text-lg font-mono font-black text-[#111111] tracking-tight leading-none">
              #{order.orderId || order._id}
            </h2>
            <p className="text-[11px] text-[#64748b] mt-1 font-medium">Date: {orderDate}</p>
            <p className="text-[11px] text-[#475569] font-medium">
              Payment:{" "}
              <span className="font-bold text-[#0f172a]">
                {order.paymentMethod === "CASH_ON_DELIVERY" ? "Cash On Delivery (COD)" : order.paymentMethod || "COD"}
              </span>
            </p>
          </div>
        </div>

        {/* Customer & Shipping Info */}
        <div
          style={{ backgroundColor: "#f8fafc", borderColor: "#e2e8f0" }}
          className="grid grid-cols-2 gap-4 my-3.5 p-3.5 rounded-xl border text-[11px]"
        >
          <div>
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#94a3b8] block mb-0.5">
              BILLED & SHIPPED TO:
            </span>
            <h3 className="text-xs font-bold text-[#0f172a] leading-tight">
              {order.customer?.name || "Valued Customer"}
            </h3>
            <p className="text-[#475569] mt-0.5">
              <span className="font-semibold text-[#1e293b]">Phone:</span> {order.customer?.phone || "N/A"}
            </p>
            {order.customer?.email && (
              <p className="text-[#475569]">
                <span className="font-semibold text-[#1e293b]">Email:</span> {order.customer?.email}
              </p>
            )}
            <p className="text-[#475569] mt-0.5 leading-snug">
              <span className="font-semibold text-[#1e293b]">Address:</span> {order.customer?.address || "N/A"}
              {order.customer?.area ? `, ${order.customer.area}` : ""}
            </p>
            <p className="text-[#0f172a] font-bold mt-0.5">
              District: {order.customer?.district || "Dhaka"}
            </p>
          </div>

          <div className="text-right flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#94a3b8] block mb-0.5">
                DISPATCH STATUS:
              </span>
              <div
                style={{ backgroundColor: "#ecfdf5", color: "#065f46", borderColor: "#a7f3d0" }}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border"
              >
                <CheckCircle2 className="w-3 h-3 text-[#059669]" />
                <span>{order.status || "Confirmed"}</span>
              </div>
            </div>

            {order.customer?.note && (
              <div
                style={{ backgroundColor: "#fffbeb", borderColor: "#fef3c7" }}
                className="mt-2 p-1.5 border rounded text-right"
              >
                <span className="text-[9px] font-bold text-[#92400e] uppercase block">
                  Delivery Note:
                </span>
                <p className="text-[10px] text-[#78350f] italic">
                  &ldquo;{order.customer.note}&rdquo;
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Line Items Table */}
        <div className="my-3.5">
          <table className="w-full text-left border-collapse text-[11px]">
            <thead>
              <tr
                style={{ borderColor: "#111111", color: "#111111" }}
                className="border-b-2 uppercase tracking-wider text-[10px]"
              >
                <th className="py-2 pl-2 font-bold w-8">#</th>
                <th className="py-2 font-bold">ITEM DESCRIPTION</th>
                <th className="py-2 text-center font-bold">SIZE</th>
                <th className="py-2 text-center font-bold">COLOR</th>
                <th className="py-2 text-center font-bold">QTY</th>
                <th className="py-2 text-right font-bold">UNIT PRICE</th>
                <th className="py-2 pr-2 text-right font-bold">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item, idx) => (
                <tr
                  key={idx}
                  style={{ borderColor: "#f1f5f9" }}
                  className="border-b hover:bg-[#f8fafc]/50"
                >
                  <td className="py-2 pl-2 text-[#94a3b8] font-mono text-[10px]">{idx + 1}</td>
                  <td className="py-2">
                    <span className="font-bold text-[#0f172a] block leading-tight">{item.name}</span>
                    <span className="text-[9px] text-[#94a3b8] font-mono">
                      SKU: {item.productId?.slice(-6).toUpperCase() || "HB-ITEM"}
                    </span>
                  </td>
                  <td className="py-2 text-center font-semibold text-[#334155]">
                    {item.size || "M"}
                  </td>
                  <td className="py-2 text-center text-[#334155]">{item.color || "Standard"}</td>
                  <td className="py-2 text-center font-bold text-[#0f172a] font-mono">
                    {item.quantity}
                  </td>
                  <td className="py-2 text-right font-mono text-[#334155]">
                    {formatPrice(item.price)}
                  </td>
                  <td className="py-2 pr-2 text-right font-mono font-bold text-[#0f172a]">
                    {formatPrice(item.price * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Financial Summary & Notice */}
        <div
          style={{ borderColor: "#e2e8f0" }}
          className="flex justify-between items-start gap-4 pt-3 border-t"
        >
          <div className="text-[10px] text-[#64748b] max-w-xs leading-relaxed">
            <h4 className="font-bold uppercase tracking-wider text-[#334155] text-[9px] mb-0.5">
              Customer Notice & Policy:
            </h4>
            <p>
              Please inspect parcel in front of the delivery agent. For size or manufacturing issues, contact us within 7 days for exchange.
            </p>
            <p className="font-bold text-[#0f172a] mt-1">
              Thank you for choosing Hoodie Bazar!
            </p>
          </div>

          <div className="w-64 space-y-1.5 text-[11px]">
            <div className="flex justify-between text-[#475569]">
              <span>Subtotal</span>
              <span className="font-mono font-bold text-[#0f172a]">
                {formatPrice(order.subtotal || order.total - (order.deliveryCharge || 70))}
              </span>
            </div>
            <div className="flex justify-between text-[#475569]">
              <span>Delivery Fee</span>
              <span className="font-mono font-semibold text-[#0f172a]">
                {order.deliveryCharge === 0 ? "FREE" : formatPrice(order.deliveryCharge || 70)}
              </span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-[#059669] font-semibold">
                <span>Discount</span>
                <span className="font-mono">-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div
              style={{ borderColor: "#111111" }}
              className="flex justify-between items-center pt-2 border-t-2 text-xs font-black text-[#111111]"
            >
              <span className="uppercase tracking-wider">TOTAL DUE:</span>
              <span className="font-mono text-sm text-[#111111]">
                {formatPrice(order.total)}
              </span>
            </div>
            <p className="text-[9px] text-right text-[#94a3b8] font-medium">
              (Cash on Delivery • Inclusive of all charges)
            </p>
          </div>
        </div>

        {/* Signatures Line */}
        <div
          style={{ borderColor: "#cbd5e1" }}
          className="mt-8 pt-4 border-t border-dashed grid grid-cols-2 gap-6 text-[10px] text-[#64748b]"
        >
          <div className="text-left">
            <div style={{ borderColor: "#cbd5e1" }} className="h-8 border-b w-36"></div>
            <span className="uppercase font-bold tracking-wider text-[#334155] block mt-1">
              Customer Signature
            </span>
          </div>

          <div className="text-right">
            <div style={{ borderColor: "#cbd5e1" }} className="h-8 border-b w-36 ml-auto"></div>
            <span className="uppercase font-bold tracking-wider text-[#334155] block mt-1">
              Authorized Seal & Dispatch
            </span>
            <span className="text-[9px] text-[#94a3b8] block font-mono">
              Hoodie Bazar Logistics
            </span>
          </div>
        </div>
      </div>

      {/* Global Print Isolation CSS: 100% Reliable Print Formatting */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm 10mm;
          }

          *, *::before, *::after {
            box-sizing: border-box !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* Hide UI navigation, footers, buttons, and sonner toaster */
          header,
          nav,
          footer,
          aside,
          [data-sonner-toaster],
          .no-print,
          button {
            display: none !important;
          }

          /* Hide dark modal backdrop */
          [data-state][class*="bg-black"],
          [data-state][class*="backdrop-blur"],
          div[class*="DialogOverlay"] {
            display: none !important;
          }

          /* Hide main dashboard background when printing from the invoice dialog */
          body.printing-from-dialog main,
          body:has([role="dialog"] #printable-cashmemo) main {
            display: none !important;
          }

          /* Reset Radix Dialog positioning so it renders cleanly at top of page */
          [role="dialog"] {
            position: static !important;
            transform: none !important;
            width: 100% !important;
            max-width: 100% !important;
            height: auto !important;
            max-height: none !important;
            overflow: visible !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            background: transparent !important;
          }

          /* Ensure Cash Memo is 100% visible and centered */
          #printable-cashmemo {
            display: block !important;
            visibility: visible !important;
            position: static !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 auto !important;
            padding: 0 !important;
            background: #ffffff !important;
            color: #111111 !important;
            box-shadow: none !important;
            border: none !important;
          }
        }
      `}</style>
    </div>
  );
}
