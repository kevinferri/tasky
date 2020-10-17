import * as React from 'react';

import { ViewerContext } from '../contexts/ViewerContext';
import { Content } from '../components/Content';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const formatTime = (date: Date): string => {
  return date.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
  });
};

export const Home = () => {
  const viewer = React.useContext(ViewerContext);
  const [now, setNow] = React.useState(new Date(Date.now()));

  useDocumentTitle('Home');

  React.useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date(Date.now()));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Content>
      <h1>Hello, {viewer.name}!</h1>
      <h1>{formatTime(now)}</h1>
    </Content>
  );
};
