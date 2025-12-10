/**
 * blog controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::blog.blog",
  ({ strapi }) => ({
    async find(ctx) {
      try {
        const page = parseInt(String(ctx.query.page)) || 1;
        const pageSize = parseInt(String(ctx.query.per_page)) || 10;

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


        let cards = entity.Blog.BlogCard || [];

        const totalCards = cards.length;
        const start = (page - 1) * pageSize;
        const end = start + pageSize;

        // Apply pagination on filtered cards
        entity.Blog.BlogCard = cards.slice(start, end);

        const sanitizedEntity = await super.sanitizeOutput(entity);

        sanitizedEntity.pagination = {
          page,
          pageSize,
          total: totalCards,
          totalPages: Math.ceil(totalCards / pageSize),
        };

        // Add base URL to media URLs
        // addBaseUrlToMediaUrls(entity);

        return { data: sanitizedEntity };

      } catch (error) {
        console.error("Home find error:", error);
        return ctx.internalServerError("Failed to load home data");
      }
    },
  })
);
