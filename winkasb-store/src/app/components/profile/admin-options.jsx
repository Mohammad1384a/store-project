import styles from "../../(profile)/profile.module.css";
import { BsShopWindow } from "react-icons/bs";
import { FaChalkboardTeacher } from "react-icons/fa";
import { TbBrandBlogger } from "react-icons/tb";
import { GrUserAdmin } from "react-icons/gr";
import Link from "next/link";
import { useRouter } from "next/navigation";

function AdminOptions({ visibility }) {
  const router = useRouter();
  return (
    <section
      className={
        visibility ? styles.visibleAdminOptions : styles.invisibleEditing
      }
    >
      <div>
        <Link href="/vendor">Vendor</Link>
        <BsShopWindow />
      </div>
      <div>
        <Link href="/teacher">Teacher</Link>
        <FaChalkboardTeacher />
      </div>
      <div>
        <Link href="/blogger">Blogger</Link>
        <TbBrandBlogger />
      </div>
      <div>
        <Link href="/admin">Admin</Link>
        <GrUserAdmin />
      </div>
    </section>
  );
}

export default AdminOptions;
