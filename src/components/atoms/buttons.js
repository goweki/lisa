export function ButtonSecondary({ label }) {
  return (
    <button
      type="button"
      className="w-full bg-background-surface dark:bg-background-dark-surface shadow hover:shadow-pressed hover:bg-emerald-200 dark:shadow-dak dark:hover:shadow-dpressed dark:hover:bg-emerald-900 focus:ring-4 focus:ring-emerald-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2  focus:outline-none dark:focus:ring-emerald-800"
    >
      Default
    </button>
  );
}

export function ButtonPrimary({ label = "Default", loading }) {
  return (
    <button
      type="button"
      className=" overflow-hidden w-full bg-emerald-800 text-font-dark shadow dark:shadow-dak focus:ring-4 focus:ring-emerald-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2  focus:outline-none dark:focus:ring-emerald-800 cursor-pointer transition-all duration-150 ease-in-out hover:scale-105 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-emerald-900 before:to-emerald-500 before:transition-all before:duration-500 before:ease-in-out before:z-[-1] hover:before:left-0"
    >
      {!loading ? label : null}
    </button>
  );
}
