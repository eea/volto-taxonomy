import { GET_TAXONOMY, UPDATE_TAXONOMY } from './constants';

const initialState = {};

function getRequestKey(actionType) {
  return actionType.split('_')[0].toLowerCase();
}

export function taxonomy(state = initialState, action) {
  switch (action.type) {
    case `${GET_TAXONOMY}_PENDING`:
    case `${UPDATE_TAXONOMY}_PENDING`:
      return {
        ...state,
        [getRequestKey(action.type)]: {
          loading: true,
          loaded: false,
          error: null,
        },
      };
    case `${GET_TAXONOMY}_SUCCESS`:
    case `${UPDATE_TAXONOMY}_SUCCESS`:
      return {
        ...state,
        data: {
          ...state.data,
          [action.url]: action.result,
        },
        [getRequestKey(action.type)]: {
          loading: false,
          loaded: true,
          error: null,
        },
      };
    case `${GET_TAXONOMY}_FAIL`:
    case `${UPDATE_TAXONOMY}_FAIL`:
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
