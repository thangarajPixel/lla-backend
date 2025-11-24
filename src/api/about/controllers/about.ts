/**
 * about controller
 */

const { factories } = require("@strapi/strapi");
import { addBaseUrlToMediaUrls } from "../../../helper";

export default factories.createCoreController(
  "api::about.about",
  ({ strapi }) => ({
    async find(ctx) {
      try {
        const entity = await strapi.db.query("api::about.about").findOne({
          populate: {
            about: {
              on: {
                "about.about": {
                  populate: {
                    Image: {
                      select: ["id", "name", "url"],
                    },
                  },
                },
                "about.legacy": {
                  populate: {
                    Image: {
                      select: ["id", "name", "url"],
                    },
                  },
                },
                "about.founder": {
                  populate: {
                    Founder_card: {
                      populate: {
                        Image: {
                          select: ["id", "name", "url"],
                        },
                      },
                    },
                  },
                },
                "about.team": {
                  populate: {
                    Card: {
                      populate: {
                        Image: {
                          select: ["id", "name", "url"],
                        },
                      },
                    },
                    Frame: {
                      populate: {
                        Image: {
                          select: ["id", "name", "url"],
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        });

        if (!entity) {
          return ctx.notFound("About content not found");
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
    async founderById(ctx) {
      try {
        const cardId = Number(ctx.params.id);

        const entity = await strapi.db.query("api::about.about").findOne({
          populate: {
            about: {
              on: {
                "about.founder": {
                  populate: {
                    Founder_card: {
                      populate: {
                        Image: {
                          select: ["id", "name", "url"],
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        });

        if (!entity) {
          return ctx.notFound("Founder data not found");
        }

        // Get founder block
        const founderBlock = entity.about.find(
          (block) => block.__component === "about.founder"
        );

        if (!founderBlock) {
          return ctx.notFound("Founder section not found");
        }

        // Cards array
        let cards = founderBlock.Founder_card;

        // Split: selected card first, others next
        const matchedCard = cards.find((c) => c.id === cardId);
        const otherCards = cards.filter((c) => c.id !== cardId);

        // Reorder
        const finalCards = matchedCard ? [matchedCard, ...otherCards] : cards;

        // Replace original array
        founderBlock.Founder_card = finalCards;

        // addBaseUrlToMediaUrls(founderBlock);

        return super.transformResponse(founderBlock);
      } catch (error) {
        console.error("founderById error:", error);
        return ctx.internalServerError("Failed to load founder data");
      }
    },
  })
);
