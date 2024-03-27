import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Inner from '../components/Inner';
import Layout from '../components/Layout';
import { url } from '../config';

export const NewList = () => {
  const [cookies] = useCookies();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const handleTitleChange = (e) => setTitle(e.target.value);
  const onCreateList = () => {
    const data = {
      title: title,
    };

    axios
      .post(`${url}/lists`, data, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then(() => {
        navigate('/');
      })
      .catch((err) => {
        setErrorMessage(`リストの作成に失敗しました。${err}`);
      });
  };

  return (
    <Layout>
      <Inner>
        <div className="container">
          <h2>リスト新規作成</h2>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <form className="form-container">
            <div className="form-item-container">
              <div className="form-item">
                <label className="form-label" htmlFor="title">
                  タイトル
                </label>
                <div className="form-input">
                  <input id="title" type="text" onChange={handleTitleChange} />
                </div>
              </div>
            </div>
            <div className="form-button-container">
              <button className="form-button" type="button" onClick={onCreateList}>
                作成
              </button>
            </div>
          </form>
        </div>
      </Inner>
    </Layout>
  );
};
