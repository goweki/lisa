export function InputText({
  value = "",
  setValue,
  valValidator = (val) => "",
  name = "inputName",
  label,
  type = "text",
  placeholder = "Text field",
  icon: Icon,
  errFields,
  setErrFields,
  readOnly,
}) {
  return (
    <div className="space-y-2 mb-4">
      {label && (
        <div className="no-wrap">
          <label htmlFor={name} className="px-2">
            {label}
          </label>
        </div>
      )}
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
            errFields.has(name)
              ? "border-red-500 dark:border-red-400"
              : "border-transparent dark:border-transparent focus:ring-emerald-800 focus:border-emerald-800 dark:focus:ring-emerald-800 dark:focus:border-emerald-800"
          } border bg-slate-300 dark:bg-slate-900 shadow dark:shadow-dak dark:focus:shadow-dpressed focus:shadow-pressed text-gray-900 text-sm rounded-lg  block w-full pl-10 p-2.5 dark:placeholder-gray-400 placeholder:italic dark:text-white `}
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            if (errFields.has(name)) {
              const err_ = valValidator(e.target.value);
              if (!err_) {
                setErrFields(
                  (prev) => new Set([...prev].filter((el) => el !== name))
                );
              }
            }
            setValue(e.target.value);
          }}
          disabled={readOnly}
        />
      </div>
    </div>
  );
}

export function InputDate({
  value,
  setValue,
  name = "inputName",
  label,
  type = "date",
  min = "2024-01-01",
  max = "2060-12-31",
  icon: Icon,
  errFields,
  readOnly,
}) {
  return (
    <div className="space-y-2 mb-4">
      {label && (
        <div className="no-wrap">
          <label htmlFor={name} className="px-2">
            {label}
          </label>
        </div>
      )}
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
            errFields.has(name)
              ? "border-red-500 dark:border-red-400"
              : "border-transparent dark:border-transparent focus:ring-emerald-800 focus:border-emerald-800 dark:focus:ring-emerald-800 dark:focus:border-emerald-800"
          } border bg-[linear-gradient(176deg,_#cbd1d8,_#f2f8ff)] dark:bg-[linear-gradient(176deg,_#0e1526,_#10192d)] shadow dark:shadow-dak dark:focus:shadow-dpressed focus:shadow-pressed text-gray-900 text-sm rounded-lg  block w-full pl-10 p-2.5  dark:bg-gray-700 dark:placeholder-gray-400 placeholder:italic dark:text-white `}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          min={min}
          max={max}
          disabled={readOnly}
        />
      </div>
    </div>
  );
}

export function InputSelect({
  optionItems,
  value,
  onChange = () => "",
  name = "inputName",
  defaultOption = "type",
  icon: Icon,
}) {
  return (
    <div className="relative mb-6">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
        {Icon && (
          <Icon className="w-4 h-4 text-emerald-800 dark:text-emerald-500" />
        )}
      </div>
      <select
        name={name}
        id={name}
        className={`bg-slate-300 dark:bg-slate-900 border-transparent dark:border-transparent focus:ring-emerald-800 focus:border-emerald-800 dark:focus:ring-emerald-800 dark:focus:border-emerald-800 border shadow dark:shadow-dak dark:focus:shadow-dpressed focus:shadow-pressed text-gray-900 text-sm rounded-lg  block w-full pl-10 p-2.5 dark:placeholder-gray-400 placeholder:italic dark:text-white `}
        value={value ?? ""}
        onChange={onChange}
      >
        <option value="" className="italic font-light">
          Select a {defaultOption}...
        </option>
        {optionItems.map((option) => (
          <option key={option.value} value={option.value}>
            {option.text}
          </option>
        ))}
      </select>
    </div>
  );
}
