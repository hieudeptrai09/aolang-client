import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './AoLangIOT.module.scss';
import { request } from '../../../warehouse';

const cx = classNames.bind(styles);

function Season() {
    const [seasons, setSeasons] = useState([]);

    useEffect(() => {
        request.get('information/getSeason.php').then((res) => setSeasons(res));
    }, []);

    return (
        <div>
            {seasons.map((season, index) => (
                <p key={index} className={cx('paragraph')}>
                    {season.map((piece, index) =>
                        piece.href ? (
                            <a
                                key={index}
                                className={cx('link', {
                                    strong: piece.bold === 1,
                                })}
                                target="_blank"
                                href={piece.href}
                            >
                                {piece.content}
                            </a>
                        ) : (
                            <span
                                key={index}
                                className={cx('normal', {
                                    strong: piece.bold === 1,
                                })}
                            >
                                {piece.content}
                            </span>
                        ),
                    )}
                </p>
            ))}
        </div>
    );
}

export default Season;
