"use client";

import FloatingLabelInput from "@/components/form/FloatingLabelInput";
import ShippingForm from "@/components/form/ShippingForm";
import Stepper from "@/components/form/Stepper";
import { Step } from "@/components/form/type";
import { cartItems, User } from "@/components/utils/bin";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useState } from "react";

const Checkout = () => {
  const [email, setEmail] = useState("");
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [steps, setSteps] = useState<Step[]>([
    { label: "Contact Info", completed: false },
    { label: "Shipping", completed: false },
    { label: "Payment", completed: false },
  ]);

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setSteps((prevSteps) =>
        prevSteps.map((step, index) =>
          index === currentStep ? { ...step, completed: true } : step
        )
      );
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    handleNext();
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center text-h-color mt-6 mb-6">
        Checkout
      </h1>
      {cartItems.length > 0 ? (
        <>
          {/* Cart Items Section */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Your Cart</h2>
            {cartItems.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b border-gray-300 py-2"
              >
                <div className="flex items-center">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-16 h-16 object-cover mr-4"
                  />
                  <div>
                    <h3 className="text-lg font-medium">{item.name}</h3>
                    <p className="text-gray-600">Seller: {item.seller}</p>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                </div>
                <div className="text-lg font-medium">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* Total Price Section */}
          <div className="flex justify-between items-center font-bold text-xl mb-4">
            <span>Total Price:</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <div className={`h-0.5 w-full bg-gray-200 my-4`} />
          {/* Stepper */}
          <Stepper currentStep={currentStep} steps={steps} />
          {/* Conditionally Render Each Step */}
          {/* Contact Information */}
          {currentStep === 0 && (
            <form onSubmit={handleContactSubmit}>
              <h2 className="text-xl font-semibold my-6 text-h-color">
                Contact Info.
              </h2>
              <FloatingLabelInput
                label="Email"
                required
                type="email"
                value={email}
                onChange={setEmail}
              />
              <div className="flex justify-center space-x-20 mt-3">
                {User.userId ? (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                    className="bg-[#22492D] text-white hover:bg-[#17311f] font-semibold px-3 py-2 rounded"
                  >
                    Login
                  </button>
                ) : null}
                <button
                  type="submit"
                  className="button-style font-semibold px-3 py-2 rounded"
                >
                  Proceed
                </button>
              </div>
            </form>
          )}

          {/* Shipping Information */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-xl font-semibold my-6 text-h-color">
                Shipping Information
              </h2>
              <ShippingForm email={email} handleBack={handleBack} handleNext={handleNext} />
            </div>
          )}
        </>
      ) : (
        // Cart is empty
        <div className="ustify-center flex items-center my-16 flex-col">
          <p className="text-xl font-semibold">Cart is empty</p>
          <Link
            href="/products"
            className="px-4 mt-4 py-2 rounded-lg font-semibold button-style"
          >
            Shop now <FontAwesomeIcon icon={faShoppingCart} />
          </Link>
        </div>
      )}
    </div>
  );
};

export default Checkout;
