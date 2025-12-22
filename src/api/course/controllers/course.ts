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
                        Image: {
                          select: ["id", "name", "url"],
                        },
                      },
                    },
                    Overview: {
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
                    Course_content: {
                      populate: {
                        Content_card: {
                          populate: {
                            Image: {
                              select: ["id", "name", "url"],
                            },
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
                            Image: {
                              select: ["id", "name", "url"],
                            },
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
                    course_list: {
                      populate: {
                        "*": true,
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

        entity.Course?.forEach((component: any) => {
          if (
            component.__component === "course.dip-professional" &&
            component.course_list
          ) {
            component.Slug = component.course_list.Slug;
            delete component.course_list;
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

    async findBySlug(ctx) {
      try {
        const { slug } = ctx.params;

        if (!slug) {
          return ctx.badRequest("Slug parameter is required");
        }

        const entity = await strapi.db.query("api::course.course").findOne({
          populate: {
            Course: {
              on: {
                "course.dip-professional": {
                  populate: {
                    Menu: {
                      populate: {
                        Image: {
                          select: ["id", "name", "url"],
                        },
                      },
                    },
                    Overview: {
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
                    Course_content: {
                      populate: {
                        Content_card: {
                          populate: {
                            Image: {
                              select: ["id", "name", "url"],
                            },
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
                            Image: {
                              select: ["id", "name", "url"],
                            },
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
                    course_list: {
                      populate: {
                        "*": true,
                      },
                    },
                    SeoViewCard: {
                      populate:true,
                     }
                  },
                },
              },
            },
          },
        });

        if (!entity) {
          return ctx.notFound("Course not found");
        }

        entity.Course?.forEach((component: any) => {
          if (
            component.__component === "course.dip-professional" &&
            component.course_list
          ) {
            component.Slug = component.course_list.Slug;
            delete component.course_list;
          }
        });

        const courseComponent = entity.Course?.find(
          (component: any) =>
            component.__component === "course.dip-professional" &&
            component.Slug === slug
        );

        const courselistall = await strapi.db
          .query("api::course-list.course-list")
          .findMany();

        const courseList = courselistall.find((course) => course.Slug === slug);

        if (!courseComponent) {
          return ctx.notFound(`Course with slug "${slug}" not found`);
        }

        const result = {
          ...courseComponent,
          courseList,
        };

        return ctx.send({
          data: result,
        });
      } catch (error) {
        console.error("Find course by slug error:", error);
        return ctx.internalServerError("Failed to load course data");
      }
    },
  })
);
