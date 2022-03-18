import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ModalForm } from '@plone/volto/components';
import { getTaxonomySchema } from '../actions';

const AddTaxonomy = (props) => {
  const { setShow } = props;
  const url = '/@taxonomySchema';
  const dispatch = useDispatch();
  const [schema, loading] = useSelector((state) => [
    state.taxonomy?.schema?.[url],
    state.taxonomy?.schema?.get?.loading,
  ]);

  useEffect(() => {
    dispatch(getTaxonomySchema(url));
  }, []);

  return schema ? (
    <ModalForm
      open={true}
      className="modal"
      onSubmit={() => {}}
      submitError={''}
      onCancel={() => setShow(false)}
      title={'Add Taxonomy'}
      loading={false}
      schema={schema}
    />
  ) : null;
};

export default AddTaxonomy;
