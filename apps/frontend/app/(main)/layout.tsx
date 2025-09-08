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
      <div className="pt-10">{children}</div>
      <Footer />
    </div>
  );
}
