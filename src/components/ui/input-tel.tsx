import * as React from "react";
import PhoneInput from 'react-phone-number-input/input'
import { InputProps } from "./input";

export type InputTelProps = {
  value: string;
  onChange: (value?: string) => void;
  inputComponent?: React.ElementType;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return (
    <input
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 
      py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm 
      file:font-medium placeholder:text-muted-foreground placeholder:italic 
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring 
      disabled:cursor-not-allowed disabled:opacity-50 focus:ring-border focus:ring-1 
      focus:border-1 focus:border-border`}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";


export const InputTel: React.FC<InputTelProps> = ({
  value,
  onChange,
}) => {
  return (
    <PhoneInput
      value={value}
      onChange={onChange}
      inputComponent={Input}
    />
  );
};
