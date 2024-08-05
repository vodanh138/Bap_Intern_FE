import React, { createContext, useState, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';

const PopupContext = createContext();

export function usePopup() {
  return useContext(PopupContext);
}

export function PopupProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState(null);

  const openPopup = (content) => {
    setContent(content);
    setIsOpen(true);
  };

  const closePopup = () => {
    setContent(null);
    setIsOpen(false);
  };

  const value = useMemo(
    () => ({
      isOpen,
      openPopup,
      closePopup,
      content
    }),
    [isOpen, content] // Dependencies for useMemo
  );

  return (
    <PopupContext.Provider value={value}>{children}</PopupContext.Provider>
  );
}

PopupProvider.propTypes = {
  children: PropTypes.node.isRequired
};
