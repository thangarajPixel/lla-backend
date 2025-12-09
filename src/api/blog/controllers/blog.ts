/**
 * blog controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::blog.blog",
  ({ strapi }) => ({
    async find(ctx) {
      try {
        const entity = await strapi.db.query("api::blog.blog").findOne({
          populate: {
            Blog: {
              populate: {
                BlogCard: {
                  populate: {
                    Image: {
                      select: ["id", "name", "url"],
                    },
                  },
                },
              },
            },
          },
        });

        if (!entity) {
          return ctx.notFound("Blog content not found");
        }

        // Add base URL to media URLs
        // addBaseUrlToMediaUrls(entity);

        const sanitizedEntity = await super.sanitizeOutput(entity, ctx);
        return super.transformResponse(sanitizedEntity);
      } catch (error) {
        console.error("Home find error:", error);
        return ctx.internalServerError("Failed to load home data");
      }
    },
  })
);
