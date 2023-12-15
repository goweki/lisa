import { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ButtonPrimary } from "../../../components/atoms/buttons";
import { SVGemail, SVGpassword } from "../../../components/atoms/svgs";
import { InputText } from "../../../components/atoms/inputs";
import { emailValidator, passwordValidator } from "@/helpers/inputValidators";
import useRealm from "../../../components/realmWeb";

export function Signin() {
  // login logic
  async function handleLogin() {
    setEmail({ ...email, error: "" });
    setPassword({ ...password, error: "" });
    setLoading(true);
    console.log(`ACTION.........`);
    console.log(`> pressed login`);
    // Errors??
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    if (!!emailError || !!passwordError) {
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      console.log(` >> invalid form entries`);
      // console.log(
      //   ` >>> email: ${JSON.stringify(email)} \n>>> password: ${JSON.stringify(
      //     password
      //   )}`
      // );
      return;
    }
    // realm-web (signInUser)
    try {
      const resp = await signInUser(email.value, password.value);
      if (resp.user) {
        console.log(`HERE3`);
        console.log(`>> successful sign-in`);
        // console.log(`>>> user: ${JSON.stringify(resp.user)}`);
        // console.log(`HERE1`);
        toast.success("Successfully signed in");
        setNavin(true);
      } else {
        console.log(`HERE2`);
        // console.log(`>> sign-in failed`);
        // console.log(`>>> error: ${JSON.stringify(err)}`);
        //stop loading
        throw resp;
      }
    } catch (err) {
      console.log(`HERE3`);
      console.log(`>> sign-in failed, caught error`);
      console.log(`>>> errorObj: ${err}`);
      console.log(`>>> error: ${JSON.stringify(err)}`);
      setEmail({ ...email, error: err.error || err });
    }
  }

  const [navin, setNavin] = useState(false);
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [loading, setLoading] = useState(true);
  const { signInUser } = useRealm();
  const router = useRouter();

  //On component render
  useEffect(() => {
    setLoading(false);
  }, []);
  // callback to memize routing function
  const refResh = useCallback(() => {
    router.replace("/home");
    router.refresh();
  }, [router]);
  // navihgate with memoized router
  useEffect(() => {
    if (navin) {
      setLoading(false);
      refResh();
    }
  }, [navin, refResh]);
  //Notify on formError
  useEffect(() => {
    if (email.error || password.error) {
      setLoading(false);
      toast.error(email.error || password.error);
    }
  }, [email.error, password.error]);

  return (
    <div className="flex flex-1 flex-col w-full items-center">
      <div className="w-full sm:max-w-md p-4 mt-6 divide-y space-y-3 divide-emerald-800">
        <p
          className={`text-xl font-bold text-emerald-800 dark:text-emerald-500 text-center pb-6`}
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
              placeholder="Enter your email address"
              icon={SVGemail}
              value={email}
              onChange={(e) => {
                if (email.error) {
                  const error_ = emailValidator(e.target.value);
                  if (!!error_) {
                    setEmail({ value: e.target.value, error: error_ });
                  } else {
                    setEmail({ value: e.target.value, error: "" });
                  }
                } else {
                  setEmail({ value: e.target.value, error: "" });
                }
              }}
            />
            <InputText
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
              icon={SVGpassword}
              value={password}
              onChange={(e) => {
                if (password.error) {
                  const error_ = emailValidator(e.target.value);
                  if (!!error_) {
                    setPassword({ value: e.target.value, error: error_ });
                  } else {
                    setPassword({ value: e.target.value, error: "" });
                  }
                } else {
                  setPassword({ value: e.target.value, error: "" });
                }
              }}
            />
          </div>
          {/* forgot passwords */}
          <div className="mx-2 pt-4">
            <ButtonPrimary
              label="Sign In"
              onClick={() => handleLogin()}
              disabled={!email.value || !password.value}
              loading={loading}
            />
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
