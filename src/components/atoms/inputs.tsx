import React, { ChangeEvent } from "react";
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

type ValObj = {
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
type Options = { label: string; value: string }[];

export function ComboboxSearchable({
  label,
  options,
  value,
  setValue,
}: {
  label: string;
  options: Options;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
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
  );
}
