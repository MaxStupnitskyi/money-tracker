import { ReactComponent as ArrowDown } from '../../../public/img/angle.svg';

import styles from "../AddTransaction.module.sass";

const TransactionItem = ({ label, type, value, onChange, options, placeholder, inputType }) => {
  return (
    <div className={styles.addTransaction__item}>
      <label className={styles.addTransaction__label}>{label}</label>
      {(type === 'select') ? (
        <>
          <select
            className={styles.addTransaction__input}
            value={value}
            onChange={e => onChange(e)}
          >
            {options}
          </select>
          <ArrowDown className={styles.arrow} />
        </>
      ) : (
        <input
          required
          className={styles.addTransaction__input}
          type={inputType}
          value={value}
          placeholder={placeholder}
          onChange={e => onChange(e)}
        />
      )}
    </div>
  );
};

export default TransactionItem;
