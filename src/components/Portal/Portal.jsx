import ReactDOM from 'react-dom';
import { useEffect, useState } from 'react';

const Portal = ({ children, className }) => {
  const [root, setRoot] = useState(null);

  useEffect(() => {
    const item = document.createElement('div');
    document.body.appendChild(item);
    className && item.classList.add(className);

    setRoot(item);

    return function close() {
      document.body.removeChild(item);
    };
  }, []);

  return (
    root && ReactDOM.createPortal(children, root)
  );
};

export default Portal;
