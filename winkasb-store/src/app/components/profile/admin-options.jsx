import styles from "../../(profile)/profile.module.css";
import { BsShopWindow } from "react-icons/bs";
import { FaChalkboardTeacher } from "react-icons/fa";
import { TbBrandBlogger } from "react-icons/tb";
import { GrUserAdmin } from "react-icons/gr";
import Link from "next/link";

function AdminOptions({ visibility, setVisibility }) {
  return (
    <section
      className={
        visibility ? styles.visibleAdminOptions : styles.invisibleEditing
      }
    >
      <div>
        <Link href="/vendor" onClick={() => setVisibility(false)}>
          Vendor
        </Link>
        <BsShopWindow />
      </div>
      <div>
        <Link href="/teacher" onClick={() => setVisibility(false)}>
          Teacher
        </Link>
        <FaChalkboardTeacher />
      </div>
      <div>
        <Link href="/blogger" onClick={() => setVisibility(false)}>
          Blogger
        </Link>
        <TbBrandBlogger />
      </div>
      <div>
        <Link href="/admin" onClick={() => setVisibility(false)}>
          Admin
        </Link>
        <GrUserAdmin />
      </div>
    </section>
  );
}

export default AdminOptions;
