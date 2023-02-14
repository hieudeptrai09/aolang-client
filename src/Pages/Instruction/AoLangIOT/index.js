import { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './AoLangIOT.module.scss';
import Season from './Season';
import Format from './Format';

const cx = classNames.bind(styles);

function AoLangIOT() {
    const [category, setCategory] = useState(1);

    return (
        <div>
            <div className={cx('btn-wrapper')}>
                <button
                    className={cx('btn', {
                        active: category === 1,
                    })}
                    onClick={() => setCategory(1)}
                >
                    Các mùa giải
                </button>
                <button
                    className={cx('btn', {
                        active: category === 2,
                    })}
                    onClick={() => setCategory(2)}
                >
                    Format chơi
                </button>
            </div>
            <div>{category === 1 ? <Season /> : <Format />}</div>
        </div>
    );
}

export default AoLangIOT;
