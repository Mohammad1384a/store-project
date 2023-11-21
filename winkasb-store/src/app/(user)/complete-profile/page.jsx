"use client";
import { Fragment, useEffect, useState } from "react";
import styles from "../user.module.css";
import { useMutation } from "@tanstack/react-query";
import http from "../../axios-instances";
import { MutatingDots } from "react-loader-spinner";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useCookies } from "react-cookie";

function CompleteProfile() {
  const [isUserLoggedIn] = useCookies(["user"]);
  const [isInputVisible, setInput] = useState(false);
  const router = useRouter();
  const [info, setInfo] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    birthday: "",
  });
  const userItems = [
    "first_name",
    "last_name",
    "email",
    "username",
    "password",
    "birthday",
  ];

  async function fetchUserInfo() {
    try {
      const { data } = await http.get(`user/${isUserLoggedIn?.user?._id}`, {
        headers: { Authorization: "Bearer " + isUserLoggedIn?.user?.token },
      });
      const { user } = data;
      if (user?.first_name && user?.last_name && user?.password) {
        toast.error("Your profile is already completed");
        return router.push("/");
      }
      const userInfo = {};
      userItems.forEach((item) => {
        userInfo[item] = user[item];
      });
      return setInfo(userInfo);
    } catch (error) {
      toast.error(error?.response?.data?.message ?? error?.message ?? error);
    }
  }

  const { mutateAsync: fetchUser, isLoading: userLoading } = useMutation({
    mutationFn: fetchUserInfo,
  });

  useEffect(() => {
    if (info?.username?.length === 0) {
      fetchUser();
    }
  }, [info]);

  function handleChange(event) {
    setInfo({ ...info, [event.target.name]: event.target.value });
  }
  async function handleUpdating(event) {
    event.preventDefault();
    if (!(info.password === info.confirm_password)) {
      return toast.error("password and confirm password do not match");
    }
    try {
      const { confirm_password, ...rest } = info;
      Object.keys(userItems).forEach((key) => {
        if (!key || info[key]?.length === 0) {
          return toast.error("invalid key sent for " + key);
        }
      });
      await http.put(`user/edit/${isUserLoggedIn?.user?._id}`, rest, {
        params: { id: isUserLoggedIn?.user?._id },
        headers: { Authorization: "Bearer " + isUserLoggedIn?.user?.token },
      });
      return router.push("/");
    } catch (error) {
      toast.error(error?.response?.data?.message ?? error?.message ?? error);
    }
  }

  const { mutateAsync, isLoading } = useMutation({
    mutationFn: handleUpdating,
  });

  return (
    <Fragment>
      <Toaster />
      {userLoading ? (
        <MutatingDots
          color="#81858b"
          secondaryColor="#81858b"
          radius="12.5"
          ariaLabel="mutating-dots-loading"
          wrapperClass={styles.loadingComponent}
          visible={true}
        />
      ) : (
        <form
          onSubmit={(e) => mutateAsync(e)}
          className={styles.completeProfile}
        >
          <div>
            <section>
              <label htmlFor="first_name">firstName:</label>
              <input
                type="text"
                value={info.first_name}
                onChange={(e) => handleChange(e)}
                name="first_name"
                maxLength="20"
                minLength="2"
              />
            </section>
            <section>
              <label htmlFor="last_name">lastName:</label>
              <input
                type="text"
                name="last_name"
                value={info.last_name}
                onChange={(e) => handleChange(e)}
                maxLength="20"
                minLength="2"
              />
            </section>
            <section>
              <label htmlFor="username">username:</label>
              <input
                onInvalid={() =>
                  toast.error("username must be 5-30 characters long")
                }
                type="text"
                name="username"
                value={info.username}
                onChange={(e) => handleChange(e)}
                maxLength="30"
                minLength="5"
              />
            </section>
            <section>
              <label htmlFor="email">email:</label>
              <input
                type="email"
                value={info.email}
                onChange={(e) => handleChange(e)}
                name="email"
                maxLength="20"
                minLength="2"
              />
            </section>
          </div>
          <div>
            <section>
              <label htmlFor="password">password:</label>
              <span>
                {isInputVisible ? (
                  <AiOutlineEyeInvisible
                    className={styles.eyeIcon}
                    onClick={() => setInput(!isInputVisible)}
                  />
                ) : (
                  <AiOutlineEye
                    className={styles.eyeIcon}
                    onClick={() => setInput(!isInputVisible)}
                  />
                )}
                <input
                  type={isInputVisible ? "text" : "password"}
                  value={info?.password ?? ""}
                  onChange={(e) => handleChange(e)}
                  name="password"
                  className={styles.passwordInput}
                  minLength="8"
                />
              </span>
            </section>
            <section>
              <label htmlFor="confirm_password">
                confirmPassword:&nbsp;&nbsp;{" "}
              </label>
              <input
                type={isInputVisible ? "text" : "password"}
                name="confirm_password"
                value={info.confirm_password}
                onChange={(e) => handleChange(e)}
                minLength="8"
              />
            </section>
            <section>
              <label htmlFor="birthday">birthday:</label>
              <input
                type="text"
                value={info.birthday}
                onChange={(e) => handleChange(e)}
                name="birthday"
                onInvalid={() =>
                  toast.error("birthday format must be yyyy/mm/dd")
                }
                maxLength="10"
                minLength="10"
              />
            </section>
            <button type="submit" disabled={isLoading}>
              Update info
            </button>
          </div>
        </form>
      )}
    </Fragment>
  );
}

export default CompleteProfile;
