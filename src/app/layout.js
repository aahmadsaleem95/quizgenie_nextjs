import "./globals.css";

import ClientLayout from "@/components/ClientLayout";

export const metadata = {
  title: "MCQs Genie",
  description:
    "Whis website is generated for education purpose only not for commercial use.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
