import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ColorPicker } from 'antd';

function ColorPickerComponent({ label, initialColor, onColorChange }) {
  const [color, setColor] = useState(initialColor);

  const handleChange = (color) => {
    if (color && color.metaColor && color.metaColor.originalInput) {
      const { r, g, b } = color.metaColor; // Extract RGB values
      const hex = `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
      setColor(hex);
      onColorChange(hex);
      console.log(`${label} selected color: ${hex}`);
    } else {
      console.error('Color value is not available.');
    }
  };

  return (
    <div>
      {label}:
      <ColorPicker color={color} showText onChange={handleChange} />
    </div>
  );
}

ColorPickerComponent.propTypes = {
  label: PropTypes.string.isRequired,
  initialColor: PropTypes.string.isRequired,
  onColorChange: PropTypes.func.isRequired
};

export default ColorPickerComponent;
