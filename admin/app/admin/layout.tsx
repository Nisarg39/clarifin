import Sidebar from "@/components/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100dvh", background: "linear-gradient(160deg, #EBF4FF 0%, #F0F7FF 50%, #E8F2FF 100%)" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: 32, background: "transparent" }}>{children}</main>
    </div>
  );
}
