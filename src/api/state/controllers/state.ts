/**
 * state controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::state.state', ({ strapi }) => ({
  async find(ctx) {
    // Add sort parameter and remove pagination limit to get all states
    ctx.query = {
      ...ctx.query,
      sort: 'name:asc',
      pagination: {
        pageSize: 100, // Set a high limit to get all states
        page: 1,
      },
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
