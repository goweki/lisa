"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import {
  SVGemail,
  SVGhome,
  SVGpassword,
  SVGbriefcase,
} from "@/components/atoms/svgs";
import { ComboboxSearchable, InputText } from "@/components/atoms/inputs";
import {
  emailValidator,
  nameValidator,
  passwordValidator,
} from "@/helpers/inputValidators";
import { ButtonPrimary } from "@/components/atoms/buttons";
import { Loader } from "@/components/atoms/loader";
import {
  Package as PackageType,
  PackageName as PackageNameType,
} from "@/types/transactions";

const packages: PackageType[] = [
  { name: "Basic", index: 0 },
  { name: "Pro", index: 1 },
  { name: "Enterprise", index: 2 },
];

export default function RegisterPage() {
  // states
  const [email, setEmail] = useState({ value: "", error: "" });
  const [names, setNames] = useState({ value: "", error: "" });
  const [firm, setFirm] = useState({ value: "", error: "" });
  const [UIstate, setUIstate] = useState<"OK" | "loading" | string>("loading");
  type UIStateType = typeof UIstate;
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  // onMount
  useEffect(() => {
    if (searchParams.has("error")) {
      const error_ = searchParams.get("error");
      if (error_)
        setUIstate(
          qParamsErrors[error_ as keyof typeof qParamsErrors] ||
            qParamsErrors.Default
        );
    } else setUIstate("OK");
  }, [searchParams]);
  // Notify on UIstate-error
  useEffect(() => {
    if (UIstate && UIstate !== "OK" && UIstate !== "loading") {
      toast.error(UIstate);
      setUIstate("OK");
    }
  }, [UIstate]);

  async function handleRegister() {
    // validate inputs: email & password
    const emailError_ = emailValidator(email.value);
    const namesError_ = nameValidator(names.value);
    const instNameError_ = nameValidator(firm.value);

    if (emailError_ || namesError_ || instNameError_) {
      if (emailError_) setEmail({ ...email, error: emailError_ });
      if (namesError_) setNames({ ...names, error: namesError_ });
      if (instNameError_) setFirm({ ...firm, error: instNameError_ });
      toast.error("Please fix the errors in the form");
      return;
    }

    setUIstate("loading");
    console.log(
      `........................\nCHECKPOINT: registering user
      > email - ${email.value} 
      > names - ${names.value}
      > firm -${firm.value}
      ..................`
    );
    const fetchOptions = {
      method: "POST",
      body: JSON.stringify({
        email: email.value,
        names: names.value,
        institutionName: firm.value,
      }),
    };

    const sendResetToken = await fetch("/api/auth/register", fetchOptions).then(
      async (res_) => {
        if (res_.ok) {
          return await res_.json();
        } else {
          const error_ =
            (await res_.json()).message ||
            `ERROR: ` + res_.status + "Unknown error";
          console.error(error_);
          setUIstate(error_);
          return null;
        }
      }
    );

    if (sendResetToken) {
      toast.success("Registration successful. Check email for activation link");
      router.push("/");
    }
  }
  // Render
  return !UIstate ? (
    <Loader />
  ) : UIstate === "OK" || UIstate === "loading" ? (
    <div className="flex flex-1 flex-col w-full items-center">
      <div className="w-full max-w-md p-4 m-auto divide-y space-y-3 divide-primary">
        <p
          className={`text-primary text-xl font-bold text-center pb-6 text-emerald-800 dark:text-emerald-400`}
        >
          Create A New Account
        </p>
        <form
          id="register"
          className="rounded space-y-6 md:space-y-6 p-8 shadow dark:shadow-dark"
        >
          {/* INPUT FIELDS */}
          <div className="space-y-4">
            <InputText
              label="Names *"
              name="name"
              type="text"
              placeholder="Enter your Names"
              // icon={SVGhome}
              valObj={names}
              setValue={setNames}
              valValidator={nameValidator}
            />
            <InputText
              label="Email *"
              // name={email}
              name="email"
              type="email"
              placeholder="Enter your email address"
              icon={SVGemail}
              valObj={email}
              setValue={setEmail}
              valValidator={nameValidator}
            />
            <InputText
              label="Firm/Company *"
              name="institution"
              type="text"
              placeholder="Firm/Company name"
              icon={SVGbriefcase}
              valObj={firm}
              setValue={setFirm}
              valValidator={nameValidator}
            />
          </div>
          {/* SUBMIT */}
          <div className="mx-2 pt-4">
            <ButtonPrimary
              label="Register"
              type="submit"
              loading={UIstate === ("loading" as UIStateType)}
              onClick={(e) => {
                e.preventDefault();
                handleRegister();
              }}
            />
          </div>
          <div className="flex flex-wrap items-center justify-between">
            <Link
              href="/signin"
              className="text-font-inactive italic text-sm font-medium  hover:underline"
            >
              Sign In
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
  ) : (
    <div>
      <p className="text-red-500">{UIstate}</p>
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
