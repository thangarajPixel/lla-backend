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
        const search = ctx.query.search as string;

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

        // Apply search filter if search query is provided
        if (search && search.trim()) {
          const searchTerm = search.trim().toLowerCase();
          cards = cards.filter((card: any) => {
            const title = card.Title?.toLowerCase() || '';
            const description = card.Description?.toLowerCase() || '';
            
            return title.includes(searchTerm) || description.includes(searchTerm);
          });
        }

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
          search: search || null,
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
        const card = entity.Blog.BlogCard.find((c) => c.Slug === String(slug));
        if (!card) {
          return ctx.notFound(`Blog card with slug ${slug} not found`);
        }
         const latestCards = [...entity.Blog.BlogCard]
          .sort((a, b) => {
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
        console.error("Blog findCard error:", error);
        return ctx.internalServerError("Failed to load blog card data");
      }
    },

  })
);
