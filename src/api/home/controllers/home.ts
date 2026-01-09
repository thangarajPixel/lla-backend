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
                        course_list: {
                          populate: { "*": true },
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
                    Vertical_Image: {
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

        entity.Home?.forEach((component: any) => {
          if (
            component.__component === "home.course" &&
            component.Card?.length
          ) {
            component.Card = component.Card.map((card: any) => {
              if (card.course_list) {
                card.Slug = card.course_list.Slug;
                delete card.course_list;
              }
              return card;
            });
          }
        });

        // Add base URL to media URLs
        // addBaseUrlToMediaUrls(entity);

        const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
        return this.transformResponse(sanitizedEntity);
      } catch (error) {
        console.error("Home find error:", error);
        return ctx.internalServerError("Failed to load home data");
      }
    },

    async findCourse(ctx) {
      try {
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
                        Vertical_Image: {
                          select: ["id", "name", "url"],
                        },
                         course_list: {
                          populate: { "*": true },
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
          return ctx.notFound("Home content not found");
        }

          entity.Home?.forEach((component: any) => {
          if (
            component.__component === "home.course" &&
            component.Card?.length
          ) {
            component.Card = component.Card.map((card: any) => {
              if (card.course_list) {
                card.Slug = card.course_list.Slug;
                
              }
              return card;
            });
          }
        });

        // Find the "course" component from Home array
        const courseComponent = entity.Home?.find(
          (component: any) => component.__component === "home.course"
        );

        if (!courseComponent || !courseComponent.Card) {
          return ctx.send({ data: [] });
        }

        // Return only the Card array
        return ctx.send({
          data: courseComponent.Card,
        });
      } catch (error) {
        console.error("Find Course error:", error);
        return ctx.internalServerError("Failed to load courses");
      }
    },
  })
);
