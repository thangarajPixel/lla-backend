/**
 * faculty controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::faculty.faculty",
  ({ strapi }) => ({
    async find(ctx) {
      try {
        const entity = await strapi.db.query("api::faculty.faculty").findOne({
          populate: {
            Faculty: {
              on: {
                "faculty.faculty": {
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
                "faculty.photography": {
                  populate: {
                    Card: {
                      populate: {
                        Image: {
                          select: ["id", "name", "url"],
                        },
                        ViewCard: {
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
                "faculty.filmmaking": {
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
                "faculty.visiting": {
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
          return ctx.notFound("Faculty content not found");
        }

        const sanitizedEntity = await super.sanitizeOutput(entity, ctx);

        return super.transformResponse(sanitizedEntity);
      } catch (error) {
        console.error("Home find error:", error);
        return ctx.internalServerError("Failed to load home data");
      }
    },
    async findOne(ctx) {
      try {
        const { slug, key } = ctx.params;
        const entity = await strapi.db.query("api::faculty.faculty").findOne({
          populate: {
            Faculty: {
              on: {
                "faculty.photography": { populate: { Card: { populate: ["Image", "ViewCard.Image"] } } },
                "faculty.filmmaking": { populate: { Card: { populate: ["Image", "ViewCard.Image"] } } },
                "faculty.visiting": { populate: { Card: { populate: ["Image", "ViewCard.Image"] } } },
              },
            },
          },
        });

        if (!entity) return ctx.notFound("Faculty content not found");

        const modules = {
          photography: "faculty.photography",
          filmmaking: "faculty.filmmaking",
          visiting: "faculty.visiting",
        };

        if (!modules[key]) return ctx.notFound("Faculty component not found");

        const component = entity.Faculty.find(
          (item) => item.__component === modules[key]
        );

        if (!component) return ctx.notFound("Faculty block missing");

        const allCards = component.Card || [];

        // Find the slug card and its position
        const slugCardIndex = allCards.findIndex(card => card.Slug === slug);

        if (slugCardIndex === -1) return ctx.notFound("Faculty member with this slug not found");

        const slugCard = allCards[slugCardIndex];

        // Find next and previous slugs (circular navigation)
        let nextSlug = null;
        let previousSlug = null;

        if (slugCardIndex < allCards.length - 1) {
          // Not the last card, get next card
          nextSlug = allCards[slugCardIndex + 1]?.Slug || null;
        } else {
          // Last card, loop to first card
          nextSlug = allCards[0]?.Slug || null;
        }

        if (slugCardIndex > 0) {
          // Not the first card, get previous card
          previousSlug = allCards[slugCardIndex - 1]?.Slug || null;
        } else {
          // First card, loop to last card
          previousSlug = allCards[allCards.length - 1]?.Slug || null;
        }

        // Return only the current card
        component.Card = [slugCard];

        const totalCards = allCards.length;
        const currentPosition = slugCardIndex + 1;

        const sanitizedEntity = await super.sanitizeOutput(component);

        sanitizedEntity.pagination = {
          totalCards,
          currentPosition,
          nextSlug,
          previousSlug,
        };

        return { data: sanitizedEntity };

      } catch (error) {
        console.error("Faculty findOne error:", error);
        return ctx.internalServerError("Failed to load faculty data");
      }
    },

    async founderBySlug(ctx) {
      try {
        const { slug } = ctx.params;
        const entity = await strapi.db.query("api::faculty.faculty").findOne({
          populate: {
            Faculty: {
              on: {
                "about.founder": {
                  populate: {
                    Founder_card: {
                      populate: {
                        Image: {
                          select: ["id", "name", "url"],
                        },
                        ViewCard: {
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
            },
          },
        });

        if (!entity) {
          return ctx.notFound("Founder data not found");
        }

        // Get founder block from Faculty array
        const founderBlock = entity.Faculty?.find(
          (block) => block.__component === "about.founder"
        );

        if (!founderBlock) {
          return ctx.notFound("Founder section not found");
        }

        // Cards array
        const cards = founderBlock.Founder_card || [];

        // Find the matched card by slug
        const matchedCard = cards.find((c) => c.Slug === slug);

        if (!matchedCard) {
          return ctx.notFound("Founder with this slug not found");
        }

        // Return only the matched card
        founderBlock.Founder_card = [matchedCard];

        const sanitizedEntity = await super.sanitizeOutput(founderBlock, ctx);

        return super.transformResponse(sanitizedEntity);
      } catch (error) {
        console.error("founderBySlug error:", error);
        return ctx.internalServerError("Failed to load founder data");
      }
    },

  })
);
