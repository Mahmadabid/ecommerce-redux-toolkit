// For server side dynamic pages, using nextjs 13 for better seo

import PageError from "@/components/utils/pageError";
import SellerPageClient from "../../../components/products/SellerPageClient";

async function fetchProducts(sellerName: string) {
  let products = [];
  let error = null;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}products?seller=${sellerName}`);
    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }
    products = await res.json();
  } catch (err) {
    console.error("Error fetching products:", err);
    error = "Failed to load products.";
  }

  return { products, error };
}

const SellerPage = async ({ params }: { params: { seller: string } }) => {
  const { seller } = params;
  const { products, error } = await fetchProducts(seller);

  if (error) return <PageError />;

  return <SellerPageClient seller={seller} products={products} />;
};

export default SellerPage;
