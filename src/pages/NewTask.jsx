import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Inner from '../components/Inner';
import Layout from '../components/Layout';
import { url } from '../config';
import { extractDateTime } from '../utils/extractDateTime';
import '../styles/newTask.scss';

export const NewTask = () => {
  const [cookies] = useCookies();
  const navigate = useNavigate();
  const [selectListId, setSelectListId] = useState();

  // States
  const [lists, setLists] = useState([]);
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // イベントハンドラ
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
        <div>
          <main className="new-task">
            <h2>タスク新規作成</h2>
            <p className="error-message">{errorMessage}</p>
            <form className="new-task-form">
              <label>リスト</label>
              <br />
              <select onChange={(e) => handleSelectList(e.target.value)} className="new-task-select-list">
                {lists.map((list, key) => (
                  <option key={key} className="list-item" value={list.id}>
                    {list.title}
                  </option>
                ))}
              </select>
              <br />
              <label>タイトル</label>
              <br />
              <input type="text" onChange={handleTitleChange} className="new-task-title" />
              <br />
              <label>詳細</label>
              <br />
              <textarea type="text" onChange={handleDetailChange} className="new-task-detail" />
              <br />
              <label>期限</label>
              <div className="new-task-datetime-input">
                <input type="date" onChange={handleDateChange} />
                <input type="time" onChange={handleTimeChange} />
              </div>
              <button type="button" className="new-task-button" onClick={onCreateTask}>
                作成
              </button>
            </form>
          </main>
        </div>
      </Inner>
    </Layout>
  );
};
