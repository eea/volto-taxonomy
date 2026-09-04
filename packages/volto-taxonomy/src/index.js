import EditTaxonomy from './ControlPanel/EditTaxonomy';
import Taxonomies from './ControlPanel/Taxonomies';
import { taxonomy } from './reducers';

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

  const languages = [
    { name: 'Български', code: 'bg' },
    { name: 'čeština', code: 'cs' },
    { name: 'Hrvatski', code: 'hr' },
    { name: 'dansk', code: 'da' },
    { name: 'Nederlands', code: 'nl' },
    { name: 'ελληνικά', code: 'el' },
    { name: 'English', code: 'en' },
    { name: 'eesti', code: 'et' },
    { name: 'Suomi', code: 'fi' },
    { name: 'Français', code: 'fr' },
    { name: 'Deutsch', code: 'de' },
    { name: 'magyar', code: 'hu' },
    { name: 'Íslenska', code: 'is' },
    { name: 'italiano', code: 'it' },
    { name: 'Latviešu', code: 'lv' },
    { name: 'lietuvių', code: 'lt' },
    { name: 'Malti', code: 'mt' },
    { name: 'Norsk', code: 'no' },
    { name: 'polski', code: 'pl' },
    { name: 'Português', code: 'pt' },
    { name: 'Română', code: 'ro' },
    { name: 'slovenčina', code: 'sk' },
    { name: 'Slovenščina', code: 'sl' },
    { name: 'Español', code: 'es' },
    { name: 'Svenska', code: 'sv' },
    { name: 'Türkçe', code: 'tr' },
  ];

  config.settings.languages = [
    ...(config.settings.languages || []),
    ...languages,
  ];

  return config;
};

export default applyConfig;
