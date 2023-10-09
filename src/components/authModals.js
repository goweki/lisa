import { useState } from "react";
import { ButtonPrimary } from "./atoms/buttons";
import { SVGmessage } from "./atoms/icons";
import { InputText } from "./atoms/inputs";
import ThemeToggler from "./atoms/themeToggle";

export function Signin() {
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  return (
    <div className="flex flex-1 flex-col w-full items-center justify-center">
      <div className="w-full sm:max-w-md p-4 mt-6 divide-y space-y-3 divide-emerald-800">
        <p
          className={`text-xl font-bold text-emerald-800 dark:text-emerald-600 text-center pb-6`}
        >
          Welcome
        </p>
        <form
          className="bg-background-surface dark:bg-background-dark-surface rounded space-y-6 md:space-y-6 p-8 shadow-[6px_6px_4px_#ecf0f4,-6px_-6px_4px_#f6fafe] dark:shadow-[1px_1px_2px_#0c1221,-1px_-1px_2px_#121c33]"
          action="#"
        >
          {/* <p
            className={`text-xl font-bold text-emerald-800 dark:text-emerald-600 text-center`}
          >
            Sign in to your account
          </p> */}
          {/* INPUT FIELDS */}
          <div className="space-y-4">
            <InputText
              label="Email"
              name={email}
              type="email"
              placeholder={"name@email.com"}
              icon={SVGmessage}
              value={email}
              setFunc={setEmail}
            />
            <InputText
              label="Password"
              name="password"
              type="password"
              icon={SVGmessage}
              value={password}
              setFunc={setPassword}
            />
          </div>
          {/* forgot passwords */}
          <div className="mx-2 pt-4">
            <ButtonPrimary label="Sign In" />
          </div>
          <div className="flex items-center justify-center">
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
            <a
              href="#"
              className="text-font-inactive italic dark:text-font-dark-inactive dark:hover:text-font-dark-faded text-sm font-medium  hover:underline"
            >
              Forgot password?
            </a>
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
