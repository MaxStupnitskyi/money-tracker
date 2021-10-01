import Calendar from 'react-calendar';
import { useRecoilState, useSetRecoilState, useRecoilValue } from "recoil";

import Transactions from "../Transactions";
import AddTransaction from "../AddTransaction";

import {
  activeStartDate as startDate,
  activeEndDate as endDate,
  filter as stateFilter,
  selectedDate as stateSelectedDate,
  transactions
} from "../../store/store";

import styles from './Today.module.sass';
import 'react-calendar/dist/Calendar.css';
import './Calendar.sass';

const Today = () => {

  const setActiveStartDate = useSetRecoilState(startDate);
  const setActiveEndDate = useSetRecoilState(endDate);
  const setFilter = useSetRecoilState(stateFilter);
  const [selectedDate, setSelectedDate] = useRecoilState(stateSelectedDate);
  const transactionList = useRecoilValue(transactions);

  // Apply day filter or deny it if clicked on selected day
  const onSelectDay = (_day, e) => {
    if (e.currentTarget.classList.contains('react-calendar__tile--active')) {
      setFilter(null);
      e.currentTarget.classList.remove('react-calendar__tile--active');
    } else {
      e.currentTarget.classList.add('react-calendar__tile--active');
      setFilter('date');
    }
  };

  // Deny filter by date when switching month
  const changeMonth = (activeStartDate) => {
    const date = new Date(activeStartDate).setMonth(activeStartDate.getMonth() + 1);
    setActiveStartDate(new Date(activeStartDate).toISOString());
    setActiveEndDate(new Date(date).toISOString());
    setFilter(null);
  };

  // Add mark to days with transactions
  const markActiveDays = (date, view) => {
    const dates = new Set();
    transactionList.forEach(i => {
      dates.add(new Date(i.date).setHours(0, 0, 0, 0));
    });

    return (
      view === 'month' &&
      Array.from(dates).map(i => {
        return new Date(date).getTime() === new Date(new Date(i)).getTime() ? (
          <div className="mark" key={date} />
        ) : null;
      })
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.today}>
        <Calendar
          className="react-calendar"
          minDetail="year"
          showNeighboringMonth={false}
          onChange={date => setSelectedDate(date)}
          onClickDay={(day, e) => onSelectDay(day, e)}
          value={selectedDate}
          onActiveStartDateChange={({ activeStartDate }) => changeMonth(activeStartDate)}
          tileContent={({ date, view }) => markActiveDays(date, view)}
        />
        <div className={styles.today__transactions}>
          <h1 className={styles.title}>Transactions</h1>
          <Transactions />
        </div>
        <AddTransaction
        />
      </div>
    </div>
  );
};

export default Today;
