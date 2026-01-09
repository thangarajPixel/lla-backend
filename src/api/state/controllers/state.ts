/**
 * state controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::state.state', ({ strapi }) => ({
  async find(ctx) {
    // Add sort parameter to query
    ctx.query = {
      ...ctx.query,
      sort: 'name:asc',
    };
    
    const { data } = await super.find(ctx);
    const modifiedData = data.map((state) => ({
      id: state.id,
      documentId: state.documentId,
      name: state.name,
    }));
    return { data: modifiedData };
  },
}));
