import Layout from "../layout";
import { type Currency, type Product } from "./schema";

function formattedPrice(price: number, currency: Currency): string {
  return price.toLocaleString("en-US", {
    style: "currency",
    currency: currency,
  });
}

export default function Default({ product }: { product: Product }) {
  let discountPercentage: number | string | undefined = undefined;

  const price = product.price / 100;
  const currency = product.currency;

  let discountPrice: number | undefined = undefined;

  if (product.discount_price) {
    discountPercentage =
      (product.price - product.discount_price) / product.price;

    discountPercentage = Math.round(discountPercentage * 100) + "%";
    discountPrice = product.discount_price / 100;
  }

  return (
    <Layout>
      <div className="h-screen grid place-items-center bg-black">
        <div
          id="product"
          className="size-[600px] flex flex-col aspect-square overflow-hidden bg-white"
        >
          <div className="relative h-[498px] p-12">
            <img
              src={product.image}
              alt={product.title}
              className="object-contain size-full"
            />

            <div className="absolute bottom-0 flex items-center gap-x-2 inset-x-0 px-6 py-2">
              {discountPercentage && (
                <div className="px-2.5 h-8 flex items-center justify-center text-lg font-medium text-white rounded-lg bg-red-600">
                  -{discountPercentage}
                </div>
              )}
              {product.with_free_shipping &&
                product.free_shipping_badge_text && (
                  <div className="px-3 h-8 flex items-center justify-center text-lg font-medium bg-[#D9F6C5] text-green-950 rounded-md">
                    {product.free_shipping_badge_text}
                  </div>
                )}
            </div>
          </div>

          <div className="py-3 px-6 h-[102px] justify-center flex flex-col bg-white">
            <div className="flex items-center gap-x-3">
              <h1
                className={`text-4xl font-bold tracking-tight ${
                  discountPercentage ? "text-red-600" : "text-gray-900"
                }`}
              >
                {discountPrice && formattedPrice(discountPrice, currency)}
                {!discountPrice && formattedPrice(price, currency)}
              </h1>
              {discountPrice && (
                <span className="text-2xl font-semibold text-gray-800 line-through">
                  {formattedPrice(price, currency)}
                </span>
              )}
            </div>
            {product.description && (
              <p className="mt-1.5 text-gray-800 font-medium text-lg">
                {product.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
