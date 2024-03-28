import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Inner from '../components/Inner';
import Layout from '../components/Layout';
import { url } from '../config';
import { extractDateTime } from '../utils/extractDateTime';

export const NewTask = () => {
  const [cookies] = useCookies();
  const navigate = useNavigate();
  const [selectListId, setSelectListId] = useState();
  const [lists, setLists] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  // フォームの状態管理
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleDetailChange = (e) => setDetail(e.target.value);
  const handleSelectList = (id) => setSelectListId(id);
  const handleDateChange = (e) => setDate(e.target.value);
  const handleTimeChange = (e) => setTime(e.target.value);

  // タスク作成処理
  const onCreateTask = () => {
    // 指定されているかどうかを分岐
    let dateObject = new Date();
    if (date) {
      const { year, month, day } = extractDateTime(date);
      dateObject = new Date(year, month, day);
    }

    if (date && time) {
      const { year, month, day, hour, minute } = extractDateTime(date, time);
      dateObject = new Date(year, month, day, hour, minute);
    }

    const data = {
      title: title,
      detail: detail,
      done: false,
      limit: dateObject,
    };

    axios
      .post(`${url}/lists/${selectListId}/tasks`, data, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then(() => {
        navigate('/');
      })
      .catch((err) => {
        setErrorMessage(`タスクの作成に失敗しました。${err}`);
      });
  };

  // リスト取得処理
  useEffect(() => {
    axios
      .get(`${url}/lists`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        setLists(res.data);
        setSelectListId(res.data[0]?.id);
      })
      .catch((err) => {
        setErrorMessage(`リストの取得に失敗しました。${err}`);
      });
  }, []);

  return (
    <Layout>
      <Inner>
        <div className="container new-task-container">
          <h2>タスク新規作成</h2>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <form className="form-container">
            <div className="form-item-container">
              <div className="form-item">
                <label className="form-label" htmlFor="list">
                  リスト
                </label>
                <select id="list" className="form-select" onChange={(e) => handleSelectList(e.target.value)}>
                  {lists.map((list, key) => (
                    <option key={key} className="list-item" value={list.id}>
                      {list.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-item">
                <label className="form-label" htmlFor="title">
                  タイトル
                </label>
                <div className="form-input">
                  <input id="title" type="text" onChange={handleTitleChange} />
                </div>
              </div>
              <div className="form-item">
                <label className="form-label" htmlFor="detail">
                  詳細
                </label>
                <div className="form-input">
                  <textarea id="detail" type="text" onChange={handleDetailChange} />
                </div>
              </div>
              <div className="form-item">
                <label className="form-label" htmlFor="limit">
                  期限
                </label>
                <div className="form-date-container">
                  <input id="limit" type="date" onChange={handleDateChange} />
                  <input type="time" onChange={handleTimeChange} />
                </div>
              </div>
            </div>
            <div className="form-button-container">
              <button type="button" className="form-button" onClick={onCreateTask}>
                作成
              </button>
            </div>
          </form>
        </div>
      </Inner>
    </Layout>
  );
};
