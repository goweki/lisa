"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import {
  SVGback,
  SVGemail,
  SVGhome,
  SVGpassword,
} from "@/components/atoms/svgs";
import { InputText } from "@/components/atoms/inputs";
import { emailValidator, passwordValidator } from "@/helpers/inputValidators";
import { ButtonPrimary } from "@/components/atoms/buttons";
import { Loader1 } from "@/components/atoms/loader";

export default function SigninPage() {
  // states
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [UIstate, setUIstate] = useState("");
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  // onMount
  useEffect(() => {
    if (searchParams.has("error")) {
      setUIstate("Authentication failed");
    } else setUIstate("OK");
  }, [searchParams]);
  // Notify on UIstate-error
  useEffect(() => {
    if (UIstate && UIstate !== "OK" && UIstate !== "loading") {
      toast.error(UIstate);
      setUIstate("OK");
    }
  }, [UIstate]);
  // Notify on input-Error
  useEffect(() => {
    if (email.error || password.error) {
      setUIstate("OK");
      if (email.error) toast.error(email.error);
      if (password.error) toast.error(password.error);
    }
  }, [email.error, password.error]);
  // handle SignIn
  async function handleSubmit() {
    if (!email.value || !password.value) {
      setUIstate("ERROR: Email/Password is empty");
    }
    setUIstate("loading");
    // validate inputs: email & password
    const emailError_ = emailValidator(email.value);
    const passwordError_ = passwordValidator(password.value);
    if (emailError_ || passwordError_) {
      if (emailError_) setEmail({ ...email, error: emailError_ });
      if (passwordError_) setPassword({ ...password, error: passwordError_ });
      return;
    }
    //sign in
    const res = await signIn("credentials", {
      username: email.value,
      password: password.value,
      redirect: true,
      callbackUrl: callbackUrl ?? "/user",
    });
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
          Welcome
        </p>
        <form
          id="signin"
          className="bg-background-surface dark:bg-background-dark-surface rounded space-y-6 md:space-y-6 p-8 shadow-[6px_6px_4px_#ecf0f4,-6px_-6px_4px_#f6fafe] dark:shadow-[1px_1px_2px_#0c1221,-1px_-1px_2px_#121c33]"
        >
          {/* INPUT FIELDS */}
          <div className="space-y-4">
            <InputText
              label="Email"
              name={email}
              type="email"
              placeholder="Enter your email address"
              icon={SVGemail}
              value={email}
              setValue={setEmail}
            />
            <InputText
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
              icon={SVGpassword}
              value={password}
              setValue={setPassword}
            />
          </div>
          {/* forgot passwords */}
          <div className="mx-2 pt-4">
            <ButtonPrimary
              label="Sign In"
              type="submit"
              disabled={!email.value || !password.value}
              loading={UIstate === "loading"}
              onClick={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
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
            <Link href={callbackUrl ?? "/"}>
              {callbackUrl ? (
                <SVGback className="h-6 w-6" />
              ) : (
                <SVGhome className="h-6 w-6" />
              )}
            </Link>
            <Link
              href="#"
              className="text-font-inactive italic dark:text-font-dark-inactive dark:hover:text-font-dark-faded text-sm font-medium  hover:underline"
            >
              Forgot password?
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
