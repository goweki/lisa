import { ButtonPrimary, ButtonText } from "@/components/atoms/buttons";
import { InputText } from "@/components/atoms/inputs";
import { SVGcell, SVGemail, SVGuser } from "@/components/atoms/svgs";
import { emailValidator, nameValidator } from "@/helpers/inputValidators";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export function ReqDemoModal({ isVisible, hideModal }) {
  const [firstName, setFirstName] = useState({ value: "", error: "" });
  const [email, setEmail] = useState({ value: "", error: "" });
  const [tel, setTel] = useState({ value: "", error: "" });
  const [modalState, setModalState] = useState({ state: "", error: "" });
  //onMount-component
  useEffect(() => {
    setModalState({ state: "OK", error: "" });
  }, []);
  //onMount-component
  useEffect(() => {
    if (modalState.error) {
      toast.error(modalState.error);
      setModalState({ state: "OK", error: "" });
    }
  }, [modalState.error]);
  //handle sending message
  function handleSend() {
    setModalState({ state: "loading", error: "" });
    // send SMS /email
  }
  return (
    <div
      id="requestDemoModal"
      tabIndex="-1"
      aria-hidden="true"
      className={`${
        !isVisible ? `hidden` : ``
      } fixed top-10 left-0 right-0 z-10 flex items-center justify-center h-full p-4 bg-background dark:bg-background-dark`}
    >
      {/* Request Demo */}
      <div className="bg-background-surface dark:bg-background-dark-surface rounded space-y-6 md:space-y-6 p-8 shadow-[6px_6px_4px_#ecf0f4,-6px_-6px_4px_#f6fafe] dark:shadow-[1px_1px_2px_#0c1221,-1px_-1px_2px_#121c33] max-w-md border border-emerald-800">
        <div className="p-4 sm:p-7 space-y-6">
          <div className="text-center">
            {/* <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
              Interested in LISA?
            </h1> */}
            <p className="mt-2 text-sm text-medium">
              <span className="inline-block">Fill your details</span>{" "}
              <span className="inline-block">
                and we will get back to you in a day
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
                  value={firstName}
                  onChange={(e) => {
                    if (firstName.error) {
                      const error_ = nameValidator(e.target.value);
                      if (!!error_) {
                        setFirstName({ value: e.target.value, error: error_ });
                      } else {
                        setFirstName({ value: e.target.value, error: "" });
                      }
                    } else {
                      setFirstName({ value: e.target.value, error: "" });
                    }
                  }}
                />
                {/* email FIELD */}
                <InputText
                  label="Email *"
                  name="email"
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
                {/* tel FIELD */}
                <InputText
                  label="Cell No. (optional)"
                  name="tel"
                  type="tel"
                  placeholder="Enter your tel"
                  icon={SVGcell}
                  value={tel}
                  onChange={(e) => {
                    if (tel.error) {
                      const error_ = emailValidator(e.target.value);
                      if (!!error_) {
                        setTel({ value: e.target.value, error: error_ });
                      } else {
                        setTel({ value: e.target.value, error: "" });
                      }
                    } else {
                      setTel({ value: e.target.value, error: "" });
                    }
                  }}
                />
                <div className="my-6 flex flex-col">
                  <ButtonPrimary label="I'm interested" />
                  <div className="self-end">
                    <ButtonText label="Close" onClick={hideModal} />
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
