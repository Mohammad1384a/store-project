"use client";
import AddCourse from "../../components/teacher/addCourse";
import { Fragment, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Toaster, toast } from "react-hot-toast";

function TeacherPage() {
  const [isUserLoggedIn] = useCookies(["user"]);
  // page status can be list,course,chapter or episode
  const [pageStatus, setPageStatus] = useState("course");
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
  useEffect(() => {}, [courseInputs]);
  return (
    <Fragment>
      <Toaster />
      {pageStatus === "course" ? (
        <AddCourse
          inputs={courseInputs}
          setInputs={setCourseInputs}
          setPageStatus={setPageStatus}
        />
      ) : (
        <h3>something</h3>
      )}
    </Fragment>
  );
}

export default TeacherPage;
