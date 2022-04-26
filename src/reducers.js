import {
  GET_TAXONOMY,
  UPDATE_TAXONOMY,
  GET_TAXONOMYSCHEMA,
  ADD_TAXONOMY,
  LIST_TAXONOMIES,
  DELETE_TAXONOMY,
} from './constants';

const initialState = {};

function getRequestKey(actionType) {
  return actionType.split('_')[0].toLowerCase();
}

export function taxonomy(state = initialState, action) {
  switch (action.type) {
    case `${GET_TAXONOMY}_PENDING`:
    case `${LIST_TAXONOMIES}_PENDING`:
    case `${UPDATE_TAXONOMY}_PENDING`:
    case `${ADD_TAXONOMY}_PENDING`:
    case `${DELETE_TAXONOMY}_PENDING`:
      return {
        ...state,
        [getRequestKey(action.type)]: {
          loading: true,
          loaded: false,
          error: null,
        },
      };
    case `${GET_TAXONOMYSCHEMA}_PENDING`:
      return {
        ...state,
        schema: {
          [getRequestKey(action.type)]: {
            loading: true,
            loaded: false,
            error: null,
          },
        },
      };

    case `${UPDATE_TAXONOMY}_SUCCESS`:
    case `${ADD_TAXONOMY}_SUCCESS`:
    case `${DELETE_TAXONOMY}_SUCCESS`:
      return {
        ...state,
        [getRequestKey(action.type)]: {
          loading: false,
          loaded: true,
          error: null,
        },
      };
    case `${GET_TAXONOMYSCHEMA}_SUCCESS`:
      return {
        ...state,
        schema: {
          ...state.schema,
          schema: { ...action.result },
          [getRequestKey(action.type)]: {
            loading: false,
            loaded: true,
            error: null,
          },
        },
      };
    case `${GET_TAXONOMY}_SUCCESS`:
      return {
        ...state,
        taxonomy: action.result,
        [getRequestKey(action.type)]: {
          loading: false,
          loaded: true,
          error: null,
        },
      };
    case `${LIST_TAXONOMIES}_SUCCESS`:
      return {
        ...state,
        data: action.result,
        [getRequestKey(action.type)]: {
          loading: false,
          loaded: true,
          error: null,
        },
      };
    case `${LIST_TAXONOMIES}_FAIL`:
      return {
        ...state,
        data: [],
        [getRequestKey(action.type)]: {
          loading: false,
          loaded: false,
          error: action.error,
        },
      };
    case `${GET_TAXONOMYSCHEMA}_FAIL`:
      return {
        ...state,
        schema: {},
        [getRequestKey(action.type)]: {
          loading: false,
          loaded: false,
          error: action.error,
        },
      };

    case `${GET_TAXONOMY}_FAIL`:
      return {
        ...state,
        taxonomy: {},
        [getRequestKey(action.type)]: {
          loading: false,
          loaded: false,
          error: action.error,
        },
      };
    case `${UPDATE_TAXONOMY}_FAIL`:
    case `${ADD_TAXONOMY}_FAIL`:
    case `${DELETE_TAXONOMY}_FAIL`:
      return {
        ...state,
        [getRequestKey(action.type)]: {
          loading: false,
          loaded: false,
          error: action.error,
        },
      };

    default:
      break;
  }
  return state;
}
