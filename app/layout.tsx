import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hambalyo — Amina & Warsame",
  description:
    "A digital wedding monograph for Amina & Warsame. Leave a Somali or English blessing on the live message wall.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full bg-surface font-body-md text-on-surface antialiased selection:bg-secondary-fixed selection:text-on-secondary-fixed">
        {children}
      </body>
    </html>
  );
}
