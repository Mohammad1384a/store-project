import { Fragment, useMemo, useState } from "react";
import styles from "../../(profile)/profile.module.css";
import { GrClose } from "react-icons/gr";
import EditName from "./edit-name";
import EditPassword from "./edit-password";
import { useCookies } from "react-cookie";
import { useMutation } from "@tanstack/react-query";
import { Toaster, toast } from "react-hot-toast";
import http from "../../axios-instances";

function EditUserInfo({
  visibility,
  setVisibility,
  inputType,
  userInfo,
  setUserInfo,
}) {
  const [input, setInput] = useState("");
  const [userCookie] = useCookies(["user"]);
  const [newPassword, setNewPassword] = useState("");
  const [timeToUpdate, setUpdateTime] = useState(0);

  useMemo(() => {
    if (timeToUpdate) {
      const updateInterval = setInterval(() => {
        setUpdateTime(Math.floor(timeToUpdate - 1));
      }, 1000);
      timeToUpdate === 0 && clearInterval(updateInterval);
    }
  }, [timeToUpdate]);

  useMemo(() => {
    if (input?.length === 0) {
      setInput(userInfo[inputType]);
    }
  }, [inputType]);

  async function updateUserInfo() {
    try {
      if (timeToUpdate) {
        return toast.error("You should wait for " + timeToUpdate + " seconds");
      }

      if (inputType === "password" && !(input === userInfo[inputType])) {
        if (newPassword === userInfo[inputType]) {
          return toast.error("New password must not match the old one");
        }
        return toast.error("Password does not match");
      }

      const editInfo = {};
      editInfo[inputType] = inputType === "password" ? newPassword : input;

      const { data } = await http.put(
        `user/edit/${userCookie?.user?._id}`,
        editInfo,
        {
          headers: { Authorization: "Bearer " + userCookie?.user?.token },
          params: { id: userCookie?.user?._id },
        }
      );

      data?.status === 200 &&
        setUserInfo({
          ...userInfo,
          [inputType]: inputType === "password" ? newPassword : input,
        });
      toast.success("Profile Updated Successfully");
      setUpdateTime(30);
    } catch (error) {
      toast.error(error?.response?.data?.message ?? error?.message ?? error);
    }
    setInput("");
    setNewPassword("");
    return setVisibility(false);
  }

  const { mutateAsync } = useMutation({
    mutationFn: updateUserInfo,
  });

  return (
    <Fragment>
      <Toaster />
      <section
        className={visibility ? styles.editUserInfo : styles.invisibleEditing}
      >
        <div>
          <section className={styles.editInfoHeader}>
            <h3>You Can Update {inputType}</h3>
            <GrClose
              className={styles.closeIcon}
              onClick={() => {
                setInput("");
                setVisibility(false);
              }}
            />
          </section>
          {inputType === "password" ? (
            <EditPassword
              input={input}
              setInput={setInput}
              updatePass={updateUserInfo}
              newPassword={newPassword}
              setNewPassword={setNewPassword}
            />
          ) : (
            <EditName
              inputType={inputType}
              nameInput={input}
              setInput={setInput}
            />
          )}
          <button onClick={() => mutateAsync()}>Update Info</button>
        </div>
      </section>
    </Fragment>
  );
}

export default EditUserInfo;
