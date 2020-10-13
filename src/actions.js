import { GET_TAXONOMY, UPDATE_TAXONOMY } from './constants';
import { nestContent } from '@plone/volto/helpers';

export function updateTaxonomy(url, content) {
  return {
    url,
    type: UPDATE_TAXONOMY,
    request: { op: 'patch', path: url, data: nestContent(content) },
  };
}

export function getTaxonomy(url) {
  return {
    url,
    type: GET_TAXONOMY,
    request: { op: 'get', path: url },
  };
}
