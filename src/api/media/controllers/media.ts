/**
 * media controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::media.media",
  ({ strapi }) => ({
    async find(ctx) {
      try {
        const page = parseInt(String(ctx.query.page)) || 1;
        const pageSize = parseInt(String(ctx.query.per_page)) || 10;
        const search = ctx.query.search as string;

        const entity = await strapi.db.query("api::media.media").findOne({
          populate: {
            Media: {
              populate: {
                MediaCard: {
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
          return ctx.notFound("Media content not found");
        }

        let cards = entity.Media.MediaCard || [];

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
        entity.Media.MediaCard = cards.slice(start, end);

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
        console.error("Media find error:", error);
        return ctx.internalServerError("Failed to load media data");
      }
    },

    async findCard(ctx) {
      try {
        const { slug } = ctx.params;

        if (!slug) {
          return ctx.badRequest("Media card slug is required");
        }

        // Fetch full media entity including cards
        const entity = await strapi.db.query("api::media.media").findOne({
          populate: {
            Media: {
              populate: {
                MediaCard: {
                  populate: {
                    Image: {
                      select: ["id", "name", "url"],
                    },
                    ViewCard: {
                      populate: {
                        Image: {
                          select: ["id", "name", "url"],
                        }
                      }
                    },
                    SeoViewCard: true,
                  },
                },
              },
            },
          },
        });

        if (!entity || !entity.Media || !entity.Media.MediaCard) {
          return ctx.notFound("Media content not found");
        }
        const card = entity.Media.MediaCard.find((c) => c.Slug === String(slug));
        if (!card) {
          return ctx.notFound(`Media card with slug ${slug} not found`);
        }
         const latestCards = [...entity.Media.MediaCard]
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
        console.error("Media findCard error:", error);
        return ctx.internalServerError("Failed to load media card data");
      }
    },

    async updateCards(ctx) {
      try {
        const { cards } = ctx.request.body;
        if (!cards || !Array.isArray(cards)) {
          return ctx.badRequest("Cards array is required");
        }

        const entity = await strapi.db
          .query("api::media.media")
          .findOne({
            populate: {
              Media: {
                populate: {
                  MediaCard: {
                    populate: {
                      SeoViewCard: true,
                      ViewCard: true,
                    },
                  },
                },
              },
            },
          });

        if (!entity || !entity.Media || !entity.Media.MediaCard) {
          return ctx.notFound("Media content not found");
        }

        // Track updated slugs
        const updatedSlugs = [];
        const notFoundSlugs = [];

        const updatedMediaCards = entity.Media.MediaCard.map((mediaCard) => {
          const updateData = cards.find((card) => card.slug === mediaCard.Slug);
          if (updateData) {
            updatedSlugs.push(updateData.slug);
            return {
              ...mediaCard,
              SeoViewCard: {
                Title: updateData.title,
                Description: updateData.description,
                Slug: updateData.slug,
                KeyWords: mediaCard.SeoViewCard?.KeyWords || null,
              },
              ViewCard: mediaCard.ViewCard,
            };
          }
          return mediaCard;
        });

        // Find slugs that were not found in existing cards
        cards.forEach((card) => {
          const found = entity.Media.MediaCard.some((mediaCard) => mediaCard.Slug === card.slug);
          if (!found) {
            notFoundSlugs.push(card.slug);
          }
        });

        await strapi.entityService.update("api::media.media", entity.id, {
          data: {
            Media: {
              ...entity.Media,
              MediaCard: updatedMediaCards,
            },
            publishedAt: new Date(),
          },
        });

        return {
          data: {
            message: "Media cards updated and published successfully",
            updatedCount: updatedSlugs.length,
            totalRequestedCount: cards.length,
            updatedSlugs: updatedSlugs,
            notFoundSlugs: notFoundSlugs,
            published: true,
          },
        };
      } catch (error) {
        console.error("Media updateCards error:", error);
        return ctx.internalServerError("Failed to update media cards");
      }
    },

  })
);
