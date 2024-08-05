import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { notification } from 'antd';

const NotificationContext = React.createContext({
  openNotification: () => {}
});

function NotificationProvider({ children }) {
  const [api, contextHolder] = notification.useNotification();

  const openNotification = ({ message, type, title }) => {
    api[type || 'open']({
      message: title,
      description: message,
      className: 'custom-class',
      style: {
        width: 600
      }
    });
  };

  const value = useMemo(() => ({ openNotification }), [api]);

  return (
    <NotificationContext.Provider value={value}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
}

// Add PropTypes validation for `children`
NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export { NotificationContext, NotificationProvider };
