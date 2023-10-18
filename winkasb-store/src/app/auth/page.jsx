"use client";
import LoginPage from "../components/login";
import CheckOTP from "../components/check-otp";
import { Fragment, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import http from "@/app/axios-instances";
import { useMutation } from "@tanstack/react-query";

function AuthPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOTP] = useState("");
  const [step, setStep] = useState(1);
  const [user, setUser] = useState(null);
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
      setUser(data?.user);
    } catch (error) {
      toast.error(error?.response?.data?.message ?? error?.message ?? error);
    }
  }
  const mutation = useMutation({
    mutationFn: step === 1 ? HandleLogin : ValidateOTP,
  });
  return (
    <Fragment>
      <Toaster />
      {step === 1 ? (
        <LoginPage
          phone={phone}
          setPhone={setPhone}
          mutate={mutation.mutateAsync}
          loading={mutation.isLoading}
        />
      ) : (
        <CheckOTP
          otp={otp}
          setOTP={setOTP}
          mutate={mutation.mutateAsync}
          loading={mutation.isLoading}
        />
      )}
    </Fragment>
  );
}

export default AuthPage;
