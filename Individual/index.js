import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import classnames from 'classnames/bind';
import styles from './Individual.module.scss';
import MaxPoint from './MaxPoint';
import PendingQuestion from './PendingQuestion';
import Report from './Report';
import config from '../../config';

const cx = classnames.bind(styles);

function Individual() {
    const [mode, setMode] = useState(0);
    const [children, setChildren] = useState();

    useEffect(() => {
        if (mode > 0) {
            document.getElementById('btn-' + mode).classList.add(styles.active);
            for (let i = 1; i <= 3; i++)
                if (i !== mode) document.getElementById('btn-' + i).classList.remove(styles.active);
        }
        switch (mode) {
            case 1:
                setChildren(<MaxPoint />);
                break;
            case 2:
                setChildren(<PendingQuestion />);
                break;
            case 3:
                setChildren(<Report />);
                break;
        }
    }, [mode]);

    return (
        <div>
            <Link to={config.routes.home} className={cx('to-home')}>
                <FontAwesomeIcon icon={faHouse} />
            </Link>
            <header className={cx('header-wrapper')}>
                <button className={cx('header-item')} id="btn-1" onClick={() => setMode(1)}>
                    Điểm cao nhất
                </button>
                <button className={cx('header-item')} id="btn-2" onClick={() => setMode(2)}>
                    Câu hỏi đã đóng góp
                </button>
                <button className={cx('header-item')} id="btn-3" onClick={() => setMode(3)}>
                    Báo cáo đã gửi
                </button>
            </header>
            {children}
        </div>
    );
}

export default Individual;
