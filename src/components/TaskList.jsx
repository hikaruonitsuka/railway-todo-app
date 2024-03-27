import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const TaskList = ({ tasks, selectListId, isDoneDisplay }) => {
  // 現在の日時を取得
  const nowDate = new Date();

  // タスクの日時変換と残り時間の計算
  const updatedTasks = tasks.map((task) => {
    // 現時刻とタスクに設定された日時を比較して残り時間を表示する
    const taskDate = new Date(task.limit);
    // 残り時間をミリ秒で計算
    const remainingMs = taskDate - nowDate;
    let remainingTime;

    if (remainingMs <= 0) {
      // 残り時間が0以下の場合は「期限切れ」とする
      remainingTime = '期限切れ';
    } else {
      // 残り時間を日、時間、分、秒に変換
      const remainingDays = Math.floor(remainingMs / (1000 * 60 * 60 * 24));
      const remainingHours = Math.floor((remainingMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const remainingMinutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
      const remainingSeconds = Math.floor((remainingMs % (1000 * 60)) / 1000);
      remainingTime = `${remainingDays}日${remainingHours}時間${remainingMinutes}分${remainingSeconds}秒`;
    }

    return {
      ...task,
      limit: taskDate.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }),
      remainingTime,
    };
  });

  // タスクのフィルタリング条件を動的に設定
  const filteredTasks = updatedTasks.filter((task) => (isDoneDisplay === 'done' ? task.done : !task.done));

  return (
    <ul className="task-list">
      {filteredTasks.map((task, key) => (
        <li key={key} className="task-item">
          <Link to={`/lists/${selectListId}/tasks/${task.id}`} className="task-item-link hover">
            <div className="task-item-upper">
              <span className={`task-item-label${task.done ? ' -done' : ''}`}>{task.done ? '完了' : '未完了'}</span>
              <span className="task-item-title">{task.title}</span>
            </div>
            <div className="task-item-lower">
              <span className="task-item-limit">期限:{task.limit}</span>
              <span className="task-item-remaining-time">期限まで残り {task.remainingTime}</span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;

TaskList.propTypes = {
  tasks: PropTypes.array,
  selectListId: PropTypes.string,
  isDoneDisplay: PropTypes.oneOf(['todo', 'done']).isRequired,
};
