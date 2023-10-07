import { useState } from "react";
import { ButtonPrimary } from "../atoms/buttons";
import { SVGmessage } from "../atoms/icons";
import { InputText } from "../atoms/inputs";

export function Signin() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  return (
    <div className="flex flex-1 flex-col w-full items-center">
      <div className="w-full sm:max-w-md p-4 mt-6">
        <form
          className="bg-background-surface dark:bg-background-dark-surface rounded space-y-6 md:space-y-6 p-8 shadow-[1px_1px_2px_#0c1221,-1px_-1px_2px_#121c33]"
          action="#"
        >
          <p className="text-xl font-bold text-center">
            Sign in to your account
          </p>
          {/* INPUT FIELDS */}
          <div className="space-y-3">
            <InputText
              label="Email"
              placeholder={"name@email.com"}
              icon={SVGmessage}
              value={email}
            />
            <InputText label="Password" icon={SVGmessage} value={password} />
            <ButtonPrimary />
          </div>
          {/* forgot passwords */}
          <div className="flex items-center justify-between">
            <div className="flex items-start">
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
                  className="text-gray-500 dark:text-gray-300"
                >
                  Remember me
                </label>
              </div>
            </div>
            <a
              href="#"
              className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
            >
              Forgot password?
            </a>
          </div>
          <p className="text-sm font-light text-gray-500 dark:text-gray-400">
            Don’t have an account yet?{" "}
            <a
              href="#"
              className="font-medium text-primary-600 hover:underline dark:text-primary-500"
            >
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
