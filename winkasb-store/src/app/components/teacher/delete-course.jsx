import { useCookies } from "react-cookie";
import styles from "../../(admin)/admin.module.css";
import { GrClose } from "react-icons/gr";
import { useMutation } from "@tanstack/react-query";
import { MutatingDots } from "react-loader-spinner";
import { toast, Toaster } from "react-hot-toast";
import http from "@/app/axios-instances";

function DeleteCourse({ courseToDelete, setDeleteCourse, setCourseList }) {
  console.log(courseToDelete);
  const [isUserLoggedIn] = useCookies(["user"]);

  async function deleteCourseById() {
    try {
      const token = isUserLoggedIn?.user?.token;
      const { data } = await http.delete(
        `admin/course/remove/${courseToDelete}`,
        {
          headers: { Authorization: "Bearer " + token },
        }
      );
      data.status === 200 &&
        data?.remove &&
        setCourseList((prev) => prev.filter((e) => e._id !== courseToDelete));
      toast.success("Course Deleted Successfully");
      return setDeleteCourse(false);
    } catch (error) {
      toast.error(error?.response?.data?.message ?? error?.message ?? error);
    }
  }

  const { mutateAsync, isLoading } = useMutation({
    mutationFn: deleteCourseById,
  });

  return (
    <div className={courseToDelete ? styles.deleteProduct : styles.none}>
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
        <section>
          <div>
            <h4>Sure You Want To Delete Course?</h4>
            <GrClose
              onClick={() => setDeleteCourse(false)}
              style={{ cursor: "pointer" }}
            />
          </div>
          <div>
            <button onClick={() => mutateAsync()}>Yes</button>
            <button onClick={() => setDeleteCourse(false)}>No</button>
          </div>
        </section>
      )}
    </div>
  );
}

export default DeleteCourse;
