import { useState } from "react";
import toast from "react-hot-toast";

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

export function InputImage({ _photo, setPhoto }) {
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");

  // const photoUpload = (e) => {
  //   e.preventDefault();
  //   const reader = new FileReader();
  //   const photo_ = e.target.files[0];
  //   reader.onloadend = () => {
  //     setFile(photo_);
  //     setImagePreviewUrl(reader.result);
  //   };
  //   reader.readAsDataURL(photo_);
  // };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   setActive((prevActive) => (prevActive === "edit" ? "profile" : "edit"));
  // };

  return (
    <div className="flex flex-row">
      <span className="m-4 h-full">Photo:</span>
      <label
        htmlFor="profile-image"
        className="group relative flex justify-center aspect-square min-w-24 max-w-48 items-center bg-gray-200 dark:bg-slate-900 rounded-full hover:cursor-pointer"
      >
        {!imagePreviewUrl && !_photo ? (
          <span className="group-hover:opacity-0 material-icons text-6xl transition-opacity duration-300">
            person
          </span>
        ) : (
          <img
            alt="display-photo"
            src={imagePreviewUrl || _photo}
            className="group-hover:opacity-50 transition-opacity duration-300 min-w-24 max-w-48 rounded-full "
          />
        )}
        <span className="material-icons text-6xl absolute inset-0 flex justify-center items-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          upload
        </span>
        <input
          id="profile-image"
          className="hidden"
          type="file"
          onChange={(e) => {
            if (!e.target?.files[0]) return;
            const photo_ = e.target.files[0];
            if (
              photo_ &&
              photo_.type.startsWith("image/") &&
              photo_.size / (1024 * 1024) < 2
            ) {
              setImagePreviewUrl(URL.createObjectURL(photo_));
              setPhoto(photo_);
            } else {
              console.error(
                "Invalid file or file-size. Please select an image less than 2MB."
              );
              // alert("Please select an image file.");
              toast.error("Please select an image less than 2MB.");
            }
          }}
        />
      </label>
    </div>
  );

  // (
  //   <label htmlFor="profile-image">
  //     <img
  //       alt="User Pic"
  //       src="https://d30y9cdsu7xlg0.cloudfront.net/png/138926-200.png"
  //       className="rounded-full cursor-pointer w-24 h-24 mx-auto border border-gray-300"
  //     />
  //     <input
  //       id="profile-image"
  //       className="hidden"
  //       type="file"
  //       onChange={() => "Clicked-KUKU"}
  //     />
  //   </label>
  // )
}
