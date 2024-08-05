import React from 'react';
import PropTypes from 'prop-types';
import { Card, Radio, Checkbox } from 'antd';

const ListCheck = {
  1: 'Radio',
  2: 'Checkbox'
};

function CardComponent({ item, value, onChange, checked, disabled, type }) {
  const componentType = ListCheck[type];

  return (
    <Card className="shadow-sm rounded-md border border-gray-200 mb-2">
      {componentType === 'Radio' ? (
        <Radio.Group
          value={value}
          onChange={onChange}
          className="w-full flex items-center"
        >
          <Radio className="w-full" value={item.id}>
            {item.name}
          </Radio>
        </Radio.Group>
      ) : (
        <Checkbox
          value={item.id}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="w-full flex items-center"
        >
          {item.name}
        </Checkbox>
      )}
    </Card>
  );
}

CardComponent.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  type: PropTypes.number.isRequired
};

export default CardComponent;
