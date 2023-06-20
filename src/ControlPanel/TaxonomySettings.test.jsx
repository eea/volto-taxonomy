import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import TaxonomySettings from './TaxonomySettings';
import * as reactRedux from 'react-redux';
import { Provider } from 'react-intl-redux';
import * as reducers from '../reducers';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('../reducers', () => ({
  getTaxonomySchema: jest.fn().mockReturnValue({
    type: 'GET_TAXONOMYSCHEMA_SUCCESS',
    result: {
      fieldsets: [{ fields: ['field_description', 'field_title', 'taxonomy'] }],
    },
  }),
}));

jest.mock('@plone/volto/components', () => ({
  Form: jest.fn(({ formData, schema, onSubmit }) => {
    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return <form onSubmit={handleSubmit}>Form</form>;
  }),
}));

const mockStore = configureStore([]);
const store = mockStore({
  taxonomy: {
    taxonomy: { description: 'desc', title: 'title', name: 'name' },
    schema: {
      schema: {
        fieldsets: [
          { fields: ['field_description', 'field_title', 'taxonomy'] },
        ],
      },
      get: { loaded: true },
    },
  },
  intl: {
    locale: 'en',
    messages: {},
    formatMessage: jest.fn(),
  },
});

const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
useSelectorMock.mockReturnValue([
  { description: 'desc', title: 'title', name: 'name' },
  {
    fieldsets: [{ fields: ['field_description', 'field_title', 'taxonomy'] }],
  },
  true,
]);

const getTaxonomySchemaMock = jest.spyOn(reducers, 'getTaxonomySchema');
getTaxonomySchemaMock.mockReturnValue({
  schema: {
    fieldsets: [{ fields: ['field_description', 'field_title', 'taxonomy'] }],
  },
});

const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');
const dispatchMock = jest.fn();
useDispatchMock.mockReturnValue(dispatchMock);

describe('TaxonomySettings', () => {
  it('renders correctly and does not dispatch action when schema is available', async () => {
    const match = { params: { id: '1' } };
    const history = createMemoryHistory();

    render(
      <Provider store={store}>
        <Router history={history}>
          <TaxonomySettings match={match} />
        </Router>
      </Provider>,
    );

    await waitFor(() => {
      expect(dispatchMock).not.toHaveBeenCalledWith(getTaxonomySchemaMock());
    });
  });

  it('renders correctly and dispatches action when schema is not available', async () => {
    const match = { params: { id: '1' } };
    const history = createMemoryHistory();

    const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
    useSelectorMock.mockReturnValue([
      { description: 'desc', title: 'title', name: 'name' },
      undefined,
      true,
    ]);

    render(
      <Provider store={store}>
        <Router history={history}>
          <TaxonomySettings match={match} />
        </Router>
      </Provider>,
    );

    await waitFor(() => {
      expect(dispatchMock).toHaveBeenCalledWith({
        type: 'GET_TAXONOMYSCHEMA',
        request: {
          op: 'get',
          path: '/@taxonomySchema',
          headers: { Accept: 'application/json' },
        },
      });
    });
  });
});
