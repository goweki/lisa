export function InputText({
  valObj,
  setValue,
  name = "inputName",
  label,
  valValidator = (val) => {
    if (val) return "";
    else return "Empty value";
  },
  type = "text",
  placeholder = "Text field",
  icon: Icon,
}) {
  return (
    <div className="space-y-2">
      <div className="no-wrap">
        {label && (
          <label htmlFor={name} className="text-xs px-2">
            {label}
          </label>
        )}
        <></>
      </div>
      <div className="relative mb-6 mt-0">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
          {Icon && (
            <Icon className="w-4 h-4 text-emerald-800 dark:text-emerald-500" />
          )}
        </div>
        <input
          name={name}
          id={name}
          type={type}
          className={`${
            valObj.error
              ? "border-red-500 dark:border-red-400"
              : "border-transparent dark:border-transparent focus:ring-emerald-800 focus:border-emerald-800 dark:focus:ring-emerald-800 dark:focus:border-emerald-800"
          } border bg-[linear-gradient(176deg,_#cbd1d8,_#f2f8ff)] dark:bg-[linear-gradient(176deg,_#0e1526,_#10192d)] shadow dark:shadow-dak dark:focus:shadow-dpressed focus:shadow-pressed text-gray-900 text-sm rounded-lg  block w-full pl-10 p-2.5  dark:bg-gray-700  dark:placeholder-gray-400 placeholder:italic dark:text-white `}
          placeholder={placeholder}
          value={valObj.value}
          onChange={(e) => {
            if (valObj.error) {
              const error_ = valValidator(e.target.value);
              if (error_) {
                setValue({ value: e.target.value, error: error_ });
              } else {
                setValue({ value: e.target.value, error: "" });
              }
            } else {
              setValue({ value: e.target.value, error: "" });
            }
          }}
        />
      </div>
    </div>
  );
}
