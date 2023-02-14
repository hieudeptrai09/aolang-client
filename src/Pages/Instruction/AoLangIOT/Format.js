import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './AoLangIOT.module.scss';
import { request } from '../../../warehouse';

const cx = classNames.bind(styles);

function Format() {
    const [format, setFormat] = useState([]);

    useEffect(() => {
        request.get('/information/getFormat.php').then((res) => {
            setFormat(res);
        });
    }, []);

    return (
        <div>
            {format.map((term, index) => {
                return term.type === 'paragraph' ? (
                    <p key={index} className={cx('paragraph')}>
                        {term.content.map((piece, index) =>
                            piece.href ? (
                                <a
                                    className={cx('link', {
                                        strong: piece.bold === 1,
                                    })}
                                    target="_blank"
                                    href={piece.href}
                                    key={index}
                                >
                                    {piece.content}
                                </a>
                            ) : (
                                <span
                                    className={cx('normal', {
                                        strong: piece.bold === 1,
                                    })}
                                    key={index}
                                >
                                    {piece.content}
                                </span>
                            ),
                        )}
                    </p>
                ) : (
                    <ul>
                        {term.content.map((piece, index) => (
                            <li className={cx('paragraph', 'li')} key={index}>
                                {piece.map((smallPiece, index) =>
                                    smallPiece[0].img ? (
                                        <p className={cx('image-wrapper')} key={index}>
                                            <img className={cx('image')} src={smallPiece[0].img} alt="" />
                                        </p>
                                    ) : (
                                        <p>
                                            {smallPiece.map((supersmallpiece, index) => (
                                                <span
                                                    className={cx('normal', {
                                                        strong: supersmallpiece.bold === 1,
                                                    })}
                                                    key={index}
                                                >
                                                    {supersmallpiece.content}
                                                </span>
                                            ))}
                                        </p>
                                    ),
                                )}
                            </li>
                        ))}
                    </ul>
                );
            })}
        </div>
    );
}

export default Format;
