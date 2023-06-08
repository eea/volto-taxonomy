import {
  GET_TAXONOMY,
  UPDATE_TAXONOMY,
  GET_TAXONOMYSCHEMA,
  ADD_TAXONOMY,
  LIST_TAXONOMIES,
  DELETE_TAXONOMY,
} from './constants';
import { nestContent } from '@plone/volto/helpers';

export function updateTaxonomy(name, content) {
  return {
    type: UPDATE_TAXONOMY,
    request: {
      op: 'patch',
      path: name ? `/@taxonomy/${name}` : '/@taxonomy',
      data: nestContent(content),
    },
  };
}

export function getTaxonomy(name) {
  return {
    type: GET_TAXONOMY,
    request: { op: 'get', path: name ? `/@taxonomy/${name}` : '/@taxonomy' },
  };
}

export function listTaxonomies() {
  return {
    type: LIST_TAXONOMIES,
    request: { op: 'get', path: '/@taxonomy' },
  };
}

export function addTaxonomy(data) {
  return {
    type: ADD_TAXONOMY,
    request: { op: 'post', path: '/@taxonomy', data },
  };
}

export function deleteTaxonomy(urls) {
  return {
    type: DELETE_TAXONOMY,
    mode: 'serial',
    request:
      typeof urls === 'string'
        ? { op: 'del', path: `/@taxonomy/${urls}` }
        : urls.map((url) => ({ op: 'del', path: `/@taxonomy/${url}` })),
    urls,
  };
}

export function getTaxonomySchema(url) {
  return {
    type: GET_TAXONOMYSCHEMA,
    request: {
      op: 'get',
      path: '/@taxonomySchema',
      headers: { Accept: 'application/json' },
    },
  };
}
