import { type SchemaTypeDefinition } from "sanity";

import { page } from "./page";
import { block } from "./pageBlock";
import { siteSettings } from "./siteSettings";
import { seoLocal } from "./seoLocal";

export const schemaTypes: SchemaTypeDefinition[] = [page, block, siteSettings, seoLocal];
