import { Footer } from "../components/Footer";
import { Header } from "../components/Header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      <div>{children}</div>
      <div className="h-20" />
      <Footer />
    </div>
  );
}
