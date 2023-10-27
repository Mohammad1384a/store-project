"use client";
import LoginPage from "../components/login";
import CheckOTP from "../components/check-otp";
import { Fragment, useEffect, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import http from "@/app/axios-instances";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";
import { decode } from "jsonwebtoken";

function AuthPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOTP] = useState("");
  const [step, setStep] = useState(1);
  const [timer, setTimer] = useState(90);
  const router = useRouter();
  const [userCookie, setUserCookie] = useCookies(["user"]);
  // async function UpdateToken() {
  //   try {
  //     const { data } = await http.post("user/auth/refresh-token", {
  //       phone,
  //       refreshToken: userCookie?.user?.refreshToken ?? "",
  //     });
  //     return data;
  //   } catch (error) {
  //     toast.error(error?.response?.data?.message ?? error?.message ?? error);
  //   }
  // }
  // const tokenExp = decode(userCookie?.user?.token, { complete: true });
  // const tokenExpired =
  //   Date.now() >= Math.floor(tokenExp?.payload?.exp * 1000) ? false : true;
  // console.log(tokenExpired);
  // useMemo(async () => {
  //   console.log(tokenExpired);
  //   if (tokenExpired && userCookie?.user?.token?.length > 0) {
  //     try {
  //       const newToken = await UpdateToken();
  //       return console.log(newToken);
  //     } catch (error) {
  //       toast.error(error?.response?.data?.message ?? error?.message ?? error);
  //     }
  //   }
  // }, [tokenExpired]);
  // const refreshTokenExp = decode(userCookie?.user?.refreshToken, {
  //   complete: true,
  // });
  // const refrehTokenExpired =
  //   Date.now() >= Math.floor(refreshTokenExp?.payload?.exp * 1000)
  //     ? false
  //     : true;
  // useMemo(() => {
  //   if (!refrehTokenExpired) {
  //     const { refreshToken, ...newCookie } = userCookie;
  //     setUserCookie("user", newCookie, {
  //       maxAge: Math.floor(60 * 60 * 24 * 20),
  //       sameSite: "strict",
  //       path: "/",
  //     });
  //   } else {
  //     removeUserCookie("user", {
  //       maxAge: Math.floor(60 * 60 * 24 * 20),
  //       sameSite: "strict",
  //       path: "/",
  //     });
  //   }
  // }, [refrehTokenExpired]);

  async function HandleLogin(event) {
    event?.preventDefault();
    const type = Number(phone);
    if (!type || !(phone?.length === 11)) {
      toast.error("phone number must be a number and have 11 digits");
    }
    try {
      const { data } = await http.post("user/auth/otp", {
        phone,
      });
      data?.status === 200 && toast.success("SMS sent successfully");
      setStep(2);
    } catch (error) {
      toast.error(error?.response?.data?.message ?? error?.message ?? error);
    }
  }
  async function ValidateOTP(event) {
    event?.preventDefault();
    const type = Number(otp);
    if (!type || !(otp?.length === 5)) {
      toast.error("otp number must be a number and have 5 digits");
    }
    try {
      const { data } = await http.post("user/auth/login", {
        phone,
        code: otp,
      });
      data?.status === 200 && toast.success("you are logged in successfully");
      // cookie expires after 20 days
      setUserCookie(
        "user",
        {
          _id: data?.user?._id || "",
          token: data?.user?.token || "",
          refreshToken: data?.refreshToken || "",
          phone: phone || "",
        },
        {
          maxAge: Math.floor(60 * 60 * 24 * 20),
          sameSite: "strict",
          path: "/",
        }
      );
      return data?.user.email && data?.user.first_name
        ? router.push("/")
        : router.push("/complete-profile");
    } catch (error) {
      toast.error(error?.response?.data?.message ?? error?.message ?? error);
    }
  }
  const phoneMutation = useMutation({
    mutationFn: HandleLogin,
  });
  const otpMutation = useMutation({
    mutationFn: ValidateOTP,
  });
  return (
    <Fragment>
      <Toaster />
      {step === 1 ? (
        <LoginPage
          phone={phone}
          setPhone={setPhone}
          mutate={phoneMutation.mutateAsync}
          loading={phoneMutation.isLoading}
        />
      ) : (
        <CheckOTP
          otp={otp}
          setOTP={setOTP}
          mutate={otpMutation.mutateAsync}
          loading={otpMutation.isLoading}
          timer={timer}
          setTimer={setTimer}
          getOTP={phoneMutation.mutate}
          setStep={setStep}
        />
      )}
    </Fragment>
  );
}

export default AuthPage;
