import { GET_TAXONOMY, UPDATE_TAXONOMY, GET_TAXONOMYSCHEMA } from './constants';
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

export function getTaxonomySchema(url) {
  return {
    url,
    type: GET_TAXONOMYSCHEMA,
    request: {
      op: 'get',
      path: url,
      headers: { Accept: 'application/json' },
    },
  };
}
