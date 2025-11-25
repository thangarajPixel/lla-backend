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
        addBaseUrlToMediaUrls(entity);

        const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
        return this.transformResponse(sanitizedEntity);
      } catch (error) {
        console.error("Home find error:", error);
        return ctx.internalServerError("Failed to load home data");
      }
    },
  })
);
