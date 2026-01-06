/**
 * life-at-lla controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::life-at-lla.life-at-lla",
  ({ strapi }) => ({
    async find(ctx) {
      try {
        const page = parseInt(String(ctx.query.page)) || 1;
        const perPage = parseInt(String(ctx.query.per_page)) || 10;

        const entity = await strapi.db
          .query("api::life-at-lla.life-at-lla")
          .findOne({
            populate: {
              LifeCard: {
                populate: {
                  Image: {
                    select: ["id", "name", "url"],
                  },
                   SeoViewCard:true,
                  LifeViewCard: {
                    populate: {
                      Images: {
                        select: ["id", "name", "url"],
                      },
                    },
                  },
                },
              },
            },
          });

        if (!entity) {
          return ctx.notFound("Life content not found");
        }

        const totalCards = entity.LifeCard ? entity.LifeCard.length : 0;
        const start = (page - 1) * perPage;
        const end = start + perPage;
        const paginatedCards = entity.LifeCard.slice(start, end);

        // original card data with paginated data
        entity.LifeCard = paginatedCards;

        // Add base URL to media URLs
        // addBaseUrlToMediaUrls(entity);

        const sanitizedEntity = await super.sanitizeOutput(entity);

        sanitizedEntity.pagination = {
          page,
          perPage,
          total: totalCards,
          totalPages: Math.ceil(totalCards / perPage),
        };

        return {
          data: sanitizedEntity,
        };
      } catch (error) {
        console.error("Life find error:", error);
        return ctx.internalServerError("Failed to load life data");
      }
    },

    async findCard(ctx) {
      try {
        const { slug } = ctx.params;

        if (!slug) {
          return ctx.badRequest("Card slug is required");
        }

        // Fetch full life entity including cards
        const entity = await strapi.db
          .query("api::life-at-lla.life-at-lla")
          .findOne({
            populate: {
              LifeCard: {
                populate: {
                  Image: {
                    select: ["id", "name", "url"],
                  },
                  SeoViewCard:true,
                  LifeViewCard: {
                    populate: {
                      Images: {
                        select: ["id", "name", "url"],
                      },
                    },
                  },
                },
              },
            },
          });

        if (!entity || !entity.LifeCard) {
          return ctx.notFound("Life content not found");
        }

        // Find requested card
        const card = entity.LifeCard.find((c) => c.Slug === String(slug));
        if (!card) {
          return ctx.notFound(`Card with slug ${slug} not found`);
        }

        // Latest 3 Cards
        const randomCards = [...entity.LifeCard]
          .filter((c) => c.id !== card.id)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);

        return {
          data: {
            card,
            latest: randomCards,
          },
        };
      } catch (error) {
        console.error("Life findCard error:", error);
        return ctx.internalServerError("Failed to load card data");
      }
    },
  })
);
