"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { SVGemail, SVGhome, SVGpassword } from "@/components/atoms/svgs";
import { InputText } from "@/components/atoms/inputs";
import {
  emailValidator,
  nameValidator,
  passwordValidator,
} from "@/helpers/inputValidators";
import { ButtonPrimary } from "@/components/atoms/buttons";
import { Loader1 } from "@/components/atoms/loader";
import { httpCodes } from "@/lib/configs";
import { strsMatch } from "@/helpers/stringHandlers";
import toast from "react-hot-toast";

export default function ResetPassword({
  params,
  searchParams,
}: {
  params: { token: string };
  searchParams: { [key: string]: string };
}) {
  const { token } = params;
  const { email_ } = searchParams; // /token?email_=email@mail.com
  // console.log("EMAIL....", email_);
  // states
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
        const errorMessage = emailValidator(email_) || "invalid email";
        toast.error(errorMessage);
        router.push("/reset-password");
      }

      try {
        // API call to confirm user,token,expiry
        const fetchOptions = {
          method: "GET",
        };

        const response = await fetch(
          `/api/auth/reset-password?email=${email_}&token=${token}`,
          fetchOptions
        ).then(async (res_) => {
          if (res_.status === 200) {
            return await res_.json();
          } else {
            console.log(`ERROR: ` + JSON.stringify(res_));
            // setUIstate(httpCodes[res_.status]);
            if (res_.status && res_.status in httpCodes) {
              setUIstate(httpCodes[res_.status]);
            } else {
              setUIstate("Unknown Error, try again later"); // Handle unknown errors
            }
          }
        });

        //validate reseting password
        if (response?.success) {
          toast.success(response.success);
          setUIstate("OK");
        } else {
          setUIstate(
            (Object.values(response)[0] as string) ??
              "Unknown error, try again later"
          );
          router.push(`/reset-password`);
        }
      } catch (error) {}
    })();
  }, [email_, token, router]);
  // Notify on UIstate-error
  useEffect(() => {
    if (UIstate && UIstate !== "OK" && UIstate !== "loading") {
      toast.error(UIstate);
      setUIstate("OK");
    }
  }, [UIstate]);
  // Notify on password-error
  useEffect(() => {
    if (password.error || passwordRepeat.error) {
      toast.error(password.error || passwordRepeat.error);
      setUIstate("OK");
    }
  }, [password.error, passwordRepeat.error]);
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
      return;
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

      const response = await fetch(
        "/api/auth/reset-password",
        fetchOptions
      ).then(async (res_) => {
        if (res_.status === 200) {
          return await res_.json();
        } else {
          console.log(`ERROR: ` + JSON.stringify(res_));
          // setUIstate(httpCodes[res_.status]);
          if (res_.status && res_.status in httpCodes) {
            setUIstate(httpCodes[res_.status]);
          } else {
            setUIstate("Unknown Error, try again later"); // Handle unknown errors
          }
        }
      });
      //validate reseting password
      if (response?.success) {
        toast.success(response.success);
        router.push(`/signin`);
      } else {
        setUIstate(
          (Object.values(response)[0] as string) ??
            "Unknown error, try again later"
        );
      }
    } catch (err) {
      console.log("ERROR caught - D27g");
    }
  }
  // Render
  return !UIstate ? (
    <Loader1 />
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
            {/* <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="remember"
                aria-describedby="remember"
                type="checkbox"
                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                required=""
              />
            </div>
            <div className="ml-3 text-sm">
              <label
                htmlFor="remember"
                className="text-font-inactive dark:text-font-dark-inactive"
              >
                Remember me
              </label>
            </div>
          </div> */}
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
