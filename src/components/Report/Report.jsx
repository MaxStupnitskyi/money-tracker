import { useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import {
  activeStartDate as stateActiveStartDate,
  activeEndDate as stateActiveEndDate,
  transactions as stateTransactions
} from '../../store/store';

import ReportType from './ReportType';
import Item from './Item';

import { ReactComponent as Arrow } from '../../public/img/angle.svg';

import styles from './Report.module.sass';

const Report = () => {

  const [activeStartDate, setActiveStartDate] = useRecoilState(stateActiveStartDate);
  const [activeEndDate, setActiveEndDate] = useRecoilState(stateActiveEndDate);
  const transactions = useRecoilValue(stateTransactions);
  const [showDetail, setShowDetail] = useState(null);

  const renderDetail = (cats) => {
    const uniqueCategories = {};
    cats.forEach(cat => {
      uniqueCategories.hasOwnProperty(cat.cat)
        ? (uniqueCategories[cat.cat] += Math.abs(cat.price))
        : (uniqueCategories[cat.cat] = Math.abs(cat.price));
    });

    const sortedCategories = Object.entries(uniqueCategories).sort(
      (a, b) => Math.abs(b[1]) - Math.abs(a[1])
    );

    const html = sortedCategories.map(cat => {
      const width =
        cat[1] === sortedCategories[0][1]
          ? 100
          : (Math.abs(cat[1]) * 100) / Math.abs(sortedCategories[0][1]);
      return (
        <Item cat={cat} width={width} showDetail={showDetail} key={cat[0]} />
      );
    });
    return <div>{html}</div>;
  };

  const showBudget = (type) => {
    let moves = transactions;
    moves = moves.filter(move => {
      return (
        move.date >= activeStartDate &&
        move.date < new Date(activeEndDate).toISOString()
      );
    });

    return type === 'expenses'
      ? moves.filter(move => move.price < 0)
      : moves.filter(move => move.price > 0);
  };

  const setDetail = (cats) => {
    if (!cats.length > 0) return;
    setShowDetail(cats[0].price > 0 ? 'incomes' : 'expenses');
  };

  const backToOverall = () => setShowDetail(null);

  const expenses = showBudget('expenses');
  const incomes = showBudget('incomes');

  const expensesSum = Number(
    expenses.reduce((sum, move) => sum + Math.abs(move.price), 0).toFixed(2)
  );
  const incomesSum = Number(
    incomes.reduce((sum, move) => sum + Math.abs(move.price), 0).toFixed(2)
  );

  let incomesWidth = 50,
    expensesWidth = 50;
  if (incomesSum > expensesSum) {
    [incomesWidth, expensesWidth] = [100, (expensesSum * 100) / incomesSum];
  }
  if (incomesSum < expensesSum) {
    [incomesWidth, expensesWidth] = [(incomesSum * 100) / expensesSum, 100];
  }

  return (
    <div className={styles.container}>
      <div className={styles.dates}>
        <input
          type="date"
          value={activeStartDate.slice(0, 10)}
          onChange={e => setActiveStartDate(new Date(e.target.value).toISOString())}
        />
        <span>—</span>
        <input
          type="date"
          value={activeEndDate.slice(0, 10)}
          min={activeStartDate.slice(0, 10)}
          onChange={e => setActiveEndDate(new Date(new Date(e.target.value).setHours(23, 59, 59, 999)).toISOString())}
        />
      </div>
      <div>
        {!showDetail && (
          <>
            <ReportType
              title="Incomes"
              value={incomesSum}
              width={incomesWidth || 0}
              onSelected={() => setDetail(incomes)}
            />
            <ReportType
              onSelected={() => setDetail(expenses)}
              title="Expenses"
              value={expensesSum}
              width={expensesWidth || 0}
            />
          </>
        )}

        {showDetail === 'incomes' && (
          <>
            <button onClick={() => backToOverall()} className={styles.back}>
              <Arrow className={styles.backIcon} />
            </button>
            {renderDetail(incomes)}
          </>
        )}

        {showDetail === 'expenses' && (
          <>
            <button onClick={() => backToOverall()} className={styles.back}>
              <Arrow className={styles.backIcon} />
            </button>
            {renderDetail(expenses)}
          </>
        )}
      </div>
    </div>
  );
};

export default Report;
