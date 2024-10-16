import { useFetchSalesQuery } from "@/redux/slices/order";
import PageError from "../utils/pageError";
import PageLoad from "../utils/pageLoad";
import { formatDate, handleRtkQueryError } from "../utils/utils";
import { PRODUCT } from "@/app/api/orders/order/route";

const Sales = () => {
  const {
    data: sales,
    error: salesFetchError,
    isLoading,
  } = useFetchSalesQuery({});

  if (isLoading) return <PageLoad />;
  if (salesFetchError)
    return <PageError message={handleRtkQueryError(salesFetchError)} />;

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sales.map((sale: PRODUCT, index: number) => (
          <div
            key={index}
            className="border rounded-lg p-4 shadow-md flex flex-col justify-between bg-white"
          >
            <div className="mb-4">
              <p className="font-semibold text-b-color">
                Buyer:{" "}
                <span className="font-normal text-h-color">{sale.buyer}</span>
              </p>
              <p className="font-semibold text-b-color">
                Bought At:{" "}
                <span className="font-normal text-h-color">
                  {formatDate(sale.created_at)}
                </span>
              </p>
            </div>
            <div className="space-y-4">
              <div className="border rounded-lg p-3 bg-gray-100 shadow-sm">
                <p className="font-semibold text-b-color">
                  Product Name:{" "}
                  <span className="font-normal text-h-color">
                    {sale.productname}
                  </span>
                </p>
                <p className="font-semibold text-b-color">
                  Quantity:{" "}
                  <span className="font-normal text-h-color">
                    {sale.productquantity}
                  </span>
                </p>
                <p className="font-semibold text-b-color">
                  Total Price:{" "}
                  <span className="font-normal text-h-color">
                    ${sale.productprice * sale.productquantity}
                  </span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sales;
