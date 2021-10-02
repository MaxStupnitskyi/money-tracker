import classNames from 'classnames';

import styles from '../Report.module.sass';
import { useEffect, useState } from 'react';

const ReportType = ({ value, title, width: w, onSelected }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => setWidth(w), [w]);
  return (
    <button
      onClick={onSelected}
      className={classNames(styles.report__block, styles[title.toLowerCase()])}
      style={{ width: `${width}%` }}
    >
      <div>{title}</div>
      <div>{value}</div>
    </button>
  );
};

export default ReportType;
