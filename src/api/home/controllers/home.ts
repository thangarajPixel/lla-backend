import { factories } from "@strapi/strapi";
import { addBaseUrlToMediaUrls } from "../../../helper";

export default factories.createCoreController(
  "api::home.home",
  ({ strapi }) => ({
    async find(ctx) {
      try {
        const entity = await strapi.db.query("api::home.home").findOne({
          populate: {
            Home: {
              on: {
                "home.banner": {
                  populate: {
                    Video: {
                      select: ["id", "name", "url"],
                    },
                  },
                },
                "home.course": {
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
                "home.campus": {
                  populate: {
                    Bg_img: {
                      select: ["id", "name", "url"],
                    },
                  },
                },
                "home.faculty": {
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
                "home.life": {
                  populate: {
                    Bg_img: {
                      select: ["id", "name", "url"],
                    },
                    Card: {
                      populate: {
                        Image: {
                          select: ["id", "name", "url"],
                        },
                      },
                    },
                  },
                },
                "home.testimonial": {
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
                "home.lla-testimonials": {
                  populate: {
                    Slider: {
                      populate: { "*": true },
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
                "home.about": {
                  populate: {
                    Image: {
                      select: ["id", "name", "url"],
                    },
                  },
                },
                "home.sponsor": {
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
          return ctx.notFound("Home content not found");
        }

        // Add base URL to media URLs
        // addBaseUrlToMediaUrls(entity);

        const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
        return this.transformResponse(sanitizedEntity);
      } catch (error) {
        console.error("Home find error:", error);
        return ctx.internalServerError("Failed to load home data");
      }
    },

    async findCards(ctx) {
      try {
        const { query } = ctx;
        const page = parseInt(String(query.page)) || 1;
        const pageSize = parseInt(String(query.pageSize)) || 4;

        const entity = await strapi.db.query("api::home.home").findOne({
          populate: {
            Home: {
              on: {
                 "home.course": {
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

        if (!entity) return ctx.notFound("Home content not found");

        const course = entity.Home.find((c) => c.__component === "home.course");
        if (course && course.Card) {
          const allCards = course.Card;
          const paginatedCards = allCards.slice(
            (page - 1) * pageSize,
            page * pageSize
          );

          return ctx.send({
            data: paginatedCards,
            pagination: { total: allCards.length, page, pageSize },
          });
        }

        return ctx.send({ data: [], pagination: { total: 0, page, pageSize } });
      } catch (error) {
        console.error("Find Cards error:", error);
        return ctx.internalServerError("Failed to load paginated cards");
      }
    },
  })
);
