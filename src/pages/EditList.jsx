import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Inner from '../components/Inner';
import Layout from '../components/Layout';
import { url } from '../config';

export const EditList = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies();
  const { listId } = useParams();
  const [title, setTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const handleTitleChange = (e) => setTitle(e.target.value);

	// リストの更新
  const onUpdateList = () => {
    const data = {
      title: title,
    };

    axios
      .put(`${url}/lists/${listId}`, data, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then(() => {
        navigate('/');
      })
      .catch((err) => {
        setErrorMessage(`更新に失敗しました。 ${err}`);
      });
  };

	// リストの削除
  const onDeleteList = () => {
    axios
      .delete(`${url}/lists/${listId}`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then(() => {
        navigate('/');
      })
      .catch((err) => {
        setErrorMessage(`削除に失敗しました。${err}`);
      });
  };

	// リストの取得
  useEffect(() => {
    axios
      .get(`${url}/lists/${listId}`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        const list = res.data;
        setTitle(list.title);
      })
      .catch((err) => {
        setErrorMessage(`リスト情報の取得に失敗しました。${err}`);
      });
  }, []);

  return (
    <Layout>
      <Inner>
        <section className="container">
          <h2>リスト編集</h2>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <form className="form-container">
            <div className="form-item-container">
              <div className="form-item">
                <label className="form-label" htmlFor="title">
                  タイトル
                </label>
                <div className="form-input">
                  <input id="title" type="text" value={title} onChange={handleTitleChange} />
                </div>
              </div>
            </div>
            <div className="form-button-container -row">
              <button className="form-button" type="button" onClick={onUpdateList}>
                更新
              </button>
              <button className="form-button -delete" type="button" onClick={onDeleteList}>
                削除
              </button>
            </div>
          </form>
        </section>
      </Inner>
    </Layout>
  );
};
