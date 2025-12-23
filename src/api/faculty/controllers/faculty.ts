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
        const page = parseInt(String(ctx.query.page)) || 1;
        const pageSize = parseInt(String(ctx.query.per_page)) || 1;

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

        // 🔑 Slug card
        const slugCard = allCards.find(card => card.Slug === slug);

        // 🔑 Remaining cards (slug removed)
        const remainingCards = allCards.filter(card => card.Slug !== slug);

        let paginatedCards = [];

        if (page === 1 && slugCard) {
          paginatedCards = [
            slugCard,
            ...remainingCards.slice(0, pageSize - 1),
          ];
        } else {
          const start = (page - 1) * pageSize - 1;
          paginatedCards = remainingCards.slice(start, start + pageSize);
        }

        component.Card = paginatedCards;

        const totalCards = allCards.length;
        const totalPages = Math.ceil(totalCards / pageSize);

        const sanitizedEntity = await super.sanitizeOutput(component);

        sanitizedEntity.pagination = {
          page,
          pageSize,
          totalCards,
          totalPages,
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
