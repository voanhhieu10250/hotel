import React, { useEffect, useState } from 'react';
// import Cookies from "js-cookie";
import Axios from 'axios';

export const AuthContext = React.createContext();

export const apiInstance = Axios.create({
  baseURL: process.env.REACT_APP_API_ENDPOINT,
});

// const fakeUserData = {
//   id: 1,
//   name: "Jhon Doe",
//   avatar: "",
//   roles: ["USER", "ADMIN"],
// };

/**
 * We have used Fake JWT token from "jwt.io"
 * This is a sample token to show auth is working
 * Your token will come from your server when user successfully loggedIn.
 */

// const fakeToken =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJuYW1lIjoidGFyZXEgam9iYXllcmUiLCJyb2xlcyI6ImFkbWluIn0.k74_B-zeWket405dIAt018mnQFMh_6_BTFpjB77HtRQ";

const addItem = (key, value = '') => {
  /**
   *  Using the local storage code....
   */
  if (key) localStorage.setItem(key, value);

  /**
   *  Using the Cookies code...
   */
  // if (key) Cookies.set(key, value, { expires: 7 });
};

const clearItem = key => {
  /**
   *  Using the local storage code....
   */
  localStorage.removeItem(key);

  /**
   *  Using the Cookies code...
   */
  // Cookies.remove(key);
};

const isValidToken = () => {
  /**
   *  Using the local storage code....
   */
  const token = localStorage.getItem('token');

  /**
   *  Using the Cookies code...
   */
  // const token = Cookies.get('token');
  // JWT decode & check token validity & expiration.
  if (token) {
    setApiAuthorization(token);
    return true;
  }
  return false;
};

const setApiAuthorization = token => {
  apiInstance.defaults.headers.common['Authorization'] = 'Bearer ' + token;
};

const AuthProvider = props => {
  const [loggedIn, setLoggedIn] = useState(isValidToken());
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  // const [loggedOut, setLoggedOut] = useState(true);
  // const [token, setToken] = useState(null);

  useEffect(() => {
    if (loggedIn && !user) {
      getUserInfoByToken();
    }
    // eslint-disable-next-line
  }, []);

  const getUserInfoByToken = async () => {
    try {
      const { data } = await apiInstance.get('user/current-user');

      if (data.status === 200) {
        setUser(data.content);
        setLoggedIn(true);
        console.log(data.content);
      } else {
        setError(
          typeof data.content === 'string' ? data.content : data.content[0]
        );
      }
    } catch (err) {
      console.log(err);

      if (err.response && err.response.data && err.response.data.content)
        setError(
          typeof err.response.data.content === 'string'
            ? err.response.data.content
            : err.response.data.content[0]
        );
      else if (err.response && err.response.data && err.response.data.error)
        setError(err.response.data.error);
      else setError(err.message);
    }
  };

  const signIn = async params => {
    const { username, password } = params;
    /**
     * Make post request here to authenticate with fetch
     * if returns true then change the state
     */
    setError(null);
    try {
      const { data } = await apiInstance.post('auth/login', {
        username,
        password,
      });

      if (data.status === 200) {
        // setToken(data.content);
        addItem('token', data.content);
        setApiAuthorization(data.content);
      } else {
        setError(
          typeof data.content === 'string' ? data.content : data.content[0]
        );
      }

      await getUserInfoByToken();
    } catch (err) {
      console.log(err);

      if (err.response && err.response.data && err.response.data.content)
        setError(
          typeof err.response.data.content === 'string'
            ? err.response.data.content
            : err.response.data.content[0]
        );
      else if (err.response && err.response.data && err.response.data.error)
        setError(err.response.data.error);
      else setError(err.message);
    }
  };

  const signUp = async params => {
    const { username, password, email } = params;

    setError(null);

    try {
      const { data } = await apiInstance.post('user/create-user', {
        email,
        username,
        password,
      });
      console.log(data);

      if (data.status === 200) {
        // setToken(data.content);
        addItem('token', data.content);
        setApiAuthorization(data.content);
      } else {
        setError(
          typeof data.content === 'string' ? data.content : data.content[0]
        );
      }

      await getUserInfoByToken();
    } catch (err) {
      console.log(err);

      if (err.response && err.response.data && err.response.data.content)
        setError(
          typeof err.response.data.content === 'string'
            ? err.response.data.content
            : err.response.data.content[0]
        );
      else if (err.response && err.response.data && err.response.data.error)
        setError(err.response.data.error);
      else setError(err.message);
    }
  };

  // /**
  //  * For 3rd-party Authentication [e.g. Autho0, firebase, AWS etc]
  //  *
  //  */
  // const tokenAuth = (token, user = {}) => {
  //   setUser(user);
  //   setToken(token);
  //   addItem("token", token);
  //   setLoggedIn(true);
  // };

  const forgetPass = params => {
    console.log(params, 'forget password form Props');
  };
  const changePass = params => {
    console.log(params, 'change password form Props');
  };

  const logOut = () => {
    setUser(null);
    // setToken(null);
    clearItem('token');
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        loggedIn,
        logOut,
        signIn,
        signUp,
        forgetPass,
        changePass,
        // tokenAuth,
        user,
        // token,
        error,
        getUserInfoByToken,
      }}
    >
      <>{props.children}</>
    </AuthContext.Provider>
  );
};

export default AuthProvider;
