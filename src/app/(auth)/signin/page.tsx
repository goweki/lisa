"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { SVGemail, SVGhome, SVGpassword } from "@/components/atoms/svgs";
import { InputText } from "@/components/atoms/inputs";
import {
  emailValidator,
  nameValidator,
  passwordValidator,
} from "@/helpers/inputValidators";
import { ButtonPrimary } from "@/components/atoms/buttons";
import { Loader } from "@/components/atoms/loader";

export default function SigninPage() {
  // states
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [UIstate, setUIstate] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  // onMount
  useEffect(() => {
    if (searchParams.has("error")) {
      const error_ = searchParams.get("error");
      toast.error(qParamsErrors[error_ as keyof typeof qParamsErrors]);
    }
    setUIstate("OK");
  }, [searchParams]);
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
      setUIstate("OK");
      return;
    }
    //sign in
    console.log(
      `........................\nCHECKPOINT: validating user\n > ${email.value} , ${password.value}\n..................`
    );
    const res = await signIn("credentials", {
      email: email.value,
      password: password.value,
      redirect: false,
    });

    if (res?.ok) {
      router.push(callbackUrl);
    } else {
      if (res?.error)
        toast.error(qParamsErrors[res.error as keyof typeof qParamsErrors]);
      else toast.error("Sign in failed. Try again later.");
      console.log(
        `........................\n > FAILED: user not validated\n >`,
        res
      );
      setUIstate("OK");
    }
  }
  // Render
  return !UIstate ? (
    <Loader />
  ) : (
    <div className="flex flex-1 flex-col w-full items-center">
      <div className="w-full max-w-md p-4 m-auto divide-y space-y-3 divide-primary">
        <p className={`text-primary text-xl font-bold text-center pb-6`}>
          Welcome
        </p>
        <form
          id="signin"
          className="rounded space-y-6 md:space-y-6 p-8 shadow dark:shadow-dark"
        >
          {/* INPUT FIELDS */}
          <div className="space-y-4">
            <InputText
              label="Email"
              name="email"
              type="email"
              placeholder="Enter your email address"
              icon={SVGemail}
              valObj={email}
              setValue={setEmail}
              valValidator={nameValidator}
            />
            <InputText
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
              icon={SVGpassword}
              valObj={password}
              setValue={setPassword}
              valValidator={passwordValidator}
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
            <Link
              href="/register"
              className="text-font-inactive italic text-sm font-medium  hover:underline"
            >
              Sign Up
            </Link>
            <Link href={"/"} className="mt-3">
              <SVGhome className="h-6 w-6 text-emerald-800 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-200" />
            </Link>
            <Link
              href="/reset-password"
              className="text-font-inactive italic text-sm font-medium  hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

const qParamsErrors = {
  OAuthSignin: "Error in constructing an authorization URL",
  OAuthCallback: "Error in handling the response from OAuth provider",
  OAuthCreateAccount: "Could not create user",
  EmailCreateAccount: "Could not create user",
  Callback: "Error in the OAuth callback handler route",
  OAuthAccountNotLinked:
    "Email is already linked, but not with this OAuth account",
  EmailSignin: "Sending the e-mail with verification token failed",
  CredentialsSignin: "Invalid credentials",
  SessionRequired: "The content of this page requires you to be signed in",
  Default: "An error occured",
};
