"use client";

import React, { useState } from "react";
import { FloatingLabelInputProps } from "./type";

const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  label,
  required,
  value,
  onChange,
  type,
  classname,
  isDisabled,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputId = label.replace(/\s+/g, "-").toLowerCase();

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    if (value === "") {
      setIsFocused(false);
    }
  };

  return (
    <div className={`relative mb-4 ${classname}`}>
      <input
        id={inputId}
        type={type ? type : "text"}
        value={value}
        disabled={isDisabled}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={(e) => onChange(e.target.value)}
        className={`outline-none text-slate-900 w-full border rounded-md px-3 py-2 transition duration-150 ease-in-out ${
          isFocused || value ? "border-blue-500" : "border-gray-400"
        } focus:border-blue-500 focus:outline-none`}
        required={required}
      />
      <label
        htmlFor={inputId}
        className={`absolute cursor-text left-3 transition-all duration-[250ms] transform ${
          isFocused || value
            ? `-translate-y-2 z-10 scale-90 text-xs ${
                isDisabled ? "text-gray-400" : "text-blue-500"
              }`
            : "top-[10px] scale-100 text-sm text-gray-500"
        }`}
      >
        <span
          className={`bg-white px-1 transition-all duration-150 ease-in-out ${
            isFocused || value ? "h-6" : "h-8"
          }`}
        >
          {label}
          {required && <span className="text-red-500">*</span>}
        </span>
      </label>
      <fieldset
        className={`absolute inset-0 border-2 rounded-md transition-all duration-[250ms] pointer-events-none ${
          !isDisabled? isFocused || value ? "border-blue-500 out" : "border-gray-400": "border-gray-400"
        }`}
      />
    </div>
  );
};

export default FloatingLabelInput;
