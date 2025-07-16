import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ButtonPrimary, ButtonDestructive } from "@/components/atoms/buttons";
import { InputText } from "@/components/atoms/inputs";
import { SVGcell, SVGemail, SVGuser } from "@/components/atoms/svgs";
import { emailValidator, nameValidator } from "@/helpers/inputValidators";
import { httpCodes } from "@/lib/configs";

export function ReqDemoModal({ handleCloseModal }) {
  const [firstName, setFirstName] = useState({ value: "", error: "" });
  const [email, setEmail] = useState({ value: "", error: "" });
  const [tel, setTel] = useState({ value: "", error: "" });
  const [UIstate, setUIstate] = useState("");
  //onMount-component
  useEffect(() => {
    setUIstate("OK");
  }, []);
  //onError-component
  useEffect(() => {
    if (UIstate && UIstate !== "OK" && UIstate !== "loading") {
      toast.error(UIstate);
      setUIstate("OK");
    }
  }, [UIstate]);
  //handle sending message
  async function handleSend() {
    try {
      setUIstate("loading");
      // validate inputs
      if (!firstName.value || !email.value) {
        setUIstate(
          `Please provide your ${!firstName.value ? "name" : "email"}`
        );
        return;
      }
      const emailError = emailValidator(email.value);
      const nameError = nameValidator(firstName.value);
      if (!!emailError || !!nameError) {
        setEmail({ ...email, error: emailError });
        setFirstName({ ...firstName, error: nameError });
        setUIstate(`Invalid ${emailError ? "email" : "name"}`);
        console.log(` >> Invalid ${emailError ? "email" : "name"}`);
        return;
      }
      const body = {
        subject: "INTEREST IN LISA",
        text: `The below user has expressed interest in Lisa via website \nName: ${
          firstName.value
        }  \nEmail: ${email.value}, ${tel.value ? `\nTel: ${tel.value} ` : ``}`,
      };
      const fetchOptions = {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      };
      // make API call
      const response = await fetch("/api/mailer", fetchOptions).then(
        async (res_) => {
          if (res_.ok) {
            return await res_.json();
          } else {
            const error_ =
              (await res_.json()) || "Unknown error, try again later";
            console.error("Error in sending reset password link:", error_);
            toast.error(error_.message || error_);
            return null;
          }
        }
      );
      if (!response) {
        console.log(
          "SUCCESS: info sent\n > " +
            JSON.stringify(response.success) +
            "\n.............."
        );
        toast.success("Info submitted!");
        setFirstName("");
        setEmail("");
        setTel("");
        handleCloseModal();
      } else {
        console.error(
          "ERROR: failed sending info at contacts /page\n > " +
            JSON.stringify(response) +
            "\n.............."
        );
        setUIstate(response?.error ?? "No Response, check internet connection");
      }
    } catch (err) {
      setUIstate("Sending info failed: consider emailing lisa@goweki.com");
    }
  }
  //render UI
  return (
    <div
      id="requestDemoModal"
      tabIndex="-1"
      aria-hidden="true"
      className={`fixed top-0 left-0 right-0 z-10 flex items-center justify-center h-full p-4 bg-background/80 backdrop-blur-xl`}
    >
      {/* Request Demo */}
      <div className="bg-backg-surface dark:bg-backg-dark-surface rounded space-y-6 md:space-y-6 p-8 shadow-[6px_6px_4px_#ecf0f4,-6px_-6px_4px_#f6fafe] dark:shadow-[1px_1px_2px_#0c1221,-1px_-1px_2px_#121c33] max-w-md border border-emerald-800">
        <div className="p-4 sm:p-7 space-y-6">
          <div className="text-center">
            {/* <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
              Interested in LISA?
            </h1> */}
            <p className="text-start my-2 text-sm font-medium">
              <span className="inline-block font-bold">
                Fill out your details
              </span>{" "}
              <span className="inline-block">
                and we will get back to you...
              </span>
            </p>
          </div>

          <div className="mt-5">
            <form>
              <div className="grid gap-y-4">
                {/* name FIELD */}
                <InputText
                  label="Preferred Name *"
                  name="name"
                  type="text"
                  placeholder="Enter your prefered name"
                  icon={SVGuser}
                  valObj={firstName}
                  setValue={setFirstName}
                />
                {/* email FIELD */}
                <InputText
                  label="Email *"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  icon={SVGemail}
                  valObj={email}
                  setValue={setEmail}
                />
                {/* tel FIELD */}
                <InputText
                  label="Cell No. (optional)"
                  name="tel"
                  type="tel"
                  placeholder="Enter your tel"
                  icon={SVGcell}
                  valObj={tel}
                  setValue={setTel}
                />
                <div className="my-6 flex flex-col">
                  <ButtonPrimary
                    label="I'm interested"
                    onClick={handleSend}
                    loading={UIstate === "loading"}
                  />
                  <div className="self-end">
                    <ButtonDestructive
                      label="Close"
                      onClick={handleCloseModal}
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
