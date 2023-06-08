import EditTaxonomy from './ControlPanel/EditTaxonomy';
import Taxonomies from './ControlPanel/Taxonomies';
import { taxonomy } from './reducers';
import 'react-sortable-tree/style.css';

const applyConfig = (config) => {
  config.addonRoutes = [
    {
      path: '/controlpanel/taxonomies/:id',
      component: EditTaxonomy,
    },
    {
      path: '/controlpanel/taxonomies',
      component: Taxonomies,
    },
    ...(config.addonRoutes || []),
  ];

  config.addonReducers = {
    ...config.addonReducers,
    taxonomy,
  };

  return config;
};

export default applyConfig;
