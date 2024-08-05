import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';

function Popup({ title, children, isOpen, onCancel, onConfirm, text, footer }) {
  const { t } = useTranslation();
  return (
    <Modal
      title={title}
      open={isOpen}
      onOk={onConfirm}
      onCancel={onCancel}
      okText={text}
      cancelText={t('BUTTON.Cancel')}
      footer={footer}
    >
      {children}
    </Modal>
  );
}

Popup.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  isOpen: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func,
  text: PropTypes.string,
  footer: PropTypes.node
};

Popup.defaultProps = {
  title: 'Chưa nhập title',
  children: 'Chưa nhập children'
};

export default Popup;
