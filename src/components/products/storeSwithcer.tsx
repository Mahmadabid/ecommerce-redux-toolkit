interface StoreSwithcerProps {
  handleisProducts: () => void;
  isProduct: boolean;
}

const StoreSwithcer: React.FC<StoreSwithcerProps> = ({
  handleisProducts,
  isProduct,
}) => {
  return (
    <>
      <div className="flex justify-center space-x-16">
        <button
          onClick={handleisProducts}
          className={`button-style p-3 py-2 rounded font-semibold disabled:bg-gray-500`}
          disabled={isProduct}
        >
          Products
        </button>
        <button
          onClick={handleisProducts}
          className={`login-button p-3 py-2 rounded disabled:bg-gray-500`}
          disabled={!isProduct}
        >
          Add Product
        </button>
      </div>
    </>
  );
};

export default StoreSwithcer;
