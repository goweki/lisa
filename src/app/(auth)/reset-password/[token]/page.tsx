"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
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

export default function ResetPassword({ params }: any) {
  // states
  const [user, setUser] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [passwordRepeat, setPasswordRepeat] = useState({
    value: "",
    error: "",
  });
  const [UIstate, setUIstate] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  // onMount
  useEffect(() => {
    if (searchParams.has("error")) {
      const error_ = searchParams.get("error") as string;
      // setUIstate(qParamsErrors[error_]);
      if (error_ && error_ in qParamsErrors) {
        setUIstate(qParamsErrors[error_]);
      } else {
        setUIstate("Unknown Error, try again later"); // Handle unknown errors
      }
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
    if (email.error) {
      setUIstate("OK");
      if (email.error) toast.error(email.error);
    }
  }, [email.error]);
  // handle Submit
  async function handleSendResetLink(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.value) {
      setUIstate("Could not parse email: Confirm email provided");
    }
    setUIstate("loading");
    // validate inputs: email & password
    const emailError_ = emailValidator(email.value);
    if (emailError_) {
      setEmail((prev) => ({ ...prev, error: emailError_ }));

      return;
    }
    console.log(
      `........................\nCHECKPOINT: sending reset password token to user\n > ${email.value}\n..................`
    );
    // API call
    const fetchOptions = {
      method: "POST",
      body: JSON.stringify({ userEmail: email.value }),
    };

    const response = await fetch("/api/auth/reset-password", fetchOptions).then(
      async (res_) => {
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
      }
    );
    //validate sending reset link
    if (response?.success) {
      toast.success(response.success);
      router.push(`/`);
    } else {
      setUIstate(
        (Object.values(response)[0] as string) ??
          "Unknown error, try again later"
      );
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
          Reset Password
        </p>
        <form
          id="reset-password"
          className="bg-background-surface dark:bg-background-dark-surface rounded space-y-6 md:space-y-6 p-8 shadow-[6px_6px_4px_#ecf0f4,-6px_-6px_4px_#f6fafe] dark:shadow-[1px_1px_2px_#0c1221,-1px_-1px_2px_#121c33]"
          onSubmit={handleSendResetLink}
        >
          {/* INPUT FIELDS */}
          <div className="mb-12">
            <InputText
              label="Email"
              name="email"
              type="email"
              placeholder="Enter your email address"
              icon={SVGemail}
              valObj={email}
              setValue={setEmail}
              valValidator={emailValidator}
            />
          </div>
          {/* forgot passwords */}
          <div className="mx-2 pt-4">
            <ButtonPrimary
              label="Get Password Reset Link"
              type="submit"
              disabled={!email.value || email.error}
              loading={UIstate === "loading"}
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

const qParamsErrors: {
  [key: string]: string;
} = {
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
