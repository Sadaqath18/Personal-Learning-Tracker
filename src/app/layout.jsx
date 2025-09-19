import "./globals.css";
import Link from "next/link";

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
      </body>
    </html>
  );
}


// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body>
//         <header style={{ padding: 16, borderBottom: "1px solid #eee" }}>
//           <nav>
//             <Link href="/">Home</Link> {" | "}
//             <Link href="/about">About</Link> {" | "}
//             <Link href="/contact">Contact</Link> {" | "}
//             <Link href="/blog/1">Blog (example)</Link> {" | "}
//             <Link href="/dashboard">Dashboard</Link>
//           </nav>
//         </header>

//         <main style={{ padding: 20 }}>{children}</main>
//       </body>
//     </html>
//   );
// }
