import type { Metadata } from "next";
import { Space_Grotesk, Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import NextTopLoader from "nextjs-toploader";
import { getServerSession } from "next-auth";
import AuthProvider from "@/lib/auth/SessionProvider";

const inter = Montserrat({ subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

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
            <NextTopLoader color="green" />
            <Navbar />
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
