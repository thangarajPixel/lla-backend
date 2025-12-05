
import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::footer.footer",
  ({ strapi }) => ({
    async find(ctx) {
      try {
        const entity = await strapi.db.query("api::footer.footer").findOne({
          populate: {
            Logo: {
              select: ["id", "name", "url"],
            },
            Icon: {
              select: ["id", "name", "url"],
            },
          },
        });
        const course = await strapi.db.query("api::course-list.course-list").findMany({
          where: {
            publishedAt: {
              $notNull: true,
            },
          },
        });

        if (!entity) {
          return ctx.notFound("About content not found");
        }
        entity.course =course;
        const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
        return this.transformResponse(sanitizedEntity);
      } catch (error) {
        console.error("Home find error:", error);
        return ctx.internalServerError("Failed to load home data");
      }
    },
  })
);

