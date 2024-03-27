import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { signIn } from '../authSlice';
import Inner from '../components/Inner';
import Layout from '../components/Layout';
import { url } from '../config';
import '../styles/signin.scss';

export const SignIn = () => {
  const auth = useSelector((state) => state.auth.isSignIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState();
  const [, setCookie] = useCookies();
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const onSignIn = () => {
    axios
      .post(`${url}/signin`, { email: email, password: password })
      .then((res) => {
        setCookie('token', res.data.token);
        dispatch(signIn());
        navigate('/');
      })
      .catch((err) => {
        setErrorMessage(`サインインに失敗しました。${err}`);
      });
  };

  if (auth) return <Navigate to="/" />;

  return (
    <Layout>
      <Inner>
        <section className="signin">
          <div className="signin-heading">
            <h2>サインイン</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </div>
          <form className="form-container">
            <div className="form-item-container">
              <div className="form-item">
                <label className="form-label" htmlFor="email">
                  メールアドレス
                </label>
                <div className="form-input">
                  <input id="email" type="email" onChange={handleEmailChange} autoComplete="email" />
                </div>
              </div>
              <div className="form-item">
                <label className="form-label" htmlFor="password">
                  パスワード
                </label>
                <div className="form-input">
                  <input
                    id="password"
                    type="password"
                    onChange={handlePasswordChange}
                    autoCapitalize="current-password"
                  />
                </div>
              </div>
            </div>
            <div className="form-button-container">
              <button className="form-button hover" type="button" onClick={onSignIn}>
                サインイン
              </button>
              <Link to="/signup" aria-label="アカウントを新規作成">新規作成</Link>
            </div>
          </form>
        </section>
      </Inner>
    </Layout>
  );
};
