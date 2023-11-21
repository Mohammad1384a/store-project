import styles from "../../(profile)/profile.module.css";
import { AiOutlineUser } from "react-icons/ai";
import { BiLogIn } from "react-icons/bi";
import Link from "next/link";
import { useCookies } from "react-cookie";
import { useRouter } from "next/navigation";

function ProfileOptions({ visibility }) {
  const [userCookie, _, removeUserCookie] = useCookies(["user"]);
  const router = useRouter();
  function logOutUser() {
    removeUserCookie("user");
    router.push("/");
  }
  return (
    <section
      className={visibility ? styles.visibleOptions : styles.invisibleEditing}
    >
      <div>
        <Link href="/profile">Profile</Link>
        <AiOutlineUser />
      </div>
      <div onClick={() => logOutUser()}>
        <p>Logout</p>
        <BiLogIn />
      </div>
    </section>
  );
}

export default ProfileOptions;
