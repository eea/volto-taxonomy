import {
  GET_TAXONOMY,
  UPDATE_TAXONOMY,
  GET_TAXONOMYSCHEMA,
  ADD_TAXONOMY,
  LIST_TAXONOMIES,
  DELETE_TAXONOMY,
} from './constants';
import { nestContent } from '@plone/volto/helpers';

export function updateTaxonomy(url, content) {
  return {
    url,
    type: UPDATE_TAXONOMY,
    request: { op: 'patch', path: url, data: nestContent(content) },
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

export function deleteTaxonomy(data) {
  return {
    type: DELETE_TAXONOMY,
    request: { op: 'del', path: `/@taxonomy/${data}` },
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
