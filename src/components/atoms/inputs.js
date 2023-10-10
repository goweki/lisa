export function InputText({
  label = "TextInput",
  value,
  type = "text",
  name,
  onChange,
  placeholder = "Text field",
  classes,
  icon: Icon,
}) {
  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={name} className="block text-xs pl-2">
          {label}
        </label>
      )}
      <div className="relative mb-6 mt-0">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
          <Icon className="w-4 h-4 text-emerald-800 dark:text-emerald-500" />
        </div>
        <input
          name={name}
          id={name}
          type={type}
          className={`bg-[linear-gradient(176deg,_#cbd1d8,_#f2f8ff)] dark:bg-[linear-gradient(176deg,_#0e1526,_#10192d)] border-none shadow dark:shadow-dak dark:focus:shadow-dpressed focus:shadow-pressed text-gray-900 text-sm rounded-lg focus:ring-emerald-800 focus:border-emerald-800 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-800 dark:focus:border-emerald-800 ${classes}`}
          placeholder={placeholder}
          value={value.value}
          onChange={(e) => onChange(e)}
        />
      </div>
    </div>
  );
}
