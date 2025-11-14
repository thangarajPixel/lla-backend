import { factories } from "@strapi/strapi";
import { posix } from "path";

function addBaseUrlToMediaUrls(obj) {
  const baseUrl = process.env.BASE_URL;

  if (Array.isArray(obj)) {
    return obj.map(addBaseUrlToMediaUrls);
  } else if (obj && typeof obj === "object") {
    for (const key in obj) {
      if (!obj.hasOwnProperty(key)) continue;

      const value = obj[key];

      if (
        key === "url" &&
        typeof value === "string" &&
        !value.startsWith("http")
      ) {
        obj[key] = `${baseUrl}${value}`;
      } else if (typeof value === "object" && value !== null) {
        addBaseUrlToMediaUrls(value);
      }
    }
  }

  return obj;
}

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
                    Video: true,
                  },
                },
                "home.course": {
                  populate: {
                    card: {
                      populate: {
                        Img: true,
                      },
                    },
                  },
                },
                "home.campus": {
                  populate: {
                    Bg_img: true,
                  },
                },
                "home.faculty": {
                  populate: {
                    card: {
                      populate: {
                        Img: true,
                      },
                    },
                  },
                },
                "home.life": {
                  populate: {
                    card: {
                      populate: {
                        Img: true,
                      },
                    },
                  },
                },
                "home.testimonial": {
                  populate: {
                    card: {
                      populate: {
                        Img: true,
                      },
                    },
                  },
                },
                "home.lla-testimonials": {
                  populate: {
                    slider: {
                      populate: { "*": true },
                    },
                  },
                },
                "home.gallery": {
                  populate: {
                    Img: true,
                  },
                },
                "home.about": {
                  populate: {
                    Img: true,
                  },
                },
                "home.sponsor": {
                  populate: {
                    Img: true,
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
