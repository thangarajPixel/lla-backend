/**
 * nilgiris controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::nilgiris.nilgiris",
  ({ strapi }) => ({
    async find(ctx) {
      try {
        const entity = await strapi.db.query("api::nilgiris.nilgiris").findOne({
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

        if (!entity) {
          return ctx.notFound("Nilgiris content not found");
        }

        const sanitizedEntity = await super.sanitizeOutput(entity, ctx);

        return super.transformResponse(sanitizedEntity);
      } catch (error) {
        return ctx.internalServerError("Failed to load home data");
      }
    },
  })
);
