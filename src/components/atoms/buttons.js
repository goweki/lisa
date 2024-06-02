export function ButtonPrimary({
  label = "PrimaryButton",
  loading,
  onClick = () => console.log("ButtonPrimary clicked"),
  disabled,
  type = "button",
}) {
  return (
    <button
      disabled={disabled || loading}
      type={type}
      className={`relative min-h-4 overflow-hidden w-full bg-[linear-gradient(176deg,_#06664b,_#05563f)] disabled:cursor-not-allowed disabled:opacity-50 enabled:hover:shadow-[11px_11px_22px_#b9bec5,-11px_-11px_22px_#ffffff] text-font-dark shadow dark:shadow-dak enabled:dark:hover:shadow-[12px_12px_24px_#090e1a,-12px_-12px_24px_#15203a] focus:ring-4 focus:ring-emerald-300 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none dark:focus:ring-emerald-800 cursor-pointer transition-all duration-150 ease-in-out enabled:hover:scale-105 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-emerald-900 before:to-emerald-500 before:transition-all before:duration-500 before:ease-in-out before:z-[-1] enabled:hover:before:left-0`}
      onClick={onClick}
    >
      {!loading ? (
        label
      ) : (
        <div className="items-center justify-center space-x-2 pt-1 loader [&>*:nth-child(even)]:bg-emerald-200 [&>*:nth-child(odd)]:bg-gray-200 rounded-full flex">
          <div className="w-4 h-4 rounded-full animate-[loader_0.6s_infinite_alternate] "></div>
          <div className="w-4 h-4 rounded-full animate-[loader_0.6s_infinite_alternate] animation-delay-200"></div>
          <div className="w-4 h-4 rounded-full animate-[loader_0.6s_infinite_alternate] animation-delay-400"></div>
        </div>
      )}
    </button>
  );
}

export function ButtonSecondary({
  label = "ButtonSecondary",
  loading,
  onClick = () => console.log("ButtonSecondary clicked"),
  disabled,
  type = "button",
}) {
  return (
    <button
      disabled={disabled || loading}
      type={type}
      className={`relative hover:text-font-dark min-h-4 overflow-hidden w-full disabled:cursor-not-allowed disabled:opacity-50 enabled:hover:shadow-[11px_11px_22px_#b9bec5,-11px_-11px_22px_#ffffff] shadow dark:shadow-dak enabled:dark:hover:shadow-[12px_12px_24px_#090e1a,-12px_-12px_24px_#15203a] focus:ring-4 focus:ring-emerald-300 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none dark:focus:ring-emerald-800 cursor-pointer transition-all duration-150 ease-in-out enabled:hover:scale-105 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-emerald-900 before:to-emerald-500 before:transition-all before:duration-500 before:ease-in-out before:z-[-1] enabled:hover:before:left-0`}
      onClick={onClick}
    >
      {!loading ? (
        label
      ) : (
        <div className="items-center justify-center space-x-2 pt-1 loader [&>*:nth-child(even)]:bg-emerald-200 [&>*:nth-child(odd)]:bg-gray-200 rounded-full flex">
          <div className="w-4 h-4 rounded-full animate-[loader_0.6s_infinite_alternate] "></div>
          <div className="w-4 h-4 rounded-full animate-[loader_0.6s_infinite_alternate] animation-delay-200"></div>
          <div className="w-4 h-4 rounded-full animate-[loader_0.6s_infinite_alternate] animation-delay-400"></div>
        </div>
      )}
    </button>
  );
}

export function ButtonDestructive({
  label = "ButtonText",
  loading,
  onClick = () => console.log("ButtonText clicked"),
  disabled,
  type = "button",
}) {
  return (
    <button
      disabled={disabled || loading}
      type={type}
      className={`whitespace-nowrap relative disabled:cursor-not-allowed disabled:opacity-50 font-medium text-sm px-3 py-2 outline-none cursor-pointer transition-all duration-150 ease-in-out enabled:hover:scale-105 text-red-500 enabled:dark:text-red-200 enabled:hover:text-red-700 enabled:dark:hover:text-red-500`}
      onClick={onClick}
    >
      {!loading ? (
        label
      ) : (
        <div className="items-center justify-center space-x-2 pt-1 loader [&>*:nth-child(even)]:bg-emerald-200 [&>*:nth-child(odd)]:bg-gray-200 rounded-full flex">
          <div className="w-4 h-4 rounded-full animate-[loader_0.6s_infinite_alternate] "></div>
          <div className="w-4 h-4 rounded-full animate-[loader_0.6s_infinite_alternate] animation-delay-200"></div>
          <div className="w-4 h-4 rounded-full animate-[loader_0.6s_infinite_alternate] animation-delay-400"></div>
        </div>
      )}
    </button>
  );
}
