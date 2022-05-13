import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ModalForm } from '@plone/volto/components';
import { getTaxonomySchema, addTaxonomy } from '../actions';

const AddTaxonomy = (props) => {
  const { setShow } = props;
  const dispatch = useDispatch();
  const [schema, loaded] = useSelector((state) => [
    state.taxonomy?.schema?.schema,
    state.taxonomy?.schema?.get?.loaded,
  ]);
  const [loading] = useSelector((state) => [state?.taxonomy?.add?.loading]);

  const [error, setError] = React.useState('');

  useEffect(() => {
    if (!schema) {
      dispatch(getTaxonomySchema());
    }
  }, [schema, dispatch]);

  return loaded ? (
    <ModalForm
      open={true}
      className="modal"
      onSubmit={(data, callback) => {
        dispatch(addTaxonomy(data))
          .then((data) => setShow(false))
          .catch((e) => setError(e));
      }}
      submitError={error.message}
      onCancel={() => setShow(false)}
      title={'Add Taxonomy'}
      loading={loading}
      schema={schema}
    />
  ) : null;
};

export default AddTaxonomy;
