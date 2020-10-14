import * as React from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Button, Checkbox, InputGroup, NonIdealState } from '@blueprintjs/core';

import { useGet, cache } from '../hooks/useApiResource';
import { Content } from '../components/Content';
import { TODOS_ENDPOINT, TODOS_FIELDS } from '../constants';
import { ITodo } from '../interfaces';
import { Loader } from '../components/Loader';
import { Error } from '../components/Error';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export const Todos = () => {
  const { data, isLoading, error } = useGet<ITodo[]>(
    `${TODOS_ENDPOINT}?fields=${TODOS_FIELDS}`,
    TODOS_ENDPOINT,
  );
  const ref = React.useRef(null);
  const prevCache: ITodo[] = cache.get(TODOS_ENDPOINT);

  useDocumentTitle('Todos');

  if (isLoading && !data) {
    return <Loader />;
  }

  if (error) {
    return <Error />;
  }

  return (
    <Content>
      <h1>Todos</h1>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          const { data } = await axios.post(TODOS_ENDPOINT, {
            name: ref.current.value,
          });
          cache.set(TODOS_ENDPOINT, [...prevCache, data]);
          ref.current.value = '';
        }}
      >
        <InputGroup
          inputRef={ref}
          placeholder="Add a todo"
          rightElement={<Button type="submit" icon="plus" minimal={true} />}
          type="text"
        />
      </form>
      <StyledTodos>
        {data.length > 0 ? (
          data.map((todo: ITodo) => {
            return (
              <CheckboxContainer key={todo._id}>
                <Checkbox
                  checked={todo.status === 'done'}
                  label={todo.name}
                  onChange={async () => {
                    const { data } = await axios.patch(
                      `${TODOS_ENDPOINT}/${todo._id}`,
                      {
                        status: todo.status === 'active' ? 'done' : 'active',
                      },
                    );
                    cache.set(
                      TODOS_ENDPOINT,
                      prevCache.map((savedTodo) => {
                        if (todo._id === savedTodo._id) {
                          return data;
                        }

                        return savedTodo;
                      }),
                    );
                  }}
                />
                <Button
                  minimal
                  icon="cross"
                  onClick={() => {
                    axios.delete(`${TODOS_ENDPOINT}/${todo._id}`);
                    cache.set(
                      TODOS_ENDPOINT,
                      prevCache.filter(
                        (savedTodo) => savedTodo._id !== todo._id,
                      ),
                    );
                  }}
                />
              </CheckboxContainer>
            );
          })
        ) : (
          <StyledNonIdealState
            icon="error"
            title="You haven't created any todos yet."
          />
        )}
      </StyledTodos>
    </Content>
  );
};

const StyledTodos = styled.div`
  margin-top: 20px;
`;

const CheckboxContainer = styled.div`
  display: flex;

  button {
    margin-left: auto;
    margin-top: -3px;
  }
`;

const StyledNonIdealState = styled(NonIdealState)`
  height: auto;
`;
