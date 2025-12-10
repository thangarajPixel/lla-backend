
import { factories } from '@strapi/strapi';
export default factories.createCoreController('api::privacy-policy.privacy-policy',
   ({ strapi }) => ({
    async find(ctx) {
      try {
        const entity = await strapi.db.query("api::privacy-policy.privacy-policy").findOne({
          populate: {
            PrivacyPolicyCard: { populate: true },
          },
        });
        if (!entity) {
          return ctx.notFound("Privacy Policy content not found");
        }
        return {
          data: entity
        };
      } catch (error) {
        console.error("Privacy Policy find error:", error);
        return ctx.internalServerError("Failed to load privacy policy data");
      }
    },
    })
);
