import {
  Dispatch,
  useCallback,
  useEffect,
  useReducer,
  useContext,
} from 'react';

import { Cache } from '../lib/Cache';
import { ViewerContext } from '../contexts/ViewerContext';

type State<T> = {
  isLoading: boolean;
  error: Error | null;
  data: T;
};

type InitRequest = {
  type: 'INIT_REQUEST';
};

type Success<T> = {
  type: 'SUCCESS';
  payload: T | null;
};

type Error = {
  type: 'ERROR';
  error: Error | null;
};

type RequestBody<T> = { [key: string]: T };
type Patch<T> = { patch: (body: RequestBody<T>) => void };
type Post<T> = { post: (body: RequestBody<T>) => void };
type Put<T> = { put: (body: RequestBody<T>) => void };
type Destroy = { destroy: () => void };
type Action<T> = InitRequest | Success<T> | Error;

const cache = new Cache();

function getMutationRequestInfo<T>(
  body: RequestBody<T>,
  method: string,
  dispatch: Dispatch<Action<T>>,
) {
  try {
    return {
      method,
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  } catch (err) {
    dispatch({ type: 'ERROR', error: err });
  }
}

function reducer<T>(requestState: State<T>, action: Action<T>): State<T> {
  switch (action.type) {
    case 'INIT_REQUEST':
      return {
        ...requestState,
        error: null,
        isLoading: true,
      };

    case 'SUCCESS':
      return {
        ...requestState,
        data: action.payload,
        isLoading: false,
      };

    case 'ERROR':
      return {
        ...requestState,
        error: action.error,
        isLoading: false,
      };

    default:
      return requestState;
  }
}

function useGet<T>(url: string, cacheKey?: string): State<T> {
  const viewer = useContext(ViewerContext);
  const resourceKey = cacheKey ? cacheKey : url;
  const cachedResource = cache.get(resourceKey) || null;
  const [state, dispatch] = useReducer(reducer, {
    isLoading: true,
    data: cachedResource,
    error: null,
  });

  useEffect(() => {
    async function request() {
      if (!cachedResource) {
        dispatch({ type: 'INIT_REQUEST' });

        try {
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          const data = await response.json();

          cache.set(resourceKey, data);
          dispatch({ type: 'SUCCESS', payload: data });
        } catch (err) {
          dispatch({ type: 'ERROR', error: err });
        }
      } else {
        dispatch({ type: 'SUCCESS', payload: cachedResource });
      }
    }

    request();
  }, [url, cache]);

  useEffect(() => {
    const unsubscribe = cache.subscribeToKey(resourceKey, (value) => {
      dispatch({ type: 'SUCCESS', payload: value });
    });

    return () => {
      unsubscribe();
    };
  }, [resourceKey, cache, dispatch]);

  // @ts-ignore
  return state;
}

async function mutationRequest<T>(
  dispatch: Dispatch<Action<T>>,
  body: RequestBody<T>,
  requestUrl: string,
  resourceKey: string,
  method: string,
) {
  dispatch({ type: 'INIT_REQUEST' });

  try {
    const response = await fetch(
      requestUrl,
      getMutationRequestInfo(body, method, dispatch),
    );
    const data = await response.json();

    cache.set(resourceKey, data);

    dispatch({ type: 'SUCCESS', payload: data });
  } catch (err) {
    dispatch({ type: 'ERROR', error: err });
  }
}

function useMutation<T>(
  url: string,
  cacheKey?: string,
): [Patch<T> & Post<T> & Put<T> & Destroy, State<T>] {
  const viewer = useContext(ViewerContext);
  const resourceKey = cacheKey ? cacheKey : url;
  const cachedResource = cache.get(resourceKey) || null;
  const [state, dispatch] = useReducer(reducer, {
    isLoading: false,
    data: cachedResource,
    error: null,
  });

  const patch = useCallback(
    (body: RequestBody<T>) => {
      mutationRequest(dispatch, body, url, resourceKey, 'PATCH');
    },
    [url, cache],
  );

  const put = useCallback(
    (body: RequestBody<T>) => {
      mutationRequest(dispatch, body, url, resourceKey, 'PUT');
    },
    [url, cache],
  );

  const post = useCallback(
    (body: RequestBody<T>) => {
      mutationRequest(dispatch, body, url, resourceKey, 'POST');
    },
    [url, cache],
  );

  const destroy = useCallback(() => {
    async function request() {
      dispatch({ type: 'INIT_REQUEST' });

      try {
        await fetch(url, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        cache.delete(resourceKey);

        dispatch({ type: 'SUCCESS', payload: null });
      } catch (err) {
        dispatch({ type: 'ERROR', error: err });
      }
    }

    request();
  }, [url, cache]);

  // @ts-ignore
  return [{ destroy, patch, post, put }, state];
}

export { useGet, useMutation, cache };
