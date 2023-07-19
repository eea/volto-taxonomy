import React from 'react';
import { render, waitFor } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import AddTaxonomy from './AddTaxonomy';
import * as reactRedux from 'react-redux';
import { Provider } from 'react-intl-redux';

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

const mockStore = configureStore([]);

jest.mock('@plone/volto/components', () => ({
  ModalForm: jest.fn(() => {
    return <div>Modal Form</div>;
  }),
}));

const store = mockStore({
  taxonomy: {
    schema: {
      schema: {
        properties: {
          field_description: { type: 'string' },
          field_title: { type: 'string' },
          taxonomy: { type: 'string' },
        },
        required: ['field_description', 'field_title', 'taxonomy'],
      },
      get: { loaded: true },
    },
    add: { loading: false },
  },
  intl: {
    locale: 'en',
    messages: {},
    formatMessage: jest.fn(),
  },
});

const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');
const dispatchMock = jest.fn();
useDispatchMock.mockReturnValue(dispatchMock);

describe('AddTaxonomy', () => {
  beforeEach(() => {
    useDispatchMock.mockClear();
    dispatchMock.mockClear();
  });

  it('renders correctly and does not dispatch getTaxonomySchema action when schema is available', async () => {
    const setShow = jest.fn();
    const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
    useSelectorMock.mockReturnValue([
      {
        fieldsets: [
          { fields: ['field_description', 'field_title', 'taxonomy'] },
        ],
      },
      true,
    ]);

    render(
      <Provider store={store}>
        <AddTaxonomy setShow={setShow} />
      </Provider>,
    );

    await waitFor(() => {
      expect(dispatchMock).not.toHaveBeenCalled();
    });
  });

  it('renders correctly and does not dispatch getTaxonomySchema action when schema is available', async () => {
    const setShow = jest.fn();
    const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
    useSelectorMock.mockReturnValue([undefined, true]);
    render(
      <Provider store={store}>
        <AddTaxonomy setShow={setShow} />
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
