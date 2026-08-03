import type { Metadata } from "next";
import BlogListClient from "./BlogListClient";
import BreadcrumbJsonLd from "../../components/BreadcrumbJsonLd";
import { buildPageMetadata } from "../../lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Blog | AIMS Capital - Legal & Investment Insights",
  description:
    "Analysis, insights and updates on law, investment and business in Rwanda and across Africa from AIMS Capital legal and investment experts.",
  path: "/blog/",
  keywords: [
    "legal insights Rwanda",
    "investment advice East Africa",
    "corporate law blog",
    "arbitration updates Rwanda",
    "AIMS Capital blog",
  ],
});

export default function BlogPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Blog", url: "/blog/" },
      ]} />
      <BlogListClient />
    </>
  );
}