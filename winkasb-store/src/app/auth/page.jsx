"use client";
import LoginPage from "../components/login";
import CheckOTP from "../components/check-otp";
import { Fragment, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import http from "@/app/axios-instances";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";

function AuthPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOTP] = useState("");
  const [step, setStep] = useState(1);
  const [timer, setTimer] = useState(90);
  const router = useRouter();
  const [userCookie, setUserCookie] = useCookies(["user"]);

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
      // cookie expires in a week
      setUserCookie(
        "user",
        {
          _id: data?.user?._id || "",
          token: data?.user?.token || "",
        },
        { maxAge: 604800 }
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
