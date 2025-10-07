import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "My Next App",
};

import Navbar from "./components/Navbar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Toaster position="top-right" reverseOrder={false} />
      </body>
    </html>
  );
}
