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
                    Mobile_image: {
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
    async founderBySlug(ctx) {
      try {
        const slug = ctx.params.slug;

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
                        ViewCard : {
                          populate: {
                            Image: {
                              select: ["id", "name", "url"],
                            }
                          }
                        }
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
        const matchedCard = cards.find((c) => c.Slug === slug);

        // Reorder
        const finalCards = matchedCard ? [matchedCard] : cards;

        // Replace original array
        founderBlock.Founder_card = finalCards;

        // addBaseUrlToMediaUrls(founderBlock);

        return super.transformResponse(founderBlock);
      } catch (error) {
        console.error("founderById error:", error);
        return ctx.internalServerError("Failed to load founder data");
      }
    },
    async teamBySlug(ctx) {
      try {
        const slug = ctx.params.slug;
        const page = parseInt(String(ctx.query.page)) || 1;
        const pageSize = parseInt(String(ctx.query.per_page)) || 1;

        const entity = await strapi.db.query("api::about.about").findOne({
          populate: {
            about: {
              on: {
                "about.team": {
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
              },
            },
          },
        });

        if (!entity) {
          return ctx.notFound("Founder data not found");
        }

        // Get founder block
        const teamBlock = entity.about.find(
          (block) => block.__component === "about.team"
        );

        if (!teamBlock) {
          return ctx.notFound("Team section not found");
        }

        let cards = teamBlock?.Card || [];
        if (slug && page === 1) {
          cards = cards.filter((card) => card.Slug === slug);
        } else if (slug && page !== 1) {
          cards = cards.filter((card) => card.Slug !== slug);
        }

        const totalCards = cards.length;
        const totalPages = Math.ceil(totalCards / pageSize);
        const start =(page - 1) * pageSize < totalCards ? (page - 1) * pageSize : 0;
        const end = start + pageSize;

        // Apply pagination on filtered cards
        teamBlock.Card = cards.slice(start, end);

        const sanitizedEntity = await super.sanitizeOutput(entity);

        sanitizedEntity.pagination = {
          page,
          pageSize,
          totalCards: totalCards,
          totalPages: totalPages,
        };

        return { data: sanitizedEntity };
      } catch (error) {
        console.error("founderById error:", error);
        return ctx.internalServerError("Failed to load founder data");
      }
    },
  })
);
