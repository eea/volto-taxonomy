import { vi } from 'vitest';
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import AddTaxonomy from './AddTaxonomy';
import * as reactRedux from 'react-redux';
import { Provider } from 'react-intl-redux';

vi.mock('react-redux', async () => ({
  ...(await vi.importActual('react-redux')),
  useDispatch: vi.fn(),
  useSelector: vi.fn(),
}));

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockStore = configureStore([]);

vi.mock('@plone/volto/components/manage/Form/ModalForm', () => ({
  __esModule: true,
  default: vi.fn(() => {
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
    formatMessage: vi.fn(),
  },
});

const dispatchMock = vi.fn();

describe('AddTaxonomy', () => {
  const useDispatchMock = reactRedux.useDispatch;
  const useSelectorMock = reactRedux.useSelector;

  beforeEach(() => {
    useDispatchMock.mockReturnValue(dispatchMock);
    useSelectorMock.mockReset();
    dispatchMock.mockClear();
  });

  it('renders correctly and does not dispatch getTaxonomySchema action when schema is available', async () => {
    const setShow = vi.fn();
    useSelectorMock
      .mockReturnValueOnce({
        fieldsets: [
          { fields: ['field_description', 'field_title', 'taxonomy'] },
        ],
      })
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false);

    render(
      <Provider store={store}>
        <AddTaxonomy setShow={setShow} />
      </Provider>,
    );

    await waitFor(() => {
      expect(dispatchMock).not.toHaveBeenCalled();
    });
  });

  it('dispatches getTaxonomySchema action when schema is not available', async () => {
    const setShow = vi.fn();
    useSelectorMock
      .mockReturnValueOnce(undefined)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false);

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
