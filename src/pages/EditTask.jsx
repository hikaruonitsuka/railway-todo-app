import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Inner from '../components/Inner';
import Layout from '../components/Layout';
import { url } from '../config';
import { extractDateTime } from '../utils/extractDateTime';
import { formatDate } from '../utils/formatDate';
import { formatTime } from '../utils/formatTime';

export const EditTask = () => {
  const navigate = useNavigate();
  const { listId, taskId } = useParams();
  const [cookies] = useCookies();

	// フォームの状態管理
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [isDone, setIsDone] = useState();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleDetailChange = (e) => setDetail(e.target.value);
  const handleIsDoneChange = (e) => setIsDone(e.target.value === 'done');
  const handleDateChange = (e) => setDate(e.target.value);
  const handleTimeChange = (e) => setTime(e.target.value);

  // タスクの更新
  const onUpdateTask = () => {
    const { year, month, day, hour, minute } = extractDateTime(date, time);
    const dateObject = new Date(year, month, day, hour, minute);

    const data = {
      title: title,
      detail: detail,
      done: isDone,
      limit: dateObject,
    };

    axios
      .put(`${url}/lists/${listId}/tasks/${taskId}`, data, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then(() => {
        navigate('/');
      })
      .catch((err) => {
        setErrorMessage(`更新に失敗しました。${err}`);
      });
  };

  // タスクの削除
  const onDeleteTask = () => {
    axios
      .delete(`${url}/lists/${listId}/tasks/${taskId}`, {
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

  // 登録されているデータの取得
  useEffect(() => {
    axios
      .get(`${url}/lists/${listId}/tasks/${taskId}`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        const task = res.data;
        setTitle(task.title);
        setDetail(task.detail);
        setDate(formatDate(task.limit));
        setTime(formatTime(task.limit));
        setIsDone(task.done);
      })
      .catch((err) => {
        setErrorMessage(`タスク情報の取得に失敗しました。${err}`);
      });
  }, []);

  return (
    <Layout>
      <Inner>
        <section className="container">
          <h2>タスク編集</h2>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <form className="form-container">
            <div className="form-item-container">
              <div className="form-item">
                <label className="form-label" htmlFor="title">
                  タイトル
                </label>
                <div className="form-input">
                  <input id="title" type="text" onChange={handleTitleChange} value={title} />
                </div>
              </div>
              <div className="form-item">
                <label className="form-label" htmlFor="detail">
                  詳細
                </label>
                <div className="form-input">
                  <textarea id="detail" type="text" onChange={handleDetailChange} value={detail} />
                </div>
              </div>
              <div className="form-item">
                <label className="form-label" htmlFor="limit">
                  期限
                </label>
                <div className="form-date-container">
                  <input id="limit" type="date" value={date} onChange={handleDateChange} />
                  <input type="time" value={time} onChange={handleTimeChange} />
                </div>
              </div>
              <div className="form-item">
                <div className="form-radio-container">
                  <label className="form-radio">
                    <input
                      type="radio"
                      id="todo"
                      name="status"
                      value="todo"
                      onChange={handleIsDoneChange}
                      checked={isDone === false ? 'checked' : ''}
                    />
                    未完了
                  </label>
                  <label className="form-radio">
                    <input
                      type="radio"
                      id="done"
                      name="status"
                      value="done"
                      onChange={handleIsDoneChange}
                      checked={isDone === true ? 'checked' : ''}
                    />
                    完了
                  </label>
                </div>
              </div>
            </div>
            <div className="form-button-container -row">
              <button type="button" className="form-button" onClick={onUpdateTask}>
                更新
              </button>
              <button type="button" className="form-button -delete" onClick={onDeleteTask}>
                削除
              </button>
            </div>
          </form>
        </section>
      </Inner>
    </Layout>
  );
};
