/**
 * course controller
 */

import { factories } from "@strapi/strapi";
import { addBaseUrlToMediaUrls } from "../../../helper";

export default factories.createCoreController(
  "api::course.course",
  ({ strapi }) => ({
    async find(ctx) {
      try {
        const entity = await strapi.db.query("api::course.course").findOne({
          populate: {
            Course: {
              on: {
                "course.dip-professional": {
                  populate: {
                    Menu: {
                      populate: {
                        Image: true,
                      },
                    },
                    Overview: {
                      populate: {
                        Card: {
                          populate: {
                            Image: true,
                          },
                        },
                      },
                    },
                    Course_content: {
                      populate: {
                        Content_card: {
                          populate: {
                            Image: true,
                          },
                        },
                      },
                    },
                    Other_Info: {
                      populate: {
                        Info: {
                          populate: { "*": true },
                        },
                      },
                    },
                    Student_testimonial: {
                      populate: {
                        Card: {
                          populate: {
                            Image: true,
                          },
                        },
                      },
                    },
                    Testimonial: {
                      populate: {
                        Slider: {
                          populate: {
                            "*": true,
                          },
                        },
                      },
                    },
                    HowToApply: {
                      populate: {
                        Card: {
                          populate: {
                            Icon: true,
                          },
                        },
                      },
                    },
                    Faq: {
                      populate: {
                        QA: {
                          populate: {
                            "*": true,
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
          return ctx.notFound("About content not found");
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
  })
);
