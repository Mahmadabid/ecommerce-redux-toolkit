import { useState } from "react";
import FloatingLabelInput from "../form/FloatingLabelInput";
import Image from "next/image";
import { useAddProductsMutation } from "@/redux/slices/product";
import Load from "../utils/Load";
import { handleRtkQueryError } from "../utils/utils";

interface AddProductProps {
  userId: string;
  username: string;
  isFetching: boolean;
  handleStoreChange: (value: number) => void;
  setNotification: React.Dispatch<
    React.SetStateAction<{
      message: string;
      visible: boolean;
      remove: boolean;
    }>
  >;
}

const AddProduct: React.FC<AddProductProps> = ({
  userId,
  username,
  isFetching,
  handleStoreChange,
  setNotification,
}) => {
  const [formData, setFormData] = useState({
    img: "",
    name: "",
    quantity: 10,
    price: 1.0,
  });
  const [ProductError, setproductError] = useState<string | null>(null);

  const handleAddNotification = (itemName: string, remove: boolean, error?: string) => {
    setNotification({
      message: remove ? `Couldn't Add ${itemName}, ${error}` : `${itemName} Added Product`,
      visible: true,
      remove: remove ? true : false,
    });
    setTimeout(() => {
      setNotification({
        message: "Added Product",
        visible: false,
        remove: false,
      });
    }, 5000);
  };

  const [addProduct, { isLoading: addProductoading, error: addProductError }] =
    useAddProductsMutation();

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((state) => ({
      ...state,
      [field]:
        field === "quantity" || field === "price" ? Number(value) : value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setproductError(null);

    if (formData.quantity < 1 || !Number.isInteger(formData.quantity)) {
      setproductError("Quantity must be at least 1 and an integer.");
      return;
    }

    if (formData.price <= 0) {
      setproductError("Price must be greater than 0.");
      return;
    }

    const { error } = await addProduct({
      seller: username,
      img: formData.img,
      name: formData.name,
      quantity: formData.quantity,
      price: formData.price,
      userId,
    });

    if (!error) {
      handleAddNotification(formData.name, false);

      handleStoreChange(1);
    } else {
      handleAddNotification(formData.name, true, handleRtkQueryError(error));
    }
  };

  return (
    <div className="mt-6">
      {ProductError && <p className="text-red-500 my-2">{ProductError}</p>}
      <p className="text-red-500 my-2">
        {addProductError ? handleRtkQueryError(addProductError) : null}
      </p>
      <form onSubmit={handleFormSubmit}>
        <FloatingLabelInput
          label="Image URL"
          required
          value={formData.img}
          onChange={(value) => handleChange("img", value)}
          type="url"
        />
        {formData.img && (
          <div className="h-[196px] w-226px] relative mb-4">
            <Image
              src={formData.img}
              alt={formData.name || "Product Image"}
              fill
              sizes="600px"
              className="object-cover"
            />
          </div>
        )}
        <FloatingLabelInput
          label="Product Name"
          required
          value={formData.name}
          onChange={(value) => handleChange("name", value)}
        />
        <FloatingLabelInput
          label="Quantity"
          required
          value={formData.quantity.toString()}
          onChange={(value) => handleChange("quantity", value)}
          type="number"
        />
        <FloatingLabelInput
          label="Price"
          required
          value={formData.price.toString()}
          onChange={(value) => handleChange("price", value)}
          type="number"
        />
        <button
          type="submit"
          disabled={addProductoading || isFetching}
          className="font-bold px-3 py-3 rounded-md button-style"
        >
          {addProductoading || isFetching ? <Load /> : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
