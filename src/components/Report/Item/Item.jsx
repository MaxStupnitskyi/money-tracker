import classNames from 'classnames';
import { useEffect, useState } from 'react';

import styles from '../Report.module.sass';

const Item = ({ cat, showDetail, width: w }) => {
  const [width, setWidth] = useState(0);
  useEffect(() => setWidth(w), [w]);

  return (
    <div
      className={classNames(styles.report__block, {
        [styles.incomes]: showDetail === 'incomes',
        [styles.expenses]: showDetail === 'expenses',
      })}
      style={{ width: `${width}%` }}
    >
      <div>{cat[0]}</div>
      <div>{String(cat[1]).includes('.') ? cat[1].toFixed(2) : cat[1]}</div>
    </div>
  );
};

export default Item;
