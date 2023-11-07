"use client";
import { Fragment, useEffect, useState } from "react";
import styles from "../profile.module.css";
import { FiEdit3 } from "react-icons/fi";
import { GoDotFill } from "react-icons/go";
import { BiMessageSquareAdd } from "react-icons/bi";
import EditUserInfo from "../../components/profile/edit-user-info";
import { useMutation } from "@tanstack/react-query";
import { MutatingDots } from "react-loader-spinner";
import { Toaster, toast } from "react-hot-toast";
import { useCookies } from "react-cookie";
import http from "@/app/axios-instances";

function ProfilePage() {
  const [userInfo, setUserInfo] = useState(null);
  const [isUserEditing, setEditingState] = useState(false);
  const [inputType, setInputType] = useState(null);
  const [userCookie] = useCookies(["user"]);

  useEffect(() => {
    if (inputType) {
      setEditingState(true);
    }
  }, [inputType]);

  async function fetchUserInfo() {
    try {
      const { data } = await http.get(`user/${userCookie?.user?._id}`, {
        headers: { Authorization: "Bearer " + userCookie?.user?.token },
      });
      return data?.status === 200 && data?.user && setUserInfo(data?.user);
    } catch (error) {
      toast.error(error?.response?.data?.message ?? error?.message ?? error);
    }
  }
  const { isLoading, mutateAsync } = useMutation({
    mutationFn: fetchUserInfo,
  });
  useEffect(() => {
    if (!userInfo) {
      mutateAsync();
    }
  }, []);

  return (
    <Fragment>
      <Toaster />
      {isLoading ? (
        <MutatingDots
          color="#81858b"
          secondaryColor="#81858b"
          radius="12.5"
          ariaLabel="mutating-dots-loading"
          wrapperClass={styles.loadingComponent}
          visible={true}
        />
      ) : (
        userInfo && (
          <Fragment>
            {inputType && (
              <EditUserInfo
                visibility={isUserEditing}
                setVisibility={setEditingState}
                inputType={inputType}
                userInfo={userInfo}
                setUserInfo={setUserInfo}
              />
            )}
            <div className={styles.profilePage}>
              <section>
                <div>
                  <span>first_name</span>
                  <p>{userInfo.first_name}</p>
                </div>
                <p>
                  {userInfo.first_name?.length > 0 ? (
                    <FiEdit3
                      className={styles.profileEditIcon}
                      onClick={() => setInputType("first_name")}
                    />
                  ) : (
                    <BiMessageSquareAdd
                      className={styles.profileEditIcon}
                      onClick={() => setInputType("first_name")}
                    />
                  )}
                </p>
              </section>
              <section>
                <div>
                  <span>last_name</span>
                  <p>{userInfo.last_name}</p>
                </div>
                <p>
                  {userInfo.last_name?.length > 0 ? (
                    <FiEdit3
                      className={styles.profileEditIcon}
                      onClick={() => setInputType("last_name")}
                    />
                  ) : (
                    <BiMessageSquareAdd
                      className={styles.profileEditIcon}
                      onClick={() => setInputType("last_name")}
                    />
                  )}
                </p>
              </section>
              <section>
                <div>
                  <span>username</span>
                  <p>{userInfo.username}</p>
                </div>
                <p>
                  {userInfo.username?.length > 0 ? (
                    <FiEdit3
                      className={styles.profileEditIcon}
                      onClick={() => setInputType("username")}
                    />
                  ) : (
                    <BiMessageSquareAdd
                      className={styles.profileEditIcon}
                      onClick={() => setInputType("username")}
                    />
                  )}
                </p>
              </section>
              <section>
                <div>
                  <span>email</span>
                  <p>{userInfo.email}</p>
                </div>
                <p>
                  {userInfo.email?.length > 0 ? (
                    <FiEdit3
                      className={styles.profileEditIcon}
                      onClick={() => setInputType("email")}
                    />
                  ) : (
                    <BiMessageSquareAdd
                      className={styles.profileEditIcon}
                      onClick={() => setInputType("email")}
                    />
                  )}
                </p>
              </section>
              <section>
                <div>
                  <span>birthday</span>
                  <p>{userInfo.birthday}</p>
                </div>
                <p>
                  {userInfo.birthday?.length > 0 ? (
                    <FiEdit3
                      className={styles.profileEditIcon}
                      onClick={() => setInputType("birthday")}
                    />
                  ) : (
                    <BiMessageSquareAdd
                      className={styles.profileEditIcon}
                      onClick={() => setInputType("birthday")}
                    />
                  )}
                </p>
              </section>
              <section>
                <div>
                  <span>password</span>
                  <p>
                    {userInfo?.password?.split("").map((letter, index) => (
                      <GoDotFill key={index} />
                    ))}
                  </p>
                </div>
                <p>
                  {userInfo.password?.length > 0 ? (
                    <FiEdit3
                      className={styles.profileEditIcon}
                      onClick={() => setInputType("password")}
                    />
                  ) : (
                    <BiMessageSquareAdd
                      className={styles.profileEditIcon}
                      onClick={() => setInputType("password")}
                    />
                  )}
                </p>
              </section>
            </div>
          </Fragment>
        )
      )}
    </Fragment>
  );
}

export default ProfilePage;
