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

        const sanitizedEntity = await super.sanitizeOutput(entity , ctx);

        return super.transformResponse(sanitizedEntity);
      } catch (error) {
        console.error("Home find error:", error);
        return ctx.internalServerError("Failed to load home data");
      }
    },
    async findOne(ctx) {
      try {
        const { slug } = ctx.params;
        const page = parseInt(String(ctx.query.page)) || 1;
        const pageSize = parseInt(String(ctx.query.per_page)) || 1;

        const entity = await strapi.db.query("api::faculty.faculty").findOne({
          populate: {
            Faculty: {
              on: {
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
              },
            },
          },
        });

        if (!entity) {
          return ctx.notFound("Faculty content not found");
        }

        const photographyComponent = entity.Faculty.find(
          (item) => item.__component === "faculty.photography"
        );

        let cards = photographyComponent?.Card || [];
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
        photographyComponent.Card = cards.slice(start, end);

        const sanitizedEntity = await super.sanitizeOutput(entity);

        sanitizedEntity.pagination = {
          page,
          pageSize,
          totalCards: totalCards,
          totalPages: totalPages,
        };

        return { data: sanitizedEntity };
      } catch (error) {
        console.error("Home find error:", error);
        return ctx.internalServerError("Failed to load home data");
      }
    },
  })
);
