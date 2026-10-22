import { Outlet } from "react-router";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";

// The frame every page shares. <Outlet /> is the hole where the current page goes.
export function SiteLayout() {
  return (
    <>
      {/* The first Tab on every page: a keyboard user can jump over the header */}
      <a href="#main" className="skip-link">
        Skip to the content
      </a>
      <Header />
      <main id="main" tabIndex={-1} className="min-h-[60vh] outline-none">
        <Outlet />
      </main>
      <Footer />
      <Toaster position="bottom-right" />
    </>
  );
}
