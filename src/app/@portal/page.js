"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ButtonPrimary, ButtonText } from "@/components/atoms/buttons";
import { SVGlogoAnimation1 } from "@/components/atoms/svgs";
import { useDate } from "@/components/datetime";
import useRealm from "@/components/realmWeb";

export default function HomePage() {
  //states
  const [loading, setLoading] = useState(true);
  const { app: realmApp, signOutUser } = useRealm();
  const { wish } = useDate();
  const router = useRouter();
  // callback to memize function
  const refResh = useCallback(() => {
    router.refresh();
  }, [router]);
  // confirm user on mount
  useEffect(() => {
    if (realmApp?.currentUser) setLoading(false);
    else {
      refResh();
    }
  }, [realmApp?.currentUser, refResh]);
  return !loading ? (
    <div
      id="homepage"
      className="flex flex-col flex-1 bg-background-surface dark:bg-background-dark-surface justify-start 
      items-center"
    >
      <div className="container">
        <div className="flex flex-wrap items-center">
          <div className="w-full px-4">
            <div className="z-10 p-16 mx-auto max-w-xs">
              {/* <div className="mt-4"> */}
              {/* <img
                  src="assets/images/hero/hero-image.jpg"
                  alt="hero"
                  className="mx-auto max-w-full rounded-t-xl rounded-tr-xl"
                /> */}
              <SVGlogoAnimation1 />
              {/* </div> */}
            </div>
          </div>
          <div className="w-full px-4">
            <div className="hero-content mx-auto max-w-[780px] text-center">
              {/* <h1 className="mb-8 text-3xl text-font-faded dark:text-font-dark-faded font-bold leading-snug sm:text-4xl sm:leading-snug md:text-[45px] md:leading-snug">
                The <span className=" dark:text-[#af9e85]">L</span>
                egal <span className=" dark:text-[#af9e85]">I</span>
                ntelligent <span className=" dark:text-[#af9e85]">S</span>
                upport <span className=" dark:text-[#af9e85]">A</span>
                ssistant
              </h1> */}
              <h1 className="mb-4 text-xl text-font-faded dark:text-font-dark-faded font-bold leading-snug sm:text-2xl sm:leading-snug md:text-[27px] md:leading-snug">
                <p className="text-[#AB8044] dark:text-[#af9e85]">
                  {wish()} {realmApp?.currentUser?.customData?.name}
                </p>
              </h1>
              <div className="mb-8 flex flex-col items-center justify-center">
                <div className="flex flex-col min-w-[50%]">
                  <ButtonPrimary
                    label="Continue"
                    onClick={() => {
                      router.push("/home");
                      // router.refresh();
                    }}
                  />
                  <ButtonText
                    label="Sign Out"
                    onClick={async () => {
                      await signOutUser();
                      router.refresh();
                    }}
                  />
                </div>
              </div>
              <p className="mx-auto mb-10 max-w-[600px] text-base sm:text-lg sm:leading-relaxed md:text-xl md:leading-relaxed">
                Lisa is much more than an information manager, it is a research
                assistant, legal and more!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex flex-1 py-2 md:py-6 items-center justify-center space-x-2 pt-1 loader [&>*:nth-child(even)]:bg-emerald-600 [&>*:nth-child(odd)]:bg-gray-500">
      <div className="w-4 h-4 rounded-full animate-[loader_0.6s_infinite_alternate] "></div>
      <div className="w-4 h-4 rounded-full animate-[loader_0.6s_infinite_alternate] animation-delay-200"></div>
      <div className="w-4 h-4 rounded-full animate-[loader_0.6s_infinite_alternate] animation-delay-400"></div>
      <div className="w-4 h-4 rounded-full animate-[loader_0.6s_infinite_alternate] animation-delay-600"></div>
    </div>
  );
}
