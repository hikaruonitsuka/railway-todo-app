/**
 * UTC標準時間を受け取り、指定されたタイムゾーン（デフォルトはAsia/Tokyo）で時間を「HH:mm」形式で返す関数。
 *
 * @param {Date | string} limit - 日付を表すDateオブジェクトまたは日付の文字列。
 * @returns {string} 時間を「HH:mm」形式で表した文字列。
 */
export const formatTime = (limit) => {
  const date = new Date(limit);
  const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Tokyo' };
  return new Intl.DateTimeFormat('ja-JP', optionsTime).format(date);
};
