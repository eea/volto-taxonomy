import React from 'react';
import { Grid, Button, Label, Input, List } from 'semantic-ui-react';
import { SEPARATOR } from '../constants';
import { Icon } from '@plone/volto/components';
import addSVG from '@plone/volto/icons/add.svg';
import deleteSVG from '@plone/volto/icons/delete.svg';

const MultipleValuesTermInput = (props) => {
  const { entries, onChange } = props;
  const [items, setItems] = React.useState(entries);

  return (
    <>
      <List divided relaxed>
        {entries.map((item, index) => (
          <List.Item>
            <List.Content>
              <Input
                fluid
                value={item}
                key={index}
                onChange={(ev, { value }) => {
                  let new_items = items;
                  new_items[index] = value;
                  setItems(new_items);
                  onChange('title', SEPARATOR + new_items.join(SEPARATOR));
                  onChange('hierarchy', new_items);
                }}
              />
              <Button
                basic
                onClick={() => {
                  let new_items = items;
                  new_items.splice(index, 1);
                  setItems(new_items);
                  onChange('title', SEPARATOR + new_items.join(SEPARATOR));
                  onChange('hierarchy', new_items);
                }}
              >
                <Icon className="circled" name={deleteSVG} size="12px" />
              </Button>
            </List.Content>
          </List.Item>
        ))}
      </List>
      <Button
        basic
        onClick={() => {
          let new_items = items;
          new_items.push('...');
          setItems(new_items);
          onChange('title', SEPARATOR + new_items.join(SEPARATOR));
          onChange('hierarchy', new_items);
        }}
      >
        <Icon className="circled" name={addSVG} size="12px" />
      </Button>
    </>
  );
};

const TermInput = ({ entry, onChange }) => {
  const [isEditing, setEditing] = React.useState();
  return isEditing ? (
    <Grid columns={2}>
      <Grid.Row>
        <Grid.Column>
          <div>
            <Label>Title</Label>
          </div>
          <MultipleValuesTermInput
            entries={entry.hierarchy}
            onChange={onChange}
          />
        </Grid.Column>
        <Grid.Column>
          <div>
            <Label>Token</Label>
          </div>
          <Input
            value={entry.token}
            onChange={(e, { value }) => {
              onChange('token', value);
            }}
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Button
          compact
          onClick={() => {
            setEditing(false);
          }}
        >
          OK
        </Button>
      </Grid.Row>
    </Grid>
  ) : (
    <Button title={entry.token} compact basic onClick={() => setEditing(true)}>
      <span>
        {entry?.hierarchy ? entry.hierarchy.join(SEPARATOR) : entry.title}
      </span>
    </Button>
  );
};

export default TermInput;
