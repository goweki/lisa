export function ButtonSecondary({ label }) {
  return (
    <button
      type="button"
      className="w-full bg-background-surface dark:bg-[linear-gradient(176deg, #f2f8ff, #cbd1d8)] shadow hover:shadow-pressed hover:bg-emerald-200 dark:shadow-dak dark:hover:shadow-dpressed dark:hover:bg-emerald-900 focus:ring-4 focus:ring-emerald-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2  focus:outline-none dark:focus:ring-emerald-800"
    >
      Default
    </button>
  );
}

export function ButtonPrimary({ label = "Default", loading }) {
  return (
    <button
      type="button"
      className=" overflow-hidden w-full bg-[linear-gradient(176deg,_#06664b,_#05563f)] hover:shadow-[11px_11px_22px_#b9bec5,-11px_-11px_22px_#ffffff] text-font-dark shadow dark:shadow-dak dark:hover:shadow-[12px_12px_24px_#090e1a,-12px_-12px_24px_#15203a] focus:ring-4 focus:ring-emerald-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2  focus:outline-none dark:focus:ring-emerald-800 cursor-pointer transition-all duration-150 ease-in-out hover:scale-105 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-emerald-900 before:to-emerald-500 before:transition-all before:duration-500 before:ease-in-out before:z-[-1] hover:before:left-0"
    >
      {!loading ? label : null}
    </button>
  );
}
