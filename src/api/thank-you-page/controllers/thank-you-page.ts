import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::thank-you-page.thank-you-page', ({ strapi }) => ({

    async find(ctx) {
        try {
            const entity = await strapi.db
                .query('api::thank-you-page.thank-you-page')
                .findMany({
                    where: {
                        publishedAt: {
                            $notNull: true, // 👈 only published data
                        },
                    },
                });

            if (!entity || entity.length === 0)
                return ctx.notFound('No published Thank You Pages found');

            const sanitizedEntity = await super.sanitizeOutput(entity, ctx);
            return { data: sanitizedEntity };

        } catch (err) {
            console.error('Thank You Page find error:', err);
            return ctx.internalServerError('Failed to load Thank You Page data');
        }
    }
}));
