"use client";
import styles from "./page.module.css";
import Link from "next/link";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";

function Header() {
  const [isUserLoggedIn] = useCookies(["user"]);
  const [user, setUser] = useState(null);
  useEffect(() => {
    setUser(isUserLoggedIn?.user?._id ?? null);
  }, [isUserLoggedIn]);
  return (
    <header>
      <ul className={styles.headerList}>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/products">Products</Link>
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
