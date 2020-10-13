import EditTaxonomy from './ControlPanel/EditTaxonomy';
import Taxonomies from './ControlPanel/Taxonomies';

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

  return config;
};

export default applyConfig;
