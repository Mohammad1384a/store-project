import styles from "../../(admin)/admin.module.css";

function AdminSideBar({ setListType }) {
  return (
    <ul className={styles.adminSidebar}>
      <li onClick={() => setListType("USER")}>Users List</li>
      <li onClick={() => setListType("TEACHER")}>Teachers List</li>
      <li onClick={() => setListType("VENDOR")}>Vendors List</li>
      <li onClick={() => setListType("BLOGGER")}>Bloggers List</li>
    </ul>
  );
}

export default AdminSideBar;
