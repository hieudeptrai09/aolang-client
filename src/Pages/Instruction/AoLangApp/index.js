import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { request } from '../../../warehouse';
import styles from './AoLangApp.module.scss';

const cx = classNames.bind(styles);

function AoLangApp() {
    const [manual, setManual] = useState([]);

    useEffect(() => {
        request.get('/information/getManual.php').then((res) => {
            setManual(res);
        });
    }, []);

    return (
        <div className={cx('content-wrapper')}>
            {manual.map((term, index) =>
                term[0].img ? (
                    <p className={cx('image-title')} key={index}>
                        <img className={cx('image')} src={term[0].img} alt="" />
                    </p>
                ) : (
                    <p key={index} className={cx('paragraph')}>
                        {term.map((piece, index) => (
                            <span
                                key={index}
                                className={cx('normal', {
                                    bold: piece.bold === 1,
                                    underlined: piece.underlined === 1,
                                    margin: piece.margin === 1,
                                })}
                            >
                                {piece.content}
                            </span>
                        ))}
                    </p>
                ),
            )}
        </div>
    );
}

export default AoLangApp;
