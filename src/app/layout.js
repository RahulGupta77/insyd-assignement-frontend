import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";
import { AuthProvider } from "../context/AuthContext";
import "./globals.css";

import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Authentication App",
  description: "A Next.js application with authentication",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <Toaster position="top-center" />
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
