import "server-only";

import { connectDB } from "@/server/db";
import { CategoryModel } from "@/server/models/category.model";
import { PageSeoModel } from "@/server/models/page-seo.model";

import { mapSeo } from "./seo.mapper";
import type { ResolvedSeo } from "./seo.types";

type ResolveSeoInput =
  | { type: "page"; pageKey: string }
  | { type: "category"; slug: string };

export async function resolveSeo(
  input: ResolveSeoInput,
): Promise<ResolvedSeo | null> {
  await connectDB();

  switch (input.type) {
    /* ================= STATIC / CMS PAGES ================= */
    case "page": {
      const page = await PageSeoModel.findOne({
        pageKey: input.pageKey,
        isActive: true,
      }).lean();

      return page?.seo ?? null;
    }

    /* ================= CATEGORY ================= */
    case "category": {
      const category = await CategoryModel.findOne({
        slug: input.slug,
        isActive: true,
      }).lean();

      if (!category) return null;

      return mapSeo({
        seo: category.seo,
        fallback: {
          title: category.name,
          description: category.description,
          imageUrl: category.image?.url,
          slug: category.slug,
          canonicalBase: "/categories",
        },
      });
    }
  }
}
