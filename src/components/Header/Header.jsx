import { NavLink } from "react-router-dom";

import { activeStartDate, activeEndDate } from '../../store/store';

import styles from './Header.module.sass';
import { useSetRecoilState } from 'recoil';

const Header = () => {

  const setStartDate = useSetRecoilState(activeStartDate);
  const setEndDate = useSetRecoilState(activeEndDate);

  const setCurrentMonth = () => {
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).setHours(23, 59, 59, 999);
    setStartDate(new Date(firstDay).toISOString());
    setEndDate(new Date(lastDay).toISOString());
  };

  return (
    <div className={styles.header}>
      <nav className={styles.nav}>
        <NavLink className={styles.nav__item} activeClassName={styles.selected} to="/" onClick={() => setCurrentMonth()} exact>
          Today
        </NavLink>
        <NavLink className={styles.nav__item} activeClassName={styles.selected} onClick={() => setCurrentMonth()} to="/balance">
          Balance
        </NavLink>
        <NavLink className={styles.nav__item} activeClassName={styles.selected} onClick={() => setCurrentMonth()} to="/budget">
          Budget
        </NavLink>
        <NavLink className={styles.nav__item} activeClassName={styles.selected} onClick={() => setCurrentMonth()} to="/report">
          Report
        </NavLink>
      </nav>
    </div>
  );
};

export default Header;

