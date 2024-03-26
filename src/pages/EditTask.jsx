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
import '../styles/editTask.scss';

export const EditTask = () => {
  const navigate = useNavigate();
  const { listId, taskId } = useParams();
  const [cookies] = useCookies();

  // state
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [isDone, setIsDone] = useState();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // イベントハンドラ
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
        <div>
          <main className="edit-task">
            <h2>タスク編集</h2>
            <p className="error-message">{errorMessage}</p>
            <form className="edit-task-form">
              <label>タイトル</label>
              <br />
              <input type="text" onChange={handleTitleChange} className="edit-task-title" value={title} />
              <br />
              <label>詳細</label>
              <br />
              <textarea type="text" onChange={handleDetailChange} className="edit-task-detail" value={detail} />
              <br />
              <label>期限</label>
              <div className="edit-task-datetime-input">
                <input type="date" value={date} onChange={handleDateChange} />
                <input type="time" value={time} onChange={handleTimeChange} />
              </div>
              <div>
                <input
                  type="radio"
                  id="todo"
                  name="status"
                  value="todo"
                  onChange={handleIsDoneChange}
                  checked={isDone === false ? 'checked' : ''}
                />
                未完了
                <input
                  type="radio"
                  id="done"
                  name="status"
                  value="done"
                  onChange={handleIsDoneChange}
                  checked={isDone === true ? 'checked' : ''}
                />
                完了
              </div>
              <button type="button" className="delete-task-button" onClick={onDeleteTask}>
                削除
              </button>
              <button type="button" className="edit-task-button" onClick={onUpdateTask}>
                更新
              </button>
            </form>
          </main>
        </div>
      </Inner>
    </Layout>
  );
};
