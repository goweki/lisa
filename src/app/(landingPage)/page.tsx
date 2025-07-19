"use client";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { ButtonPrimary, ButtonDestructive } from "@/components/atoms/buttons";
import { SVGlogoAnimation1 } from "@/components/atoms/svgs";
import { ReqDemoModal } from "./compo";
import { useDate } from "@/lib/dateTime";
import { Loader } from "@/components/atoms/loader";

export default function LandingPage() {
  // states
  const { wish, date, time } = useDate();
  const { data: session, status } = useSession();
  const [showDemoReqModal, setToggleDemoReqModal] = useState(false);
  // Render
  return (
    <main className="flex bg-transparent flex-col flex-grow justify-start items-center">
      <div className="flex flex-wrap items-center">
        <div className="w-full px-4">
          <div className="z-10 p-16 mx-auto max-w-sm min-w-xs">
            <SVGlogoAnimation1 className={""} />
          </div>
        </div>
        {status === "loading" ? (
          <Loader />
        ) : !session ? (
          <div className="w-full px-4">
            <div className="hero-content mx-auto max-w-[780px] text-center">
              <h1 className="mb-8 text-xl text-font-inactive dark:text-font-dark-inactive font-bold leading-snug sm:text-2xl sm:leading-snug md:text-[36px] md:leading-snug">
                The <span>L</span>egal <span>I</span>ntelligent <span>S</span>
                upport <span>A</span>ssistant
              </h1>
              <ul className="mb-10 flex flex-wrap items-center justify-center">
                <li>
                  <ButtonPrimary
                    label="Request Demo"
                    onClick={() => {
                      setToggleDemoReqModal(true);
                    }}
                  />
                </li>
                <Link
                  href="/register"
                  className="flex items-center py-1 px-6 hover:text-emerald-600 dark:hover:text-emerald-500 font-medium transition duration-150 ease-in-out sm:px-10"
                >
                  Sign Up
                  <span className="pl-2">
                    <svg
                      width="20"
                      height="8"
                      viewBox="0 0 20 8"
                      fill="currentColor"
                    >
                      <path d="M19.2188 2.90632L17.0625 0.343819C16.875 0.125069 16.5312 0.0938193 16.2812 0.281319C16.0625 0.468819 16.0312 0.812569 16.2188 1.06257L18.25 3.46882H0.9375C0.625 3.46882 0.375 3.71882 0.375 4.03132C0.375 4.34382 0.625 4.59382 0.9375 4.59382H18.25L16.2188 7.00007C16.0312 7.21882 16.0625 7.56257 16.2812 7.78132C16.375 7.87507 16.5 7.90632 16.625 7.90632C16.7812 7.90632 16.9375 7.84382 17.0312 7.71882L19.1875 5.15632C19.75 4.46882 19.75 3.53132 19.2188 2.90632Z" />
                    </svg>
                  </span>
                </Link>
              </ul>
              <p className="mx-auto mb-10 max-w-[600px] text-base sm:text-md sm:leading-relaxed md:text-lg md:leading-relaxed">
                With Lisa, legal professionals now have a handy tool that
                unifies resources and keeps track of activities. Lisa is much
                more than an information manager, it is a research assistant and
                more!
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full px-4">
            <div className="hero-content mx-auto max-w-[780px] text-center">
              <h1 className="mb-4 text-font-inactive dark:text-font-dark-inactive font-bold">
                {`${wish()} ${session?.user?.name || ""}`}
              </h1>
              <div className="mb-10 flex flex-wrap items-center justify-center space-x-4">
                <ButtonDestructive
                  label="Exit"
                  onClick={async () => {
                    await signOut();
                  }}
                />
                <Link href="/dashboard">
                  <ButtonPrimary label="Continue" onClick={() => ""} />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
      {showDemoReqModal && (
        <ReqDemoModal
          handleCloseModal={() => {
            setToggleDemoReqModal(false);
          }}
        />
      )}
    </main>
  );
}
