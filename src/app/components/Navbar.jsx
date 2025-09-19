// app/components/Navbar.jsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="space-x-4 p-4 border-b">
      <Link href="/" className={pathname === "/" ? "underline font-bold" : ""}>
        Home
      </Link>
      {"| "}
      <Link
        href="/about"
        className={pathname === "/about" ? "underline font-bold" : ""}
      >
        About
      </Link>
      {"| "}
      <Link
        href="/contact"
        className={pathname === "/contact" ? "underline font-bold" : ""}
      >
        Contact
      </Link>
      {"| "}

      <Link
        href="/blog/1"
        className={pathname.startsWith("/blog") ? "underline font-bold" : ""}
      >
        Blog
      </Link>
      {"| "}
      <Link
        href="/dashboard"
        className={
          pathname.startsWith("/dashboard") ? "underline font-bold" : ""
        }
      >
        Dashboard
      </Link>
    </nav>
  );
}
