"use client";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { decode } from "jsonwebtoken";
import http from "./axios-instances";
import { toast, Toaster } from "react-hot-toast";

function Home() {
  const [userCookie, setUserCookie, removeUserCookie] = useCookies(["user"]);
  const tokenExp = decode(userCookie?.user?.token, { complete: true });
  const [tokenExpired, setTokenExpiration] = useState(
    Date.now() >= Math.floor(tokenExp?.payload?.exp * 1000) ? true : false
  );
  const timeToExpire =
    Math.floor(tokenExp?.payload?.exp * 1000 - Date.now()) || 0;
  if (timeToExpire > 0 && tokenExpired === false) {
    setTimeout(() => {
      setTokenExpiration(true);
    }, timeToExpire);
  }
  useEffect(() => {
    if (
      tokenExpired &&
      userCookie?.user?.token?.length > 0 &&
      userCookie?.user?.refreshToken?.length > 0
    ) {
      async function getNewAccessToken() {
        try {
          const { data } = await http.post("user/auth/refresh-token", {
            phone: userCookie?.user?.phone ?? "",
            refreshToken: userCookie?.user?.refreshToken ?? "",
          });
          if (data?.status === 200 && data?.token?.length > 0) {
            const { token, ...prevCookie } = userCookie?.user;
            setUserCookie("user", {
              ...prevCookie,
              token: data?.token?.length > 0 ? data.token : "",
            });
          }
          return setTokenExpiration(false);
        } catch (error) {
          toast.error(
            error?.response?.data?.message ?? error?.message ?? error
          );
        }
      }
      getNewAccessToken();
    }
  }, [tokenExpired]);
  const refreshTokenExp = decode(userCookie?.user?.refreshToken, {
    complete: true,
  });
  const [refreshTokenExpired, setRefreshTokenExpiration] = useState(
    Date.now() >= Math.floor(refreshTokenExp?.payload?.exp * 1000)
      ? true
      : false
  );
  const timeToExpireRefreshToken =
    Math.floor(refreshTokenExp?.payload?.exp * 1000 - Date.now()) || 0;
  if (!refreshTokenExpired && timeToExpireRefreshToken > 0) {
    setTimeout(() => {
      setRefreshTokenExpiration(true);
    }, timeToExpire);
  }
  useEffect(() => {
    if (refreshTokenExpired && userCookie?.user?.refreshToken?.length > 0) {
      removeUserCookie("user");
    }
  }, [refreshTokenExpired]);
  return (
    <div>
      <Toaster />
      hello front end
    </div>
  );
}

export default Home;
