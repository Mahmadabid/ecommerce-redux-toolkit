"use client";

import FloatingLabelInput from "@/components/form/FloatingLabelInput";
import ShippingForm from "@/components/form/ShippingForm";
import Stepper from "@/components/form/Stepper";
import { Step } from "@/components/form/type";
import Load from "@/components/utils/Load";
import { generateRandomId, handleRtkQueryError } from "@/components/utils/utils";
import { clearCart } from "@/redux/slices/cart";
import { useCreateOrderMutation } from "@/redux/slices/order";
import { useGetProductsQuery } from "@/redux/slices/product";
import { AppDispatch, RootState } from "@/redux/store";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Checkout = () => {
  const [email, setEmail] = useState("");
  const [check, setCheck] = useState(true);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [steps, setSteps] = useState<Step[]>([
    { label: "Contact Info", completed: false },
    { label: "Shipping", completed: false },
    { label: "Payment", completed: false },
  ]);

  const [fullName, setFullName] = useState("");
  const [shippingEmail, setShippingEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [zipCode, setZipCode] = useState("");
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setAddress(user.address);
      setFullName(user.name);
      setAddress(user.address);
      setCountry(user.country);
      setCity(user.city);
      setZipCode(user.zipcode);
    }
  }, [user]);

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch: AppDispatch = useDispatch();

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const [
    createOrder,
    { error: createOrderError = "", isLoading: createOrderLoading },
  ] = useCreateOrderMutation();

  const { isFetching, refetch: refetchProducts } = useGetProductsQuery();

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

  const handleBack = (e: React.FormEvent) => {
    e.preventDefault();

    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    handleNext();
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const orderData = {
      id: generateRandomId(),
      email: shippingEmail || email,
      name: fullName,
      address,
      city,
      zipcode: zipCode,
      country,
      buyer: user?.username || null,
      buyerId: user?.id || null,
      products: cartItems.map((item) => ({
        productId: item.id,
        productName: item.name,
        productQuantity: item.quantity,
        productPrice: item.price,
        productSeller: item.seller,
        buyer: user?.username || null,
        buyerId: user?.id || null,
      })),
    };

    try {
      await createOrder(orderData).unwrap();
      await refetchProducts();
      dispatch(clearCart());
      window.location.href = `/order?orderId=${orderData.id}`;
      alert("Order placed successfully!");
    } catch (error) {
      console.error("Failed to place order:", error);
      alert("There was an error placing your order. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center text-h-color mt-6 mb-6">
        Checkout
      </h1>
      {createOrderError
          ? handleRtkQueryError(createOrderError)
          : null}
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
                {!user ? (
                  <Link href="/login" className="login-button">
                    Login
                  </Link>
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
              <ShippingForm
                email={email}
                handleBack={handleBack}
                handleNext={handleNext}
                fullName={fullName}
                setFullName={setFullName}
                shippingEmail={shippingEmail}
                setShippingEmail={setShippingEmail}
                address={address}
                setAddress={setAddress}
                city={city}
                setCity={setCity}
                zipCode={zipCode}
                setZipCode={setZipCode}
                country={country}
                setCountry={setCountry}
              />
            </div>
          )}
          {/* Payment Information */}
          {currentStep === 2 && (
            <div>
              <form onSubmit={handleFormSubmit}>
                <h2 className="text-xl font-semibold my-6 text-h-color">
                  Billing Information
                </h2>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded transition cursor-pointer"
                    checked={check}
                    onChange={(e) => setCheck(e.target.checked)}
                    required
                  />
                  <span className="text-gray-700">
                    Cash on Delivery <span className="text-red-500">*</span>
                  </span>
                </label>
                <div className="flex justify-between mt-8">
                  <button
                    onClick={handleBack}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-3 rounded"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={createOrderLoading || isFetching}
                    className="button-style font-semibold px-3 py-2 rounded"
                  >
                    {createOrderLoading || isFetching ? <Load /> : "Complete Purchase"}
                  </button>
                </div>
              </form>
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
