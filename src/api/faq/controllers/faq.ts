/**
 * faq controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController("api::faq.faq", ({ strapi }) => ({
  async find(ctx) {
    try {
      const entity = await strapi.db.query("api::faq.faq").findOne({
        populate: {
          faq: {
            on: {
              "faq.faq": {
                populate: true,
              },
            },
          },
        },
      });

      if (!entity) {
        return ctx.notFound("Home content not found");
      }

      // Add base URL to media URLs
      // addBaseUrlToMediaUrls(entity);

      const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
      return this.transformResponse(sanitizedEntity);
    } catch (error) {
      console.error("Home find error:", error);
      return ctx.internalServerError("Failed to load home data");
    }
  },
}));
