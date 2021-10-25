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

  return await apiInstance(options)
    .then(({ data }) => {
      NProgress.done();
      return data;
    })
    .catch(error => Promise.reject(error));
}

function dataFetchReducer(state, action) {
  switch (action.type) {
    case 'FETCH_INIT':
      return {
        ...state,
        loading: true,
        error: false,
      };
    case 'FETCH_SUCCESS':
      return {
        data: action.payload,
        loading: false,
        error: false,
      };
    case 'FETCH_FAILURE':
      return {
        ...state,
        loading: false,
        error: true,
      };
    case 'LOAD_MORE':
      return {
        ...state,
        data: [...state.data, ...action.payload],
        loading: false,
        error: false,
      };
    default:
      throw new Error();
  }
}

const useDataApi = (initialUrl, initialData = {}) => {
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
          dispatch({ type: 'FETCH_FAILURE' });
        }
      }
    };

    fetchData();

    return () => {
      didCancel = true;
    };
  }, [url]);

  const loadMoreData = () => {
    // dispatch({ type: 'FETCH_INIT' });
    dispatch({ type: 'LOAD_MORE' });
  };

  const doFetch = url => {
    setUrl(url);
  };

  return { ...state, doFetch, loadMoreData };
};

export default useDataApi;
