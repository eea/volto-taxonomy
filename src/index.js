import EditTaxonomy from './ControlPanel/EditTaxonomy';
import Taxonomies from './ControlPanel/Taxonomies';
import { taxonomy } from './reducers';

const applyConfig = (config) => {
  config.addonRoutes = [
    {
      path: '/collective-taxonomy/:id',
      component: EditTaxonomy,
    },
    {
      path: '/collective-taxonomy',
      component: Taxonomies,
    },
    ...(config.addonRoutes || []),
  ];

  config.settings.nonContentRoutes = [
    ...config.settings.nonContentRoutes,
    /\/collective-taxonomy$/,
    /\/collective-taxonomy\/.*$/,
  ];

  config.addonReducers = {
    ...config.addonReducers,
    taxonomy,
  };

  return config;
};

export default applyConfig;
