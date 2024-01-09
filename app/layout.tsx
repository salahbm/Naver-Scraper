import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

import { getServerSession } from "next-auth";
import AuthProvider from "@/lib/auth/SessionProvider";

const inter = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Naver Place",
  description: "Get latest notifications and save money",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider session={session}>
          <main className="max-w-10xl mx-auto">
            <Navbar />
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
