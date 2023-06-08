import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { ModalForm, Toast } from '@plone/volto/components';
import { defineMessages, useIntl } from 'react-intl';
import { getTaxonomySchema, addTaxonomy } from '../actions';

const messages = defineMessages({
  added: {
    id: 'Taxonomy Added Successfully',
    defaultMessage: 'Taxonomy Added Successfully',
  },
  success: {
    id: 'Success',
    defaultMessage: 'Success',
  },
});
const AddTaxonomy = (props) => {
  const intl = useIntl();
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
          .then((data) => {
            setShow(false);
            toast.success(
              <Toast
                success
                title={intl.formatMessage(messages.success)}
                content={intl.formatMessage(messages.added)}
              />,
            );
          })
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
