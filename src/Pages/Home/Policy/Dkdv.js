import { useEffect, useState } from 'react';
import Header from '../../../Component/Layout/Header';
import { getCookie, request } from '../../../warehouse';
import classNames from 'classnames/bind';
import styles from './Policy.module.scss';

const cx = classNames.bind(styles);

function Dkdv() {
    const [terms, setTerm] = useState([]);

    useEffect(() => {
        request.get('/information/getTermofService.php').then((res) => setTerm(res));
    }, []);

    return (
        <div>
            <Header isLogin={getCookie().islogin} />
            <div className={cx('wrapper')}>
                <h2 className={cx('title')}>ĐIỀU KHOẢN DỊCH VỤ</h2>
                {terms.map((term) =>
                    term.level === 1 ? (
                        <h3 className={cx('subtitle')}>{term.article + '. ' + term.content}</h3>
                    ) : term.level === 2 ? (
                        <p className={cx('subsubtitle')}>
                            <span className={cx('partOfLaw')}>{term.article}</span> {term.content}
                        </p>
                    ) : (
                        <p className={cx('subsubsubtitle')}>
                            <span className={cx('partpartOfLaw')}>{term.article}</span> {term.content}
                        </p>
                    ),
                )}
            </div>
        </div>
    );
}

export default Dkdv;
