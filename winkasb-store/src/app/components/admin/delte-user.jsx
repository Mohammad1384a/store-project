import { useMutation } from "@tanstack/react-query";
import styles from "../../(admin)/admin.module.css";
import { toast, Toaster } from "react-hot-toast";
import http from "@/app/axios-instances";
import { useCookies } from "react-cookie";
import { Fragment } from "react";

function DeleteUser({
  visibility,
  setVisibility,
  userId,
  userList,
  setUserList,
}) {
  const [isUserLoggedIn] = useCookies(["user"]);

  async function deleteUserById() {
    try {
      const { data } = await http.delete(`user/remove/${userId}`, {
        headers: { Authorization: "Bearer " + isUserLoggedIn?.user?.token },
      });
      data?.status === 200 &&
        data?.deleteUser?.acknowledged &&
        toast.success("User deleted successfully");
      const newUserList = userList?.filter((user) => {
        return user._id !== userId;
      });
      return data?.status === 200 && newUserList && setUserList(newUserList);
    } catch (error) {
      toast.error(error?.response?.data?.message ?? error?.message ?? error);
    }
  }
  const { mutateAsync } = useMutation({
    mutationFn: deleteUserById,
  });
  return (
    <Fragment>
      <Toaster />
      <section className={visibility ? styles.deleteUser : styles.none}>
        <div>
          <h3>Sure You Wanna Delete User?</h3>
          <section>
            <button
              onClick={() => {
                setVisibility(false);
                mutateAsync();
              }}
            >
              Yes
            </button>
            <button onClick={() => setVisibility(false)}>No</button>
          </section>
        </div>
      </section>
    </Fragment>
  );
}

export default DeleteUser;
