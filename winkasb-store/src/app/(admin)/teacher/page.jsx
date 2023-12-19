"use client";
import http from "@/app/axios-instances";
import AddCourse from "../../components/teacher/addCourse";
import AddChapter from "@/app/components/teacher/addChapter";
import styles from "../admin.module.css";
import DeleteCourse from "@/app/components/teacher/delete-course";
import { Fragment, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Toaster, toast } from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { MutatingDots } from "react-loader-spinner";
import { FiEdit3 } from "react-icons/fi";
import { BiTrashAlt } from "react-icons/bi";

function TeacherPage() {
  const [isUserLoggedIn] = useCookies(["user"]);
  const [courses, setCourses] = useState(false);
  // page status can be loading,list,course,chapter or episode
  const [pageStatus, setPageStatus] = useState("loading");
  async function getMyCourses() {
    try {
      const { data } = await http.get(
        "admin/course/myCourses/" + isUserLoggedIn?.user?._id,
        {
          headers: { Authorization: "Bearer " + isUserLoggedIn?.user?.token },
        }
      );
      data?.status === 200 && data?.courses && setCourses(data.courses);
      return setPageStatus("list");
    } catch (error) {
      toast.error(error?.response?.data?.message ?? error?.message ?? error);
    }
  }
  const { isLoading, mutateAsync } = useMutation({ mutationFn: getMyCourses });
  useEffect(() => {
    if (!courses) {
      mutateAsync();
    }
  }, [courses]);
  const [chapterInputs, setChapterInputs] = useState({
    title: "",
    body: "",
  });
  const [courseInputs, setCourseInputs] = useState({
    title: "",
    brief_text: "",
    description: "",
    image: {},
    // all tags
    tags: [],
    // input value
    tag: "",
    category: "",
    price: 0,
    discount: 0,
    //notStarted, ongoing, done
    status: "",
    //free, monetary, premium
    value: "",
    teacher: isUserLoggedIn?.user?._id || "",
  });
  const [courseToDelete, setCourseDeletion] = useState(false);

  function returnStatus() {
    switch (pageStatus) {
      case "loading":
        return (
          <MutatingDots
            color="#81858b"
            secondaryColor="#81858b"
            radius="12.5"
            ariaLabel="mutating-dots-loading"
            wrapperClass={styles.loadingComponent}
            visible={true}
          />
        );
      case "course":
        return (
          <AddCourse
            inputs={courseInputs}
            setInputs={setCourseInputs}
            setPageStatus={setPageStatus}
          />
        );
      case "chapter":
        return (
          <AddChapter inputs={chapterInputs} setInputs={setChapterInputs} />
        );
      default:
        return (
          <div className={styles.teacherPage}>
            {courseToDelete && (
              <DeleteCourse
                courseToDelete={courseToDelete}
                setDeleteCourse={setCourseDeletion}
                setCourseList={setCourses}
              />
            )}
            <h3>My Courses:</h3>
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Remove</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>
                {courses &&
                  courses.map((c) => {
                    return (
                      <tr key={c._id}>
                        <td>{c.title}</td>
                        <td>
                          {" "}
                          <BiTrashAlt
                            style={{
                              cursor: "pointer",
                              fontSize: "x-large",
                              color: "#dc2626",
                            }}
                            onClick={() => setCourseDeletion(c._id)}
                          />
                        </td>
                        <td>
                          <FiEdit3
                            style={{ fontSize: "x-large", cursor: "pointer" }}
                          />
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        );
    }
  }

  return (
    <Fragment>
      <Toaster />
      {returnStatus()}
    </Fragment>
  );
}

export default TeacherPage;
