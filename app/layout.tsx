import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MILLO - מטבחים מעוצבים",
  description: "עיצוב מטבחים מותאמים אישית לבית שלכם",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body className="overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
