/**
 * campus controller
 */

const { factories } = require("@strapi/strapi");
import { addBaseUrlToMediaUrls } from "../../../helper";

export default factories.createCoreController(
  "api::campus.campus",
  ({ strapi }) => ({
    async find(ctx) {
      try {
        const entity = await strapi.db.query("api::campus.campus").findOne({
          populate: {
            campus: {
              on: {
                "campus.menu": {
                  populate: {
                    Image: {
                      select: ["id", "name", "url"],
                    },
                    Video: {
                      select: ["id", "name", "url"],
                    },
                  },
                },
                "campus.facilities": {
                  populate: {
                    Card: {
                      populate: {
                        Image: {
                          select: ["id", "name", "url"],
                        },
                      },
                    },
                  },
                },
                "home.gallery": {
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
          return ctx.notFound("Campus content not found");
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
