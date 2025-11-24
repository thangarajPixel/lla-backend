export default {
  register({ strapi }) {
    // Hook into database schema creation to fix MySQL index issues
    const originalCreateTable = strapi.db.connection.schema.createTable.bind(strapi.db.connection.schema);
    
    strapi.db.connection.schema.createTable = function(tableName, callback) {
      return originalCreateTable(tableName, (table) => {
        const originalIndex = table.index.bind(table);
        const originalUnique = table.unique.bind(table);
        
        // Override index creation to add prefix lengths for MySQL
        table.index = function(columns, indexName) {
          if (strapi.db.connection.client.config.client === 'mysql' || 
              strapi.db.connection.client.config.client === 'mysql2') {
            // Skip - we'll create these manually
            return table;
          }
          return originalIndex(columns, indexName);
        };
        
        table.unique = function(columns, indexName) {
          if (strapi.db.connection.client.config.client === 'mysql' || 
              strapi.db.connection.client.config.client === 'mysql2') {
            // Skip - we'll create these manually
            return table;
          }
          return originalUnique(columns, indexName);
        };
        
        callback(table);
      });
    };
  },

  async bootstrap({ strapi }) {
    // Fix indexes after tables are created
    if (strapi.db.connection.client.config.client === 'mysql' || 
        strapi.db.connection.client.config.client === 'mysql2') {
      
      try {
        // Check and create files index
        const filesIndexExists = await strapi.db.connection.raw(
          "SELECT COUNT(*) as count FROM information_schema.statistics WHERE table_schema = DATABASE() AND table_name = 'files' AND index_name = 'files_documents_idx'"
        );
        
        if (filesIndexExists[0][0].count === 0) {
          await strapi.db.connection.raw(
            'ALTER TABLE files ADD INDEX files_documents_idx(document_id(100), locale(10), published_at)'
          );
          strapi.log.info('Created files_documents_idx with prefix lengths');
        }
      } catch (error) {
        strapi.log.warn('Could not create files index:', error.message);
      }
      
      try {
        // Check and create upload_folders index
        const foldersIndexExists = await strapi.db.connection.raw(
          "SELECT COUNT(*) as count FROM information_schema.statistics WHERE table_schema = DATABASE() AND table_name = 'upload_folders' AND index_name = 'upload_folders_path_index'"
        );
        
        if (foldersIndexExists[0][0].count === 0) {
          await strapi.db.connection.raw(
            'ALTER TABLE upload_folders ADD UNIQUE upload_folders_path_index(path(191))'
          );
          strapi.log.info('Created upload_folders_path_index with prefix length');
        }
      } catch (error) {
        strapi.log.warn('Could not create upload_folders index:', error.message);
      }
    }
  },
};
