"use client";
import styles from "./user.module.css";
import profileStyles from "../(profile)/profile.module.css";
import Link from "next/link";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import ProfileOptions from "../components/profile/profile-options";
import AdminOptions from "../components/profile/admin-options";

function Header() {
  const [isUserLoggedIn] = useCookies(["user"]);
  const refreshToken = isUserLoggedIn?.user?.refreshToken;
  const [user, setUser] = useState(null);
  const [isHeaderBlur, setHeaderBlur] = useState("blur");
  const [optionsVisibility, setProfileOptions] = useState(false);
  const [adminLoginOptions, setLoginOptions] = useState(false);

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
        <li className={profileStyles.profileOptionsContainer}>
          <p onClick={() => setLoginOptions(!adminLoginOptions)}>Admin Panel</p>
          <AdminOptions
            visibility={adminLoginOptions}
            setVisibility={setLoginOptions}
          />
        </li>
        {user ? (
          <li className={profileStyles.profileOptionsContainer}>
            <p onClick={() => setProfileOptions(!optionsVisibility)}>Profile</p>
            <ProfileOptions visibility={optionsVisibility} />
          </li>
        ) : (
          <li>
            <Link href="/auth">Login/SignUp</Link>
          </li>
        )}
      </ul>
    </header>
  );
}

export default Header;
