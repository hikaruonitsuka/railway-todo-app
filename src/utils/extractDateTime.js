/**
 * 日付と時間の文字列から年、月、日を数値として抽出する
 * 時間の文字列は任意で、提供されない場合は時と分は返さない
 *
 * @param {string} dateString - "YYYY-MM-DD"形式の日付文字列
 * @param {string} [timeString] - "HH:MM"形式の時間文字列（任意）
 * @returns {Object} 年、月（0から始まる）、日、時、分（timeStringがある場合）をプロパティとするオブジェクト
 */
export const extractDateTime = (dateString, timeString) => {
  const [year, month, day] = dateString.split('-').map((num) => parseInt(num, 10));
  // 月の調整（Dateオブジェクトの仕様上0から始まるため、1を引く）
  const adjustedMonth = month - 1;

  // timeStringが提供されていない場合、時と分を含まないオブジェクトを返す
  if (timeString === undefined) {
    return { year, month: adjustedMonth, day };
  }

  const [hour, minute] = timeString.split(':').map((num) => parseInt(num, 10));

  // 時と分を含むオブジェクトを返す
  return { year, month: adjustedMonth, day, hour, minute };
};
