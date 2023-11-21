"use client";
import AdminSideBar from "@/app/components/admin/side-bar";
import styles from "../admin.module.css";
import UserList from "@/app/components/admin/user-list";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast, Toaster } from "react-hot-toast";
import http from "@/app/axios-instances";
import { useCookies } from "react-cookie";

function AdminPage() {
  const [listType, setListType] = useState("USER");
  const [users, setUserList] = useState(null);
  const [isUserLoggedIn] = useCookies(["user"]);

  async function fetchUsersList() {
    try {
      const { data } = await http.get("user/all", {
        headers: { Authorization: "Bearer " + isUserLoggedIn?.user?.token },
      });
      const { users } = data;
      return setUserList(users);
    } catch (error) {
      toast.error(error?.response?.data?.message ?? error?.message ?? error);
    }
  }

  const { mutateAsync } = useMutation({
    mutationFn: fetchUsersList,
  });

  useEffect(() => {
    if (!users) {
      mutateAsync();
    }
  }, [users]);

  return (
    <div className={styles.adminPage}>
      <Toaster />
      <AdminSideBar setListType={setListType} />
      <section>
        <h3>
          {listType.charAt(0) + listType.slice(1).toLocaleLowerCase()}s List
        </h3>
        {users && (
          <UserList type={listType} users={users} setUsers={setUserList} />
        )}
      </section>
    </div>
  );
}

export default AdminPage;
