"use client";

import React, { ChangeEvent, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { resizeImageFile } from "@/lib/utils";
import Image from "next/image";
import toast from "react-hot-toast";
import { Label } from "@/components/ui/label";

export function InputText({
  valObj,
  setValue,
  name = "inputName",
  label,
  valValidator = (val: string | void) => {
    if (val) return "";
    else return "Empty value";
  },
  type = "text",
  placeholder = "Text field",
  icon: Icon,
}: InputTextProps) {
  return (
    <div className="space-y-2">
      <div className="no-wrap">
        {label && (
          <label htmlFor={name} className="text-xs px-2">
            {label}
          </label>
        )}
        {valObj.error && (
          <p className="text-xs px-2 text-red-500">{valObj.error}</p>
        )}
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
              : "border-transparent dark:border-transparent focus:ring-primary focus:border-primary"
          } border shadow dark:shadow-dark dark:focus:shadow-dpressed focus:shadow-pressed text-sm rounded-lg block w-full pl-10 p-2.5 dark:placeholder-gray-400 placeholder:italic bg-transparent`}
          placeholder={placeholder}
          value={valObj.value}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            if (valObj.error) {
              const error = valValidator(e.target.value);
              setValue({ value: e.target.value, error });
            } else {
              setValue({ value: e.target.value, error: "" });
            }
          }}
        />
      </div>
    </div>
  );
}

export type ValObj = {
  value: string;
  error: string;
};

type SetValue = (val: ValObj) => void;

type InputTextProps = {
  valObj: ValObj;
  setValue: SetValue;
  name?: string;
  label?: string;
  valValidator?: (val: string) => string;
  type?: string;
  placeholder?: string;
  icon?: React.ComponentType<{ className: string }>;
};

/**
 * Combobox with search functionality
 */
export type Option = { label: string; value: string };

export function ComboboxSearchable({
  label,
  options,
  value,
  error,
  setValue,
}: {
  label: string;
  options: Option[];
  value: string;
  error?: string;
  setValue: React.Dispatch<React.SetStateAction<any>>;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      {error && <p className="text-xs text-red-500">{error}</p>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={`w-[200px] justify-between}`}
          >
            {value
              ? options.find((option) => option.value === value)?.label
              : `Select ${label}...`}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder={`Search ${label}...`} className="h-9" />
            <CommandList>
              <CommandEmpty>No {label} found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    {option.label}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
}

export function InputImage({
  _photo,
  setPhoto,
  label = "Image",
}: {
  _photo: string;
  setPhoto: (_imageFile: any) => void;
  label?: string;
}) {
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");

  return (
    <div className="flex flex-row">
      <Label htmlFor="profile-image" className="opacity-75">
        {label}
      </Label>
      <label
        htmlFor="profile-image"
        className="group relative flex justify-center w-32 aspect-square items-center bg-emerald-100 rounded-full hover:cursor-pointer border-4 border-emerald-800/25"
      >
        {!imagePreviewUrl && !_photo ? (
          <span className="text-black/75 group-hover:opacity-0 material-icons text-2xl transition-opacity duration-300">
            image
          </span>
        ) : (
          <div className="relative h-full w-full">
            <Image
              alt="display-photo"
              fill
              priority={false}
              sizes="132px"
              src={imagePreviewUrl || _photo}
              className="object-cover group-hover:opacity-25 transition-opacity duration-300 rounded-full !bg-transparent"
            />
          </div>
        )}
        <span className="material-icons text-2xl absolute inset-0 flex justify-center items-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 text-black">
          upload
        </span>
        <input
          id="profile-image"
          className="hidden"
          type="file"
          onChange={async (e) => {
            if (!e.target?.files || e.target.files.length === 0) {
              toast.error("Please select an image file.");
              setImagePreviewUrl("");
              setPhoto(null);
              return;
            }
            const image_ = e.target.files[0];

            if (
              image_ &&
              image_.type.startsWith("image/") &&
              image_.size / (1024 * 1024) < 2
            ) {
              const resizedImage_ = await resizeImageFile(image_);
              setImagePreviewUrl(URL.createObjectURL(resizedImage_));
              setPhoto(resizedImage_);
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
}
