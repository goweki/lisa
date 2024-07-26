import Footer from "@/components/mols/footer";
import Navbar from "@/components/mols/navbar";

export default function LandingLayout({ children }) {
  // Render
  return (
    <div className="flex flex-col h-full">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
