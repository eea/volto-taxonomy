import React, { useEffect, useMemo } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { toast } from 'react-toastify';
import { messages } from '@plone/volto/helpers/MessageLabels/MessageLabels';
import Toast from '@plone/volto/components/manage/Toast/Toast';
import { Form } from '@plone/volto/components/manage/Form';
import {
  getTaxonomySchema,
  updateTaxonomy,
} from '@eeacms/volto-taxonomy/actions';
import { defineMessages, useIntl } from 'react-intl';

const customMessages = defineMessages({
  saved: {
    id: 'Changes saved',
    defaultMessage: 'Changes saved',
  },
});

const EMPTY_OBJECT = Object.freeze({});

const removeFields = (schema, fields = []) => {
  const newSchema = {
    ...schema,
    fieldsets: (schema?.fieldsets || []).map((fieldset) => ({
      ...fieldset,
      fields: [...(fieldset.fields || [])],
    })),
    properties: { ...(schema?.properties || EMPTY_OBJECT) },
    required: [...(schema?.required || [])],
  };

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

const TaxonomySettings = (props) => {
  const dispatch = useDispatch();
  const { id } = props.match.params;
  const intl = useIntl();
  const taxonomy = useSelector((state) => state.taxonomy?.taxonomy);
  const taxonomySchema = useSelector((state) => state.taxonomy?.schema?.schema);
  const loaded = useSelector((state) => state.taxonomy?.schema?.get?.loaded);

  const schema = useMemo(() => {
    if (!taxonomySchema) {
      return undefined;
    }

    const properties = taxonomySchema.properties || EMPTY_OBJECT;

    return removeFields(
      {
        ...taxonomySchema,
        properties: {
          ...properties,
          default_language: {
            ...(properties.default_language || EMPTY_OBJECT),
            vocabulary: {
              '@id': 'plone.app.vocabularies.SupportedContentLanguages',
            },
          },
        },
      },
      ['taxonomy'],
    );
  }, [taxonomySchema]);

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

export default TaxonomySettings;
