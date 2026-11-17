import { vi } from 'vitest';
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import TaxonomySettings from './TaxonomySettings';
import Form from '@plone/volto/components/manage/Form/Form';
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

vi.mock('@eeacms/volto-taxonomy/actions', () => ({
  getTaxonomySchema: vi.fn().mockReturnValue({
    type: 'GET_TAXONOMYSCHEMA',
    request: {
      op: 'get',
      path: '/@taxonomySchema',
      headers: { Accept: 'application/json' },
    },
  }),
}));

vi.mock('@plone/volto/components/manage/Form/Form', () => ({
  __esModule: true,
  default: vi.fn(({ formData, schema, onSubmit }) => {
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
    formatMessage: vi.fn(),
  },
});

const dispatchMock = vi.fn();

describe('TaxonomySettings', () => {
  const useDispatchMock = reactRedux.useDispatch;
  const useSelectorMock = reactRedux.useSelector;

  beforeEach(() => {
    useDispatchMock.mockReturnValue(dispatchMock);
    useSelectorMock.mockReset();
    dispatchMock.mockClear();
  });

  it('renders correctly and does not dispatch action when schema is available', async () => {
    const match = { params: { id: '1' } };
    const history = createMemoryHistory();
    useSelectorMock
      .mockReturnValueOnce({
        description: 'desc',
        title: 'title',
        name: 'name',
      })
      .mockReturnValueOnce({
        fieldsets: [
          { fields: ['field_description', 'field_title', 'taxonomy'] },
        ],
      })
      .mockReturnValueOnce(true);

    render(
      <Provider store={store}>
        <Router history={history}>
          <TaxonomySettings match={match} />
        </Router>
      </Provider>,
    );

    await waitFor(() => {
      expect(dispatchMock).not.toHaveBeenCalled();
    });
  });

  it('renders correctly and dispatches action when schema is not available', async () => {
    const match = { params: { id: '1' } };
    const history = createMemoryHistory();
    useSelectorMock
      .mockReturnValueOnce({
        description: 'desc',
        title: 'title',
        name: 'name',
      })
      .mockReturnValueOnce(undefined)
      .mockReturnValueOnce(true);

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

  it('does not offer or send the field prefix', async () => {
    const match = { params: { id: '1' } };
    const history = createMemoryHistory();
    Form.mockClear();
    useSelectorMock
      .mockReturnValueOnce({
        description: 'desc',
        title: 'title',
        name: 'name',
        prefix: 'taxonomy_',
      })
      .mockReturnValueOnce({
        fieldsets: [
          {
            fields: ['field_title', 'field_prefix', 'taxonomy'],
          },
        ],
        properties: {
          field_title: { type: 'string' },
          field_prefix: { type: 'string' },
          taxonomy: { type: 'string' },
        },
        required: ['field_title'],
      })
      .mockReturnValueOnce(true);

    render(
      <Provider store={store}>
        <Router history={history}>
          <TaxonomySettings match={match} />
        </Router>
      </Provider>,
    );

    await waitFor(() => {
      expect(Form).toHaveBeenCalled();
    });
    const { schema, formData } = Form.mock.calls.at(-1)[0];
    expect(schema.properties).not.toHaveProperty('field_prefix');
    expect(schema.fieldsets[0].fields).not.toContain('field_prefix');
    expect(formData).not.toHaveProperty('field_prefix');
  });
});
