/**
 * UTC標準時間を受け取り、指定されたタイムゾーン（デフォルトはAsia/Tokyo）で年月日を「yyyy-mm-dd」形式で返す関数。
 *
 * @param {Date | string} limit - 日付を表すDateオブジェクトまたは日付の文字列。
 * @returns {string} 年月日を「yyyy-mm-dd」形式で表した文字列。
 */
export const formatDate = (limit) => {
  const date = new Date(limit);
  const optionsDate = { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Tokyo' };
  return new Intl.DateTimeFormat('ja-JP', optionsDate).format(date).replace(/\//g, '-');
};
