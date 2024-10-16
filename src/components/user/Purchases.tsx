import { useFetchPurchasesQuery } from "@/redux/slices/order";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import PageLoad from "../utils/pageLoad";
import PageError from "../utils/pageError";
import { formatDate, handleRtkQueryError } from "../utils/utils";
import { PRODUCT } from "@/app/api/orders/order/route";

interface PurchaseProps {
  created_at: string;
  id: string;
  products: PRODUCT[];
}

const Purchases = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const {
    data: purchases = [],
    error: errorPurchases,
    isLoading,
  } = useFetchPurchasesQuery({ buyerId: user?.id });

  const handleOrder = (orderId: string) => {
    window.location.href = `/order?orderId=${orderId}`;
  }

  if (isLoading) return <PageLoad />;
  if (errorPurchases)
    return <PageError message={handleRtkQueryError(errorPurchases)} />;

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {purchases.map((purchase: PurchaseProps) => (
          <div key={purchase.id} className="border rounded-lg p-4 shadow-md flex flex-col justify-between bg-white">
            <div className="mb-4">
              <p className="font-semibold text-b-color">Order Id: <span className="font-normal text-h-color">{purchase.id}</span></p>
              <p className="font-semibold text-b-color">Bought At: <span className="font-normal text-h-color">{formatDate(purchase.created_at)}</span></p>
            </div>
            <div className="space-y-4">
              {purchase.products.map((product: PRODUCT, index: number) => (
                <div key={index} className="border rounded-lg p-3 bg-gray-100 shadow-sm">
                  <p className="font-semibold text-b-color">Product Name: <span className="font-normal text-h-color">{product.productname}</span></p>
                  <p className="font-semibold text-b-color">Seller: <span className="font-normal text-h-color">{product.productseller}</span></p>
                  <p className="font-semibold text-b-color">Quantity: <span className="font-normal text-h-color">{product.productquantity}</span></p>
                  <p className="font-semibold text-b-color">Total Price: <span className="font-normal text-h-color">${product.productprice * product.productquantity}</span></p>
                </div>
              ))}
            </div>
            <button className="button-style font-semibold px-3 py-2 my-2 mt-4 rounded" onClick={() => handleOrder(purchase.id)}>
                View Order
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Purchases;
