import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | 0NOXTACKORE",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div style={{ minHeight: "100vh", background: "#f5f7fa" }}>{children}</div>;
}
