import ViewField from './fields/ViewField';
import ActionField from './fields/ActionField';

export default {
  bootstrap(app: any) {
    console.log('Content Manager extension loaded');

    // Register custom fields
    app.customFields.register({
      name: 'view-button',
      pluginId: 'content-manager',
      type: 'string',
      intlLabel: {
        id: 'view-button.label',
        defaultMessage: 'View',
      },
      intlDescription: {
        id: 'view-button.description',
        defaultMessage: 'View button for external link',
      },
      components: {
        Input: ViewField,
      },
    });

    app.customFields.register({
      name: 'action-button',
      pluginId: 'content-manager',
      type: 'string',
      intlLabel: {
        id: 'action-button.label',
        defaultMessage: 'Action',
      },
      intlDescription: {
        id: 'action-button.description',
        defaultMessage: 'Action button with popup',
      },
      components: {
        Input: ActionField,
      },
    });

    console.log('Custom fields registered');
  },
};
