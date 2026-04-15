"use client";
import React from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PDFViewer({ fileUrl }: { fileUrl: string }) {
  return (
    <>
      <Document
        file={{
          url: fileUrl,
        }}
      >
        <Page width={360} height={360} renderAnnotationLayer={false} renderTextLayer={false} pageNumber={1} />
      </Document>
    </>
  );
}
