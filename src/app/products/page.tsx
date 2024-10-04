import Product from "@/components/products/Product";
import { products } from "@/components/utils/bin";

const ProductDisplay = () => {
  return (
    <div className="flex flex-wrap justify-center mt-8">
      {products.length > 0 ? (
        products.map((product, index) => (
          <Product key={index} product={product} />
        ))
      ) : (
        // Products are empty
        <div>
          <p className="text-xl text-h-color mt-16">Sorry we are out of products. We will add them soon!</p>
        </div>
      )}
    </div>
  );
};

export default ProductDisplay;
