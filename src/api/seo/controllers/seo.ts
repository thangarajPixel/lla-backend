/**
 * seo controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::seo.seo',
     ({ strapi }) => ({
    async find(ctx) {
      try {
        const entity = await strapi.db.query("api::seo.seo").findOne({
          populate: {
            SeoCard: true,
          },
        });

        if (!entity) {
          return ctx.notFound("Seo content not found");
        }

        const sanitizedEntity = await super.sanitizeOutput(entity, ctx);

        return super.transformResponse(sanitizedEntity);
      } catch (error) {
        return ctx.internalServerError("Failed to load seo data");
      }
    },
  })
);
