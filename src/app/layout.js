import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import ToastProvider from "@/components/ToastProvider";
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
        <ToastProvider />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
