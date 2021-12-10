import React from 'react';
import styles from '../styles/Loader.module.scss';

const Loader = ({ style, message }: { style?: any; message?: string }) => {
  const renderBars = () => {
    const bars = [];
    for (let i = 0; i < 12; i = i + 1) {
      const style = {
        animationDelay: 'none',
        transform: 'none',
      };
      style.animationDelay = `${(i - 12) / 10}s`;
      style.transform = `rotate(${i * 30}deg) translate(146%)`;
      bars.push(<div className={styles.loaderbar} style={style} key={i} />);
    }
    return bars;
  };

  return (
    <div className={styles.loader} style={style}>
      <div className={styles.loaderbars}>{renderBars()}</div>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};

export default Loader;
