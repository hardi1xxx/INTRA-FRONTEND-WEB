import './globals.css'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import type { Metadata } from "next";
import StoreProvider from "@/app/StoreProvider";
import ToastProvider from '@/components/Toast';

export const metadata: Metadata = {
  title: "INTRA System",
  description: "Integration Tracking System",
};

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <StoreProvider>
          <body style={{padding: '0 !important', margin: '0 !important', overflow: 'auto'}}>
            <ToastProvider>
              {children}
            </ToastProvider>
          </body>
      </StoreProvider>
    </html>
  );
}
