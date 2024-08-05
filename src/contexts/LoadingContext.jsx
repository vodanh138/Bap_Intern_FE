import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import LoadingPage from '../components/Loading';

const LoadingContext = React.createContext({
  isLoading: false,
  setIsLoading: () => {}
  // handleLoading: TODO
});

function LoadingProvider({ children }) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [configLoading, setConfigLoading] = React.useState({});
  const handleLoading = ({ config }) => {
    setConfigLoading({ config });
    setIsLoading(true);
  };
  const value = useMemo(
    () => ({ isLoading, setIsLoading, handleLoading }),
    [isLoading]
  );
  return (
    <LoadingContext.Provider value={value}>
      {children}
      {isLoading && <LoadingPage {...configLoading} />}
    </LoadingContext.Provider>
  );
}

LoadingProvider.prototype = {
  children: PropTypes.node
};

export { LoadingContext, LoadingProvider };
