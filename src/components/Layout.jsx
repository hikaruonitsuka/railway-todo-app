import PropTypes from 'prop-types';
import { Header } from './Header';
import '../styles/layout.scss';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Header />
      <main className="main">{children}</main>
    </div>
  );
};

// childrenプロパティの型を定義
Layout.propTypes = {
  children: PropTypes.node,
};

export default Layout;
