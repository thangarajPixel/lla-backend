/**
 * life controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::life.life",
  ({ strapi }) => ({
    async find(ctx) {
      try {
        const page = parseInt(String(ctx.query.page)) || 1;
        const perPage = parseInt(String(ctx.query.per_page)) || 10;

        const entity = await strapi.db.query("api::life.life").findOne({
          populate: {
            Card: {
              populate: {
                Image: {
                  select: ["id", "name", "url"],
                },
              },
            },
          },
        });

        if (!entity) {
          return ctx.notFound("Life content not found");
        }

        const totalCards = entity.Card ? entity.Card.length : 0;
        const start = (page - 1) * perPage;
        const end = start + perPage;
        const paginatedCards = entity.Card.slice(start, end);

        // original card data with paginated data
        entity.Card = paginatedCards;

        const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

        return this.transformResponse(sanitizedEntity, {
          page,
          perPage,
          total: totalCards,
          totalPages: Math.ceil(totalCards / perPage),
        });
      } catch (error) {
        console.error("Life find error:", error);
        return ctx.internalServerError("Failed to load life data");
      }
    },
  })
);
