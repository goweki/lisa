"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { ButtonPrimary } from "@/components/atoms/buttons";
import { Loader2 } from "@/components/atoms/loader";
import { httpCodes } from "@/lib/configs";

export default function ContactsPage() {
  const [UIstate, setUIstate] = useState("OK");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [ccCheckbox, setCcCheckbox] = useState(false);
  //onUIerror
  useEffect(() => {
    if (UIstate !== "OK" && UIstate !== "loading") {
      toast.error(UIstate);
      setUIstate("OK");
    }
  }, [UIstate]);
  //onClick Send
  async function handleSend() {
    // confirm fields filled
    if (!name || !email) {
      setUIstate(`Please provide your ${!name ? " name " : " email "}`);
      return;
    }
    // fetch options
    let fetchOptions = {
      method: "POST",
      // headers: {
      //   "Content-Type": "application/json",
      //   'Content-Type': 'application/x-www-form-urlencoded',
      // },
      body: JSON.stringify({
        subject: `Thank you for contacting LISA!`,
        text: `Hi: ${name} \nWe have received your message and will contact you soon via: ${email} \n Message: ${message}\nSource: website`,
        cc: ccCheckbox ? email : null,
      }),
    };
    setUIstate("loading");
    // POST request using fetch
    const _res = await fetch("/api/mailer", fetchOptions).then(async (res_) => {
      if (res_.ok) {
        return await res_.json();
      } else {
        console.log(`ERROR: ` + JSON.stringify(res_));
        setUIstate(httpCodes[res_.status]);
      }
    });
    if (_res?.success) {
      console.log(
        "SUCCESS: info sent\n > " +
          JSON.stringify(_res.success) +
          "\n.............."
      );
      toast.success("Info submitted!");
      setName("");
      setEmail("");
      setMessage("");
      setUIstate("OK");
    } else {
      console.error(
        "ERROR: failed sending info at contacts /page\n > " +
          JSON.stringify(_res) +
          "\n.............."
      );
      setUIstate(_res?.error ?? "No Response, check internet connection");
    }
  }
  //render
  return UIstate === "loading" ? (
    <div className="flex flex-col min-h-screen justify-center">
      <Loader2 />
    </div>
  ) : (
    <div className="container my-24 mx-auto md:px-6">
      {/* <!-- Section: Design Block --> */}
      <section className="mb-32">
        <div className="relative h-[300px] overflow-hidden bg-cover bg-[50%] bg-no-repeat bg-[url('https://i.postimg.cc/nrV7ytdv/og-image.jpg')]"></div>
        <div className="container px-6 md:px-12">
          <div className="block bg-backg-surface/75 dark:bg-backg-dark-surface/75 rounded-lg px-6 py-12 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]  dark:shadow-black/20 md:py-16 md:px-12 -mt-[100px] backdrop-blur-[30px]">
            <div className="flex flex-wrap">
              <div className="mb-12 w-full shrink-0 grow-0 basis-auto md:px-3 lg:mb-0 lg:w-5/12 lg:px-6">
                <form>
                  {renderInput(name, setName, "text", "name")}
                  {renderInput(email, setEmail, "email", "email")}
                  <div className="relative mb-6">
                    <textarea
                      className={`peer block min-h-[auto] w-full rounded border-0 border-b-2 border-l-2 border-font/50 dark:border-font-dark/50 focus:border-emerald-500 dark:focus:border-emerald-500 bg-transparent autofill:!bg-emerald-500 focus:ring-transparent py-2 px-3 outline-none transition-all duration-200 ease-linear peer-focus:text-emerald-500  dark:peer-focus:text-emerald-500 motion-reduce:transition-none`}
                      id="message"
                      value={message}
                      rows="3"
                      onChange={(e) => setMessage(e.target.value)}
                    />
                    <label
                      className={`pointer-events-none absolute top-0 left-3 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-font-inactive/75 dark:text-font-dark-inactive/75 transition-all duration-200 ease-out peer-focus:-translate-y-5 peer-focus:scale-[0.8] peer-focus:text-emerald-500 ${
                        message ? "scale-[0.8] -translate-y-5" : ""
                      } dark:peer-focus:text-emerald-500 motion-reduce:transition-none`}
                      htmlFor="message"
                    >
                      Message / Inquiry
                    </label>
                  </div>
                  <div className="mb-6 inline-block min-h-[1.5rem] justify-center pl-[1.5rem] md:flex">
                    <input
                      className="relative float-left mt-[0.15rem] mr-[6px] -ml-[1.5rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:ml-[0.25rem] checked:after:-mt-px checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-t-0 checked:after:border-l-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:ml-[0.25rem] checked:focus:after:-mt-px checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-t-0 checked:focus:after:border-l-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                      type="checkbox"
                      id="checkbox-cc"
                      onChange={(e) => setCcCheckbox(e.target.checked)}
                    />
                    <label
                      className="inline-block pl-[0.15rem] hover:cursor-pointer"
                      htmlFor="checkbox-cc"
                    >
                      Send me a copy of this message
                    </label>
                  </div>
                  <ButtonPrimary
                    label="Send"
                    type="submit"
                    onClick={async (e) => {
                      e.preventDefault();
                      await handleSend();
                    }}
                  />
                </form>
              </div>
              <div className="w-full shrink-0 grow-0 basis-auto lg:w-7/12">
                <div className="flex flex-wrap">
                  <div className="mb-12 w-full shrink-0 grow-0 basis-auto md:w-6/12 md:px-3 lg:w-full lg:px-6 xl:w-6/12">
                    <div className="flex items-start">
                      <div className="shrink-0">
                        <div className="inline-block rounded-md bg-primary-100 p-4 text-primary">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            className="h-6 w-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.25 9.75v-4.5m0 4.5h4.5m-4.5 0l6-6m-3 18c-8.284 0-15-6.716-15-15V4.5A2.25 2.25 0 014.5 2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.423c.11.44-.054.902-.417 1.173l-1.293.97a1.062 1.062 0 00-.38 1.21 12.035 12.035 0 007.143 7.143c.441.162.928-.004 1.21-.38l.97-1.293a1.125 1.125 0 011.173-.417l4.423 1.106c.5.125.852.575.852 1.091V19.5a2.25 2.25 0 01-2.25 2.25h-2.25z"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-6 grow">
                        <p className="mb-2 font-bold dark:text-white">
                          Technical support
                        </p>
                        <p className="text-neutral-500 dark:text-neutral-200">
                          <Link href="mailto:support@goweki.com">
                            support@goweki.com
                          </Link>
                        </p>
                        {/* <p className="text-neutral-500 dark:text-neutral-200">
                          +1 234-567-89
                        </p> */}
                      </div>
                    </div>
                  </div>
                  <div className="mb-12 w-full shrink-0 grow-0 basis-auto md:w-6/12 md:px-3 lg:w-full lg:px-6 xl:w-6/12">
                    <div className="flex items-start">
                      <div className="shrink-0">
                        <div className="inline-block rounded-md bg-primary-100 p-4 text-primary">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            className="h-6 w-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-6 grow">
                        <p className="mb-2 font-bold dark:text-white">
                          Business & Operations
                        </p>
                        <p className="text-neutral-500 dark:text-neutral-200">
                          <Link href="mailto: m.omungalah@gmail.com">
                            m.omungalah@gmail.com
                          </Link>
                        </p>
                        {/* <p className="text-neutral-500 dark:text-neutral-200">
                          +1 234-567-89
                        </p> */}
                      </div>
                    </div>
                  </div>
                  {/* <div className="mb-12 w-full shrink-0 grow-0 basis-auto md:mb-0 md:w-6/12 md:px-3 lg:mb-12 lg:w-full lg:px-6 xl:w-6/12">
                    <div className="align-start flex">
                      <div className="shrink-0">
                        <div className="inline-block rounded-md bg-primary-100 p-4 text-primary">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            className="h-6 w-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-6 grow">
                        <p className="mb-2 font-bold dark:text-white">Press</p>
                        <p className="text-neutral-500 dark:text-neutral-200">
                          press@example.com
                        </p>
                        <p className="text-neutral-500 dark:text-neutral-200">
                          +1 234-567-89
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full shrink-0 grow-0 basis-auto md:w-6/12 md:px-3 lg:w-full lg:px-6 xl:mb-12 xl:w-6/12">
                    <div className="align-start flex">
                      <div className="shrink-0">
                        <div className="inline-block rounded-md bg-primary-100 p-4 text-primary">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            className="h-6 w-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 12.75c1.148 0 2.278.08 3.383.237 1.037.146 1.866.966 1.866 2.013 0 3.728-2.35 6.75-5.25 6.75S6.75 18.728 6.75 15c0-1.046.83-1.867 1.866-2.013A24.204 24.204 0 0112 12.75zm0 0c2.883 0 5.647.508 8.207 1.44a23.91 23.91 0 01-1.152 6.06M12 12.75c-2.883 0-5.647.508-8.208 1.44.125 2.104.52 4.136 1.153 6.06M12 12.75a2.25 2.25 0 002.248-2.354M12 12.75a2.25 2.25 0 01-2.248-2.354M12 8.25c.995 0 1.971-.08 2.922-.236.403-.066.74-.358.795-.762a3.778 3.778 0 00-.399-2.25M12 8.25c-.995 0-1.97-.08-2.922-.236-.402-.066-.74-.358-.795-.762a3.734 3.734 0 01.4-2.253M12 8.25a2.25 2.25 0 00-2.248 2.146M12 8.25a2.25 2.25 0 012.248 2.146M8.683 5a6.032 6.032 0 01-1.155-1.002c.07-.63.27-1.222.574-1.747m.581 2.749A3.75 3.75 0 0115.318 5m0 0c.427-.283.815-.62 1.155-.999a4.471 4.471 0 00-.575-1.752M4.921 6a24.048 24.048 0 00-.392 3.314c1.668.546 3.416.914 5.223 1.082M19.08 6c.205 1.08.337 2.187.392 3.314a23.882 23.882 0 01-5.223 1.082"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-6 grow">
                        <p className="mb-2 font-bold dark:text-white">
                          Bug report
                        </p>
                        <p className="text-neutral-500 dark:text-neutral-200">
                          bugs@example.com
                        </p>
                        <p className="text-neutral-500 dark:text-neutral-200">
                          +1 234-567-89
                        </p>
                      </div>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- Section: Design Block --> */}
    </div>
    // <!-- Container -->
  );
}
function renderInput(value, setValue, type = "text", name = "inputField") {
  return (
    <div className="relative mb-8">
      <input
        type={type}
        className={`peer block min-h-[auto] w-full rounded border-0 border-b-2 border-l-2 border-font/50 dark:border-font-dark/50 focus:border-emerald-500 dark:focus:border-emerald-500 bg-transparent autofill:!bg-emerald-500 focus:ring-transparent py-2 px-3 outline-none transition-all duration-200 ease-linear peer-focus:text-emerald-500  dark:peer-focus:text-emerald-500 motion-reduce:transition-none`}
        id={name}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <label
        className={`pointer-events-none absolute top-0 left-3 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-font-inactive/75 dark:text-font-dark-inactive/75 transition-all duration-200 ease-out peer-focus:-translate-y-5 peer-focus:scale-[0.8] peer-focus:text-emerald-500 ${
          value ? "scale-[0.8] -translate-y-5" : ""
        } dark:peer-focus:text-emerald-500 motion-reduce:transition-none`}
        htmlFor={name}
      >
        Your {name}*
      </label>
    </div>
  );
}
