import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { toast } from 'react-toastify';
import { messages } from '@plone/volto/helpers';
import { Form, Toast } from '@plone/volto/components';
import { getTaxonomySchema } from '../actions';

export default () => {
  const dispatch = useDispatch();
  const [schema, loaded] = useSelector((state) => [
    state.taxonomy?.schema?.schema,
    state.taxonomy?.schema?.get?.loaded,
  ]);

  useEffect(() => {
    if (!schema) {
      dispatch(getTaxonomySchema());
    }
  }, [schema, dispatch]);

  const onSubmit = () => {};
  return loaded ? (
    <div>
      <Form formData={{}} schema={schema} onSubmit={onSubmit} loading={false} />
    </div>
  ) : null;
};
