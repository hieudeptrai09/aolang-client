import Header from '../../../Component/Layout/Header';
import { getCookie, request } from '../../../warehouse';
import classNames from 'classnames/bind';
import styles from './Policy.module.scss';
import { useEffect, useState } from 'react';

const cx = classNames.bind(styles);

function Csqdt() {
    const [terms, setTerms] = useState([]);

    useEffect(() => {
        request.get('/information/getPublicPolicy.php').then((res) => setTerms(res));
    }, [terms]);

    return (
        <div>
            <Header isLogin={getCookie().islogin} />
            <div className={cx('wrapper')}>
                <h2 className={cx('title')}>CHÍNH SÁCH QUYỀN RIÊNG TƯ</h2>
                {terms.map((term) =>
                    term.level === 1 ? (
                        <h3 className={cx('subtitle')}>{term.content}</h3>
                    ) : (
                        <p className={cx('subsubtitle')}>{term.content}</p>
                    ),
                )}
            </div>
        </div>
    );
}

export default Csqdt;
