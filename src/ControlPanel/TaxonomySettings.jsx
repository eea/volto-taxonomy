import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { toast } from 'react-toastify';
import { messages } from '@plone/volto/helpers';
import { Form, Toast } from '@plone/volto/components';
import { getTaxonomySchema, updateTaxonomy } from '../actions';
import { defineMessages, useIntl } from 'react-intl';

const customMessages = defineMessages({
  saved: {
    id: 'Changes saved',
    defaultMessage: 'Changes saved',
  },
});
export default (props) => {
  const dispatch = useDispatch();
  const { id } = props.match.params;
  const intl = useIntl();
  const [taxonomy, schema, loaded] = useSelector((state) => {
    return [
      state.taxonomy?.taxonomy,
      state.taxonomy?.schema?.schema
        ? {
            ...state.taxonomy.schema.schema,
            properties: {
              ...state.taxonomy.schema.schema.properties,
              default_language: {
                ...(state.taxonomy.schema.schema.properties.default_language ||
                  {}),
                vocabulary: {
                  '@id': 'plone.app.vocabularies.SupportedContentLanguages',
                },
              },
            },
          }
        : undefined,
      state.taxonomy?.schema?.get?.loaded,
    ];
  });

  const formData = {
    field_description: taxonomy?.description,
    field_title: taxonomy?.title,
    taxonomy: taxonomy?.name,
  };

  useEffect(() => {
    if (!schema) {
      dispatch(getTaxonomySchema());
    }
  }, [schema, dispatch]);

  const onSubmit = React.useCallback(
    (data, callback) => {
      dispatch(updateTaxonomy(id, data))
        .then(() => {
          toast.success(
            <Toast
              success
              title={intl.formatMessage(messages.success)}
              content={intl.formatMessage(customMessages.saved)}
            />,
          );
        })
        .catch((e) => {
          toast.error(
            <Toast
              error
              title={intl.formatMessage(messages.error)}
              content={e.message}
            />,
          );
        });
    },
    [dispatch, id, intl],
  );

  return loaded ? (
    <div>
      <Form
        formData={{ taxonomy, ...formData }}
        schema={schema}
        onSubmit={onSubmit}
        loading={false}
      />
    </div>
  ) : null;
};
