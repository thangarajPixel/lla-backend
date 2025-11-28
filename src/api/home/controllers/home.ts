import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::home.home",
  ({ strapi }) => ({
    async find(ctx) {
      try {
        // Read query params for pagination
        const page = parseInt(String(ctx.query.page)) || 1;
        const pageSize = parseInt(String(ctx.query.pageSize)) || 10;

        // 1) Fetch the Home single type (WITHOUT course.cards)
        const entity = await strapi.db.query("api::home.home").findOne({
          populate: {
            Home: {
              on: {
                "home.banner": {
                  populate: {
                    Video: { select: ["id", "name", "url"] },
                  },
                },
                "home.course": {
                  populate: {}, // ❗ Cards removed from population (we fetch manually)
                },
                "home.campus": {
                  populate: {
                    Bg_img: { select: ["id", "name", "url"] },
                  },
                },
                "home.faculty": {
                  populate: {
                    Card: {
                      populate: {
                        Image: { select: ["id", "name", "url"] },
                      },
                    },
                  },
                },
                "home.life": {
                  populate: {
                    Bg_img: { select: ["id", "name", "url"] },
                    Card: {
                      populate: {
                        Image: { select: ["id", "name", "url"] },
                      },
                    },
                  },
                },
                "home.testimonial": {
                  populate: {
                    Card: {
                      populate: {
                        Image: { select: ["id", "name", "url"] },
                      },
                    },
                  },
                },
                "home.lla-testimonials": {
                  populate: {
                    Slider: { populate: { "*": true } },
                  },
                },
                "home.gallery": {
                  populate: {
                    Image: { select: ["id", "name", "url"] },
                  },
                },
                "home.about": {
                  populate: {
                    Image: { select: ["id", "name", "url"] },
                  },
                },
                "home.sponsor": {
                  populate: {
                    Image: { select: ["id", "name", "url"] },
                  },
                },
              },
            },
          },
        });

        if (!entity) return ctx.notFound("Home content not found");

        // -------------------------------
        // 2) PAGINATION FOR COURSE → CARDS
        // -------------------------------

        const courseSection = entity.Home?.course;
        let paginatedCards = [];

        if (courseSection && courseSection.id) {
          // Fetch paginated cards
          paginatedCards = await strapi.db
            .query("api::card.card")
            .findMany({
              where: { course: courseSection.id },
              offset: (page - 1) * pageSize,
              limit: pageSize,
              populate: {
                Image: {
                  select: ["id", "name", "url"],
                },
              },
            });

          const totalCards = await strapi.db
            .query("api::card.card")
            .count({
              where: { course: courseSection.id },
            });

          // Attach pagination details
          courseSection.paginatedCards = {
            data: paginatedCards,
            pagination: {
              page,
              pageSize,
              pageCount: Math.ceil(totalCards / pageSize),
              total: totalCards,
            },
          };
        }

        // Sanitize response
        const sanitized = await this.sanitizeOutput(entity, ctx);
        return this.transformResponse(sanitized);

      } catch (error) {
        console.error("Home find error:", error);
        return ctx.internalServerError("Failed to load home data");
      }
    },
  })
);
