/**
 * essential controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::essential.essential',
    {
        async find(ctx) {
            console.log('Essential find called');
            
            // Try to find published record first
            let entity = await strapi.db
                .query("api::essential.essential")
                .findOne({
                    where: {
                        publishedAt: { $notNull: true }
                    },
                    populate: {
                        admission_year: true,
                    },
                });
            
            // If no published record, get draft
            if (!entity) {
                console.log('No published record found, fetching draft');
                entity = await strapi.db
                    .query("api::essential.essential")
                    .findOne({
                        populate: {
                            admission_year: true,
                        },
                    });
            }
            
            console.log('Entity found:', JSON.stringify(entity, null, 2));
            
            if (!entity) {
                return this.transformResponse(null);
            }
            
            // Return entity directly without sanitization to preserve relations
            return this.transformResponse(entity);
        }
    }
);
