/**
 * gallery controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::gallery.gallery",
  ({ strapi }) => ({
    async find(ctx) {
      try {
        const page = parseInt(String(ctx.query.page)) || 1;
        const pageSize = parseInt(String(ctx.query.per_page)) || 10;
        const type = ctx.query.type ? String(ctx.query.type) : null;

        const entity = await strapi.db
          .query("api::gallery.gallery")
          .findOne({
            populate: {
              ImageCard: {
                populate: {
                  Image: {
                    select: ["id", "name", "url"],
                  },
                },
              },
            },
          });

        if (!entity) return ctx.notFound("Gallery not found");

        // Filter
        let cards = entity.ImageCard || [];
        if (type) {
          cards = cards.filter((card) => card.Type === type);
        }

        const totalCards = cards.length;
        const start = (page - 1) * pageSize;
        const end = start + pageSize;

        // Apply pagination on filtered cards
        entity.ImageCard = cards.slice(start, end);

        const sanitizedEntity = await super.sanitizeOutput(entity);

        sanitizedEntity.pagination = {
          page,
          pageSize,
          total: totalCards,
          totalPages: Math.ceil(totalCards / pageSize),
        };

        return { data: sanitizedEntity };
      } catch (err) {
        console.error("Gallery find error:", err);
        return ctx.internalServerError("Failed to load gallery data");
      }
    },
  })
);

