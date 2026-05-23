import "./globals.css";

export const metadata = {
  title: "Video Calling App",
  description: "A Next.js video conferencing app with Socket.IO signaling.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
