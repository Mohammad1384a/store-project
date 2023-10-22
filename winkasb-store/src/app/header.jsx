import styles from "./page.module.css";
import Link from "next/link";

function Header() {
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
          {isUserLoggedIn ? (
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
