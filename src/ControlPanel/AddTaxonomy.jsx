import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ModalForm } from '@plone/volto/components';
import { getTaxonomySchema, addTaxonomy } from '../actions';

const AddTaxonomy = (props) => {
  const { setShow } = props;
  const url = '/@taxonomySchema';
  const dispatch = useDispatch();
  const [schema, loading, Taxonomy] = useSelector((state) => [
    state.taxonomy?.schema?.[url],
    state.taxonomy?.schema?.get?.loading,
    state.taxonomy,
  ]);
  const [error, setError] = React.useState('');

  useEffect(() => {
    dispatch(getTaxonomySchema(url));
  }, []);

  return schema ? (
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
      loading={false}
      schema={schema}
    />
  ) : null;
};

export default AddTaxonomy;
