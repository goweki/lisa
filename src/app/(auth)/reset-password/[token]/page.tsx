"use client";
import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SVGemail, SVGhome, SVGpassword } from "@/components/atoms/svgs";
import { InputText } from "@/components/atoms/inputs";
import {
  emailValidator,
  nameValidator,
  passwordValidator,
} from "@/lib/utils/inputValidators";
import { ButtonPrimary } from "@/components/atoms/buttons";
import { Loader } from "@/components/atoms/loader";
import { strsMatch } from "@/lib/utils/stringHandlers";
import toast from "react-hot-toast";

export default function ResetPassword(props: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const searchParams = use(props.searchParams);
  const params = use(props.params);
  const { token } = params;
  const { email_ } = searchParams;
  const [password, setPassword] = useState({ value: "", error: "" });
  const [passwordRepeat, setRepeatPassword] = useState({
    value: "",
    error: "",
  });
  const [UIstate, setUIstate] = useState("");
  const router = useRouter();
  // onMount
  useEffect(() => {
    (async () => {
      if (!token || emailValidator(email_)) {
        const errorMessage = !token
          ? "no token provided"
          : emailValidator(email_);
        console.error("error mounting page - ", errorMessage);
        toast.error(errorMessage);
        router.push("/reset-password");
      }

      try {
        // API call to confirm user,token,expiry
        const fetchOptions = {
          method: "GET",
        };

        const response = await fetch(
          `/api/auth/reset-password?email=${encodeURIComponent(email_)}&token=${token}`,
          fetchOptions,
        ).then(async (res_) => {
          if (res_.ok) {
            return await res_.json();
          } else {
            const error_ =
              (await res_.json()) || "Unknown error, try again later";
            console.error("Error in sending reset password link:", error_);
            toast.error(error_.message || error_);
            return null;
          }
        });

        if (!response) return router.push(`/reset-password`);

        toast.success(response.message);
        setUIstate("OK");
      } catch (error) {}
    })();
  }, [email_, token, router]);
  // handle Submit
  async function handleChangePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUIstate("loading");
    // if field errors
    const passwordError_ = passwordValidator(password.value);
    const passwordMismatch_ = !strsMatch(password.value, passwordRepeat.value);
    if (passwordError_ || passwordMismatch_) {
      if (passwordError_) {
        setPassword((prev) => ({ ...prev, error: passwordError_ }));
      }
      if (passwordMismatch_) {
        setRepeatPassword((prev) => ({
          ...prev,
          error: "Passwords dont match",
        }));
      }

      return setUIstate("OK");
    }
    // if valid fields
    try {
      // API call
      const fetchOptions = {
        method: "PUT",
        body: JSON.stringify({
          userEmail: email_,
          token,
          password: password.value,
        }),
      };

      console.log("Request to update password for - ", email_);

      const response = await fetch(
        "/api/auth/reset-password",
        fetchOptions,
      ).then(async (res_) => {
        if (res_.ok) {
          return await res_.json();
        } else {
          const error_ =
            res_.status + "-" + (await res_.json()).message ||
            "Unknown error, try again later";
          console.error(error_);
          toast.error(error_);
          return null;
        }
      });

      if (!response) return setUIstate("OK");

      toast.success(response.message);
      router.push(`/signin`);
    } catch (err: any) {
      console.error("ERROR caught - ResetPassword Page - ", err.message);
      toast.error(`Failed to update password, try again later`);
    }
  }
  // Render
  return !UIstate ? (
    <Loader />
  ) : (
    <div className="flex flex-1 flex-col w-full items-center">
      <div className="w-full max-w-md p-4 m-auto divide-y space-y-3 divide-emerald-800">
        <p
          className={`text-xl font-bold text-emerald-800 dark:text-emerald-500 text-center pb-6`}
        >
          New Password
        </p>
        <form
          id="new-password"
          className="bg-background-surface dark:bg-background-dark-surface rounded space-y-6 md:space-y-6 p-8 shadow-[6px_6px_4px_#ecf0f4,-6px_-6px_4px_#f6fafe] dark:shadow-[1px_1px_2px_#0c1221,-1px_-1px_2px_#121c33]"
          onSubmit={handleChangePassword}
        >
          {/* INPUT FIELDS */}
          <div className="space-y-4">
            <InputText
              label="Password"
              name="password"
              type="password"
              placeholder="Enter new Password"
              icon={SVGpassword}
              valObj={password}
              setValue={setPassword}
              valValidator={passwordValidator}
            />
            <InputText
              label="Re-enter Password"
              name="repeat-password"
              type="password"
              placeholder="Re-enter Password"
              icon={SVGpassword}
              valObj={passwordRepeat}
              setValue={setRepeatPassword}
              valValidator={(val) => {
                if (strsMatch(val, password.value)) return "";
                else return "passwords dont match";
              }}
            />
          </div>
          {/* Buttons */}
          <div className="mx-2 pt-4">
            <ButtonPrimary
              label="Change Password"
              type="submit"
              disabled={
                !password.value ||
                !!password.error ||
                !passwordRepeat.value ||
                !!passwordRepeat.error
              }
              loading={UIstate === "loading"}
              onClick={() => "Submitting"}
            />
          </div>
          <div className="flex flex-wrap items-center justify-between">
            <Link href={"/"} className="mt-3">
              <SVGhome className="h-6 w-6" />
            </Link>
            <Link
              href="/signin"
              className="text-font-inactive italic dark:text-font-dark-inactive dark:hover:text-font-dark-faded text-sm font-medium  hover:underline"
            >
              Sign In
            </Link>
          </div>
          {/* Signup */}
          {/* <p className="text-sm font-light text-font-inactive dark:text-font-dark-inactive">
          Don’t have an account yet?{" "}
          <a
            href="#"
            className="font-medium text-primary-600 hover:underline dark:text-primary-500 dark:hover:text-font-dark-faded"
          >
            Sign up
          </a>
        </p> */}
        </form>
      </div>
    </div>
  );
}
