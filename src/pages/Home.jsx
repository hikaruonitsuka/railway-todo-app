import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Inner from '../components/Inner';
import Layout from '../components/Layout';
import TaskList from '../components/TaskList';
import { url } from '../config';
import '../styles/home.scss';

export const Home = () => {
  const [lists, setLists] = useState([]);
  const [isDoneDisplay, setIsDoneDisplay] = useState('todo'); // todo->未完了 done->完了
  const [selectListId, setSelectListId] = useState();
  const [tasks, setTasks] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [cookies] = useCookies(); // cookie取得
  const handleIsDoneDisplayChange = (e) => setIsDoneDisplay(e.target.value);

	// リストの取得
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

	// タスクの取得
  useEffect(() => {
		// リストが存在するかどうかをチェック
    const listId = lists[0]?.id;
    if (typeof listId !== 'undefined') {
			// 選択されたリストのIDをセット
      setSelectListId(listId);
			// リストIDと一致するタスクを取得
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

	// リストの切り替え
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
        <div className="home">
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <div className="home-container">
            <div className="home-item-container">
              <div className="home-header">
                <h2>リスト一覧</h2>
                <ul className="home-list-menu">
                  <li>
                    <Link to="/list/new">リスト新規作成</Link>
                  </li>
                  <li>
                    <Link to={`/lists/${selectListId}/edit`}>選択中のリストを編集</Link>
                  </li>
                </ul>
              </div>
              {lists.length > 0 && (
                <div className="list-tab-container">
                  <ul className={`list-tab${lists.length > 3 ? ' -overflow' : ''}`} role="tablist">
                    {lists.map((list, key) => {
                      const isActive = list.id === selectListId;
                      return (
                        <li className="list-tab-item" key={key} role="presentation">
                          <button
                            role="tab"
                            aria-selected={isActive ? 'true' : 'false'}
                            className={`list-tab-button hover ${isActive ? 'active' : ''}`}
                            onClick={() => handleSelectList(list.id)}
                          >
                            <span>{list.title}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
            {lists.length > 0 && (
              <div className="home-item-container">
                <div className="home-header">
                  <h2>タスク一覧</h2>
                  <Link to="/task/new">タスク新規作成</Link>
                </div>
                {tasks && (
                  <div className="tasks-container">
                    <select className="tasks-select form-select" onChange={handleIsDoneDisplayChange}>
                      <option value="todo">未完了</option>
                      <option value="done">完了</option>
                    </select>
                    <TaskList tasks={tasks} selectListId={selectListId} isDoneDisplay={isDoneDisplay} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Inner>
    </Layout>
  );
};
