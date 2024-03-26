import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import Inner from '../components/Inner';
import Layout from '../components/Layout';
import { url } from '../config';
import '../styles/home.scss';

export const Home = () => {
  const [isDoneDisplay, setIsDoneDisplay] = useState('todo'); // todo->未完了 done->完了
  const [lists, setLists] = useState([]);
  const [selectListId, setSelectListId] = useState();
  const [tasks, setTasks] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [cookies] = useCookies();
  const handleIsDoneDisplayChange = (e) => setIsDoneDisplay(e.target.value);
  useEffect(() => {
    axios
      .get(`${url}/lists`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        setLists(res.data);
      })
      .catch((err) => {
        setErrorMessage(`リストの取得に失敗しました。${err}`);
      });
  }, []);

  useEffect(() => {
    const listId = lists[0]?.id;
    if (typeof listId !== 'undefined') {
      setSelectListId(listId);
      axios
        .get(`${url}/lists/${listId}/tasks`, {
          headers: {
            authorization: `Bearer ${cookies.token}`,
          },
        })
        .then((res) => {
          setTasks(res.data.tasks);
        })
        .catch((err) => {
          setErrorMessage(`タスクの取得に失敗しました。${err}`);
        });
    }
  }, [lists]);

  const handleSelectList = (id) => {
    setSelectListId(id);
    axios
      .get(`${url}/lists/${id}/tasks`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        setTasks(res.data.tasks);
      })
      .catch((err) => {
        setErrorMessage(`タスクの取得に失敗しました。${err}`);
      });
  };

  return (
    <Layout>
      <Inner>
        <div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <div className="home-container">
            <div className="list-container">
              <div className="list-header">
                <h2>リスト一覧</h2>
                <div className="list-menu">
                  <p>
                    <Link to="/list/new">リスト新規作成</Link>
                  </p>
                  <p>
                    <Link to={`/lists/${selectListId}/edit`}>選択中のリストを編集</Link>
                  </p>
                </div>
              </div>
              {lists.length > 0 && (
                <ul className="list-tab" role="tablist">
                  {lists.map((list, key) => {
                    const isActive = list.id === selectListId;
                    return (
                      <li key={key} role="presentation">
                        <button
                          role="tab"
                          aria-selected={isActive ? 'true' : 'false'}
                          className={`list-tab-item hover ${isActive ? 'active' : ''}`}
                          onClick={() => handleSelectList(list.id)}
                        >
                          {list.title}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            <div className="task-container">
              <div className="tasks-header">
                <h2>タスク一覧</h2>
                <Link to="/task/new">タスク新規作成</Link>
              </div>
              <div className="display-select-wrapper">
                <select onChange={handleIsDoneDisplayChange} className="display-select">
                  <option value="todo">未完了</option>
                  <option value="done">完了</option>
                </select>
              </div>
              <Tasks tasks={tasks} selectListId={selectListId} isDoneDisplay={isDoneDisplay} />
            </div>
          </div>
        </div>
      </Inner>
    </Layout>
  );
};

// 表示するタスク
const Tasks = (props) => {
  const { selectListId, isDoneDisplay } = props;

  if (props.tasks === null) return <></>;

  // 現在の日時を取得
  const nowDate = new Date();

  // 日時変換
  const tasks = props.tasks.map((task) => {
    // 現時刻とタスクに設定された日時を比較して残り時間を表示する
    const taskDate = new Date(task.limit);

    // 残り時間をミリ秒で計算
    const remainingMs = taskDate - nowDate;

    // 残り時間が0以下の場合は「期限切れ」とする
    if (remainingMs <= 0) {
      return {
        ...task,
        limit: taskDate.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }),
        remainingTime: '期限切れ',
      };
    }

    // 残り時間を日、時間、分、秒に変換
    const remainingDays = Math.floor(remainingMs / (1000 * 60 * 60 * 24));
    const remainingHours = Math.floor((remainingMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const remainingMinutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
    const remainingSeconds = Math.floor((remainingMs % (1000 * 60)) / 1000);

    // 残り時間を文字列で設定
    const remainingTimeStr = `${remainingDays}日${remainingHours}時間${remainingMinutes}分${remainingSeconds}秒`;
    return {
      ...task,
      limit: taskDate.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }),
      remainingTime: remainingTimeStr,
    };
  });

  if (isDoneDisplay == 'done') {
    return (
      <ul>
        {tasks
          .filter((task) => {
            return task.done === true;
          })
          .map((task, key) => (
            <li key={key} className="task-item">
              <Link to={`/lists/${selectListId}/tasks/${task.id}`} className="task-item-link hover">
                <span className="task-item-label -done">{task.done ? '完了' : '未完了'}</span>
                <span className="task-item-title">{task.title}</span>
                <span className="task-item-limit">期限:{task.limit}</span>
                <span className="task-item-remaining-time">{task.remainingTime}</span>
              </Link>
            </li>
          ))}
      </ul>
    );
  }

  return (
    <ul className="task-list">
      {tasks
        .filter((task) => {
          return task.done === false;
        })
        .map((task, key) => (
          <li key={key} className="task-item">
            <Link to={`/lists/${selectListId}/tasks/${task.id}`} className="task-item-link hover">
              <span className="task-item-label">{task.done ? '完了' : '未完了'}</span>
              <span className="task-item-title">{task.title}</span>
              <span className="task-item-limit">期限:{task.limit}</span>
              <span className="task-item-remaining-time">期限まで残り {task.remainingTime}</span>
            </Link>
          </li>
        ))}
    </ul>
  );
};

Tasks.propTypes = {
  tasks: PropTypes.array,
  selectListId: PropTypes.string,
  isDoneDisplay: PropTypes.oneOf(['todo', 'done']).isRequired,
};
