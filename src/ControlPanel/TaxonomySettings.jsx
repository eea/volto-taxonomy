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

const removeFields = (schema, fields = []) => {
  const newSchema = { fieldsets: [], properties: {}, required: [], ...schema };
  fields.forEach((field) => {
    delete newSchema.properties[field];
    const index = newSchema.required.indexOf(field);
    if (index > -1) {
      newSchema.required.splice(index, 1);
    }
    newSchema.fieldsets.forEach((fieldset) => {
      const index = fieldset.fields.indexOf(field);
      if (index > -1) {
        fieldset.fields.splice(index, 1);
      }
    });
  });
  return newSchema;
};

export default (props) => {
  const dispatch = useDispatch();
  const { id } = props.match.params;
  const intl = useIntl();
  const [taxonomy, schema, loaded] = useSelector((state) => {
    return [
      state.taxonomy?.taxonomy,
      state.taxonomy?.schema?.schema
        ? removeFields(
            {
              ...state.taxonomy.schema.schema,
              properties: {
                ...state.taxonomy.schema.schema.properties,
                default_language: {
                  ...(state.taxonomy.schema.schema.properties
                    .default_language || {}),
                  vocabulary: {
                    '@id': 'plone.app.vocabularies.SupportedContentLanguages',
                  },
                },
              },
            },
            ['taxonomy'],
          )
        : undefined,
      state.taxonomy?.schema?.get?.loaded,
    ];
  });

  const formData = {
    field_description: taxonomy?.description,
    field_title: taxonomy?.title,
    taxonomy_fieldset: taxonomy?.fieldset,
    field_prefix: taxonomy?.prefix,
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
