interface StoreSwithcerProps {
  handleSwitcher: (value: number) => void;
  storeSwitcher: number;
}

const StoreSwithcer: React.FC<StoreSwithcerProps> = ({
  handleSwitcher,
  storeSwitcher,
}) => {
  return (
    <>
      <div className="flex justify-center space-x-16 xxmd:space-x-3">
        <button
          onClick={() => handleSwitcher(0)}
          className={`button-style p-3 py-2 xxmd:p-[6px] xxmd:py-1 xxmd:!font-medium rounded font-semibold disabled:bg-gray-500`}
          disabled={storeSwitcher === 0}
        >
          Products
        </button>
        <button
          onClick={() => handleSwitcher(1)}
          className={`login-button p-3 py-2 xxmd:p-[6px] xxmd:py-1 xxmd:!font-medium rounded disabled:bg-gray-500`}
          disabled={storeSwitcher === 1}
        >
          Add Product
        </button>
        <button
          onClick={() => handleSwitcher(2)}
          className={`button-style font-semibold p-3 py-2 xxmd:p-[6px] xxmd:py-1 xxmd:!font-medium rounded disabled:bg-gray-500`}
          disabled={storeSwitcher === 2}
        >
          Sales
        </button>
      </div>
    </>
  );
};

export default StoreSwithcer;
