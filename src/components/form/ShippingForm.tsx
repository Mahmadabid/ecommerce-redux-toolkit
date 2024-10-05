"use client";

import React, { useEffect, useState } from "react";
import FloatingLabelInput from "./FloatingLabelInput";
import { ShippingFormProps } from "./type";

const ShippingForm: React.FC<ShippingFormProps> = ({
  email,
  handleBack,
  handleNext,
  fullName,
  setFullName,
  shippingEmail,
  setShippingEmail,
  address,
  setAddress,
  city,
  setCity,
  zipCode,
  setZipCode,
}) => {
  useEffect(() => {
    setShippingEmail(email);
  }, [email]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    handleNext();
    // If validation passes, handle form submission (e.g., API call)
    console.log("Form submitted:", {
      fullName,
      shippingEmail,
      address,
      city,
      zipCode,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <FloatingLabelInput
        label="Full Name"
        required
        value={fullName}
        onChange={setFullName}
      />
      <FloatingLabelInput
        label="Email"
        required
        value={shippingEmail}
        onChange={setShippingEmail}
        type="email"
      />
      <FloatingLabelInput
        label="Address"
        required
        value={address}
        onChange={setAddress}
      />
      <FloatingLabelInput
        label="City"
        required
        value={city}
        onChange={setCity}
      />
      <FloatingLabelInput
        label="Zip Code"
        required
        value={zipCode}
        onChange={setZipCode}
      />
      <div className="flex justify-between mt-4">
        <button
          onClick={handleBack}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
        >
          Back
        </button>
        <button
          type="submit"
          className="font-bold px-3 py-3 rounded-md button-style"
        >
          Proceed to Payment
        </button>
      </div>
    </form>
  );
};

export default ShippingForm;
