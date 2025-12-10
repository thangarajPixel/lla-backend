/**
 * terms-and-condition controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::terms-and-condition.terms-and-condition',
    ({ strapi }) => ({
    async find(ctx) {
      try {
        const entity = await strapi.db.query("api::terms-and-condition.terms-and-condition").findOne({
          populate: {
            TermsAndConditionCard: { populate: true },
          },
        });
        if (!entity) {
          return ctx.notFound("Terms And Condition content not found");
        }
        return {
          data: entity
        };
      } catch (error) {
        console.error("Terms And Condition find error:", error);
        return ctx.internalServerError("Failed to load Terms And Condition data");
      }
    },
    })
);
