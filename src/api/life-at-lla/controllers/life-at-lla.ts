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

        // Latest 3 Cards based on CreatedDate
        const latestCards = [...entity.LifeCard]
          .sort((a, b) => {
            // Sort by CreatedDate in descending order (latest first)
            const dateA = a.CreatedDate ? new Date(a.CreatedDate).getTime() : 0;
            const dateB = b.CreatedDate ? new Date(b.CreatedDate).getTime() : 0;
            return dateB - dateA;
          })
          .slice(0, 3);

        return {
          data: {
            card,
            latest: latestCards,
          },
        };
      } catch (error) {
        console.error("Life findCard error:", error);
        return ctx.internalServerError("Failed to load card data");
      }
    },
    async updateCards(ctx) {
      try {
        const { cards } = ctx.request.body;
        if (!cards || !Array.isArray(cards)) {
          return ctx.badRequest("Cards array is required");
        }
        const entity = await strapi.db
          .query("api::life-at-lla.life-at-lla")
          .findOne({
            populate: {
              LifeCard: {
                populate: {
                  SeoViewCard: true,
                  LifeViewCard: true,
                },
              },
            },
          });

        if (!entity || !entity.LifeCard) {
          return ctx.notFound("Life content not found");
        }

        // Track updated slugs
        const updatedSlugs = [];
        const notFoundSlugs = [];

        const updatedCards = entity.LifeCard.map((lifeCard) => {
          const updateData = cards.find((card) => card.slug === lifeCard.Slug);
          if (updateData) {
            updatedSlugs.push(updateData.slug);
            return {
              ...lifeCard,
              SeoViewCard: {
                Title: updateData.title,
                Description: updateData.description,
                KeyWords: lifeCard.SeoViewCard?.KeyWords || null,
              },
              LifeViewCard: lifeCard.LifeViewCard,
            };
          }
          return lifeCard;
        });

        // Find slugs that were not found in existing cards
        cards.forEach((card) => {
          const found = entity.LifeCard.some((lifeCard) => lifeCard.Slug === card.slug);
          if (!found) {
            notFoundSlugs.push(card.slug);
          }
        });

        await strapi.entityService.update("api::life-at-lla.life-at-lla", entity.id, {
          data: {
            LifeCard: updatedCards,
            publishedAt: new Date(),
          },
        });

        return {
          data: {
            message: "Cards updated and published successfully",
            updatedCount: updatedSlugs.length,
            totalRequestedCount: cards.length,
            updatedSlugs: updatedSlugs,
            notFoundSlugs: notFoundSlugs,
            published: true,
          },
        };
      } catch (error) {
        console.error("Life updateCards error:", error);
        return ctx.internalServerError("Failed to update cards");
      }
    },
  })
);
