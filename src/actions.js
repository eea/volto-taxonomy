import {
  GET_TAXONOMY,
  UPDATE_TAXONOMY,
  GET_TAXONOMYSCHEMA,
  ADD_TAXONOMY,
} from './constants';
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

export function addTaxonomy(data) {
  return {
    type: ADD_TAXONOMY,
    request: { op: 'post', path: '/@taxonomy', data },
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
