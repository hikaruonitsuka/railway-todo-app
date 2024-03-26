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
        <div className="signin">
          <h2>サインイン</h2>
          <p className="error-message">{errorMessage}</p>
          <form className="signin-form">
            <label className="email-label">メールアドレス</label>
            <br />
            <input type="email" className="email-input" onChange={handleEmailChange} />
            <br />
            <label className="password-label">パスワード</label>
            <br />
            <input type="password" className="password-input" onChange={handlePasswordChange} />
            <br />
            <button type="button" className="signin-button" onClick={onSignIn}>
              サインイン
            </button>
          </form>
          <Link to="/signup">新規作成</Link>
        </div>
      </Inner>
    </Layout>
  );
};
