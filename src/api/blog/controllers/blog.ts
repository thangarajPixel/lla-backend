/**
 * blog controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::blog.blog",
  ({ strapi }) => ({
    async find(ctx) {
      try {
        const page = parseInt(String(ctx.query.page)) || 1;
        const pageSize = parseInt(String(ctx.query.per_page)) || 10;

        const entity = await strapi.db.query("api::blog.blog").findOne({
          populate: {
            Blog: {
              populate: {
                BlogCard: {
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
          return ctx.notFound("Blog content not found");
        }

        let cards = entity.Blog.BlogCard || [];

        const totalCards = cards.length;
        const start = (page - 1) * pageSize;
        const end = start + pageSize;

        // Apply pagination on filtered cards
        entity.Blog.BlogCard = cards.slice(start, end);

        const sanitizedEntity = await super.sanitizeOutput(entity);

        sanitizedEntity.pagination = {
          page,
          pageSize,
          total: totalCards,
          totalPages: Math.ceil(totalCards / pageSize),
        };

        // Add base URL to media URLs
        // addBaseUrlToMediaUrls(entity);

        return { data: sanitizedEntity };

      } catch (error) {
        console.error("Blog find error:", error);
        return ctx.internalServerError("Failed to load blog data");
      }
    },

    async findCard(ctx) {
      try {
        const { slug } = ctx.params;

        if (!slug) {
          return ctx.badRequest("Blog card slug is required");
        }

        // Fetch full blog entity including cards
        const entity = await strapi.db.query("api::blog.blog").findOne({
          populate: {
            Blog: {
              populate: {
                BlogCard: {
                  populate: {
                    Image: {
                      select: ["id", "name", "url"],
                    },
                    ViewCard : {
                      populate: {
                        Image: {
                          select: ["id", "name", "url"],
                        }
                      }
                    },
                  },
                },
              },
            },
          },
        });

        if (!entity || !entity.Blog || !entity.Blog.BlogCard) {
          return ctx.notFound("Blog content not found");
        }

        // Find requested card by slug
        const card = entity.Blog.BlogCard.find((c) => c.Slug === String(slug));
        if (!card) {
          return ctx.notFound(`Blog card with slug ${slug} not found`);
        }

        // Get latest 3 blog cards (excluding current card)
        const latestCards = [...entity.Blog.BlogCard]
          .filter((c) => c.Slug !== String(slug)) // Exclude current card
          .sort((a, b) => b.id - a.id)
          .slice(0, 3);

        return {
          data: {
            card,
            latest: latestCards,
          },
        };

      } catch (error) {
        console.error("Blog findCard error:", error);
        return ctx.internalServerError("Failed to load blog card data");
      }
    },

  })
);
