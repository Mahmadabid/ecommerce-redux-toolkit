import Product from "@/components/products/Product";
import { products } from "@/components/utils/bin";

const ProductDisplay = () => {
  return (
    <div className="flex flex-wrap justify-center mt-8">
      {products.map((product, index) => (
        <Product key={index} product={product} />
      ))}
    </div>
  );
};

export default ProductDisplay;
