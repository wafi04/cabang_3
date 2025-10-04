import { AuthenticationLayout } from "@/features/layouts/authenticationLayout";
import { MainBanner } from "@/features/modules/banner/components/banner";
import { CategoriesChoices } from "@/features/modules/categories/components/categoriesTypes";
import { SectionCategory } from "@/features/modules/categories/components/sectionCategory";
import { SectionPromosProduct } from "@/features/modules/products/components/SectionPromosProduct";
import { FeaturesSection } from "@/features/modules/transactions/components/order/features-section";

export default function Home() {
  return (
    <AuthenticationLayout>
        <MainBanner />
        <SectionPromosProduct />
        <CategoriesChoices />
        <SectionCategory />
        <FeaturesSection />
    </AuthenticationLayout>
  );
}
