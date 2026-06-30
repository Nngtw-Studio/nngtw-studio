import { notFound } from "next/navigation";
import { isProductCategoryEnabled, PRODUCT_CATEGORIES } from "@/lib/products/config";

interface Props {
  params: Promise<{ category: string }>;
}

/** Prepared route for future store — hidden until categories are enabled */
export default async function ProductsCategoryPage({ params }: Props) {
  const { category } = await params;

  if (!isProductCategoryEnabled(category)) {
    notFound();
  }

  const config = PRODUCT_CATEGORIES[category as keyof typeof PRODUCT_CATEGORIES];

  return (
    <section className="section-padding mx-auto max-w-[1600px]">
      <h1 className="editorial-heading text-5xl text-brand-white">{config.label}</h1>
      <p className="mt-6 text-brand-grey">Products coming soon.</p>
    </section>
  );
}
