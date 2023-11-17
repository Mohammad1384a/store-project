"use client";
import http from "@/app/axios-instances";
import styles from "../admin.module.css";
import { Fragment, useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useCookies } from "react-cookie";

function VendorPage() {
  const [userInfo, setUserInfo] = useState(false);
  const [isUserLoggedIn] = useCookies(["user"]);

  async function fetchUserInfo() {
    try {
      const { data } = await http.get(`user/${isUserLoggedIn?.user?._id}`, {
        headers: { Authorization: "Bearer " + isUserLoggedIn?.user?.token },
      });
      return (
        data?.status === 200 &&
        data?.user &&
        setUserInfo({
          username: data.user.username,
          products: data.user.products,
        })
      );
    } catch (error) {
      toast.error(error?.response?.data?.message ?? error?.message ?? error);
    }
  }

  useEffect(() => {
    if (!userInfo) {
      fetchUserInfo();
    }
  }, [userInfo]);

  return (
    <Fragment>
      <Toaster />
      {userInfo && (
        <div className={styles.vendorPage}>
          <section>
            <h3>{userInfo?.username} Products</h3>
          </section>
        </div>
      )}
    </Fragment>
  );
}

export default VendorPage;
