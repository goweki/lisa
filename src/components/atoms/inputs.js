export function InputText({
  label = "TextInput",
  required,
  type = "text",
  name,
  placeholder = "Text field",
  classes,
  icon: Icon,
}) {
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={name} className="block text-sm pl-2">
          {label}
        </label>
      )}
      <div className="relative mb-6 mt-0">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
          <Icon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </div>
        <input
          name={name}
          id={name}
          type={type}
          className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${classes}`}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
