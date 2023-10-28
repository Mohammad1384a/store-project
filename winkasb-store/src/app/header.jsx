"use client";
import styles from "./page.module.css";
import Link from "next/link";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";

function Header() {
  const [isUserLoggedIn] = useCookies(["user"]);
  const refreshToken = isUserLoggedIn?.user?.refreshToken;
  const [user, setUser] = useState(null);
  const [isHeaderBlur, setHeaderBlur] = useState("blur");
  useEffect(() => {
    setTimeout(() => {
      setHeaderBlur("notBlur");
    }, 1000);
  }, []);
  useEffect(() => {
    refreshToken?.length > 0 ? setUser(true) : setUser(null);
  }, [refreshToken]);
  return (
    <header className={isHeaderBlur === "blur" ? styles.blurHeader : ""}>
      <ul className={styles.headerList}>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/products">Products</Link>
        </li>
        <li>
          <Link href="/admin">Admin Panel</Link>
        </li>
        <li>
          {user ? (
            <Link href="/profile">Profile</Link>
          ) : (
            <Link href="/auth">Login/SignUp</Link>
          )}
        </li>
      </ul>
    </header>
  );
}

export default Header;
