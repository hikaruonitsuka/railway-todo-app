import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Inner from '../components/Inner';
import Layout from '../components/Layout';
import { url } from '../config';
import '../styles/newList.scss';

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
        <div>
          <main className="new-list">
            <h2>リスト新規作成</h2>
            <p className="error-message">{errorMessage}</p>
            <form className="new-list-form">
              <label>タイトル</label>
              <br />
              <input type="text" onChange={handleTitleChange} className="new-list-title" />
              <br />
              <button type="button" onClick={onCreateList} className="new-list-button">
                作成
              </button>
            </form>
          </main>
        </div>
      </Inner>
    </Layout>
  );
};
