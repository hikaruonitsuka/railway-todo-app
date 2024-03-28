import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import { signIn } from '../authSlice';
import Inner from '../components/Inner';
import Layout from '../components/Layout';
import { url } from '../config';
import '../styles/signUp.scss';

export const SignUp = () => {
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth.isSignIn); // Reduxを利用してサインインしているかどうかを真偽値として取得
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState();
  const [, setCookie] = useCookies();

  // 入力内容の状態管理
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleNameChange = (e) => setName(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  // 新規登録処理
  const onSignUp = () => {
    // 入力された情報をdataオブジェクトに保管
    const data = {
      email: email,
      name: name,
      password: password,
    };

    axios
      .post(`${url}/users`, data)
      .then((res) => {
        const token = res.data.token;
        dispatch(signIn());
        setCookie('token', token); // cookieに保存
        navigate('/');
      })
      .catch((err) => {
        setErrorMessage(`サインアップに失敗しました。 ${err}`);
      });

    // 認証済みの場合リダイレクト
    if (auth) return <Navigate to="/" />;
  };
  return (
    <div>
      <Layout>
        <Inner>
          <section className="signup">
            <div className="signup-heading">
              <h2>新規作成</h2>
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
                  <label className="form-label" htmlFor="username">
                    ユーザ名
                  </label>
                  <div className="form-input">
                    <input id="username" type="text" onChange={handleNameChange} autoComplete="username" />
                  </div>
                </div>
                <div className="form-item">
                  <label className="form-label" htmlFor="password">
                    パスワード
                  </label>
                  <div className="form-input">
                    <input id="password" type="password" onChange={handlePasswordChange} autoComplete="new-password" />
                  </div>
                </div>
              </div>
              <div className="form-button-container">
                <button className="form-button" type="button" onClick={onSignUp}>
                  作成
                </button>
              </div>
            </form>
          </section>
        </Inner>
      </Layout>
    </div>
  );
};
