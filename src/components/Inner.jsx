import PropTypes from 'prop-types';
import '../styles/inner.scss';

const Inner = ({ children }) => {
  return <div className="inner">{children}</div>;
};

// childrenプロパティの型を定義
Inner.propTypes = {
  children: PropTypes.node,
};

export default Inner;
