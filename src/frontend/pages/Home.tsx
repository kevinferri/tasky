import * as React from 'react';
import styled from 'styled-components';

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
      <Flex>
        <div>
          <h1>Hello, {viewer.name}!</h1>
          <pre>{JSON.stringify(viewer, null, 2)}</pre>
        </div>
        <div>
          <h1>{formatTime(now)}</h1>
        </div>
      </Flex>
    </Content>
  );
};

const Flex = styled.div`
  display: flex;

  div:last-of-type {
    margin-left: auto;
  }
`;
