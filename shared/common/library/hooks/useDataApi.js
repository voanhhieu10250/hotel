import { useState, useReducer, useEffect } from 'react';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { apiInstance } from '../../../../packages/hotel/src/context/AuthProvider';

function sleep(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

async function SuperFetch(url, method = 'GET', body = {}) {
  NProgress.start();
  // await sleep(1000); // demo purpose only
  let options = {
    url,
    method,
  };
  if (method === 'POST' || method === 'PUT') options = { ...options, body };

  // authentication
  // we will had custom headers here.

  try {
    const { data } = await apiInstance(options);
    NProgress.done();
    return data;
  } catch (error) {
    NProgress.done();
    return Promise.reject(error);
  }
}

function dataFetchReducer(state, action) {
  switch (action.type) {
    case 'FETCH_INIT':
      return {
        data: state.data,
        loading: true,
        error: false,
      };
    case 'FETCH_LOADING':
      return {
        ...state,
        loading: true,
      };
    case 'FETCH_SUCCESS':
      return {
        data: action.payload,
        loading: false,
        error: false,
      };
    case 'FETCH_FAILURE':
      return {
        data: action.payload,
        loading: false,
        error: true,
      };
    case 'ADD_MORE':
      return {
        ...state,
        data: {
          ...action.payload,
          content: {
            ...action.payload.content,
            records: [
              ...state.data.content.records,
              ...action.payload.content.records,
            ],
          },
        },
        loading: false,
        error: false,
      };
    default:
      throw new Error();
  }
}

const useDataApi = (initialUrl, initialData = null) => {
  const [url, setUrl] = useState(initialUrl);

  const [state, dispatch] = useReducer(dataFetchReducer, {
    loading: false,
    error: false,
    data: initialData,
  });

  useEffect(() => {
    let didCancel = false;

    const fetchData = async () => {
      dispatch({ type: 'FETCH_INIT' });

      try {
        const result = await SuperFetch(url);
        if (!didCancel) {
          dispatch({ type: 'FETCH_SUCCESS', payload: result });
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: 'FETCH_FAILURE', payload: initialData });
        }
      }
    };

    fetchData();

    return () => {
      didCancel = true;
    };
  }, [url]);

  const loadMoreData = async newUrl => {
    dispatch({ type: 'FETCH_LOADING' });
    try {
      const result = await SuperFetch(newUrl);
      dispatch({ type: 'ADD_MORE', payload: result });
    } catch (error) {
      dispatch({ type: 'FETCH_FAILURE', payload: initialData });
    }
  };

  const doFetch = url => {
    setUrl(url);
  };

  return { ...state, doFetch, loadMoreData };
};

export default useDataApi;
