import classNames from 'classnames/bind';
import styles from './MaxPoint.module.scss';
import Header from '../../Component/Layout/Header';
import { images } from '../../assets';
import { getCookie, request } from '../../warehouse';
import { useNavigate } from 'react-router-dom';
import config from '../../config';
import { Fragment, useEffect, useState } from 'react';

const cx = classNames.bind(styles);

function MaxPoint() {
    const navigate = useNavigate();

    const [mode, setMode] = useState('aolang');
    const [tagId, setTagId] = useState(0);
    const [tags, setTags] = useState([]);
    const [points, setPoints] = useState([]);
    const [firstDay, setFirstDay] = useState();
    const [lastDay, setLastDay] = useState();

    useEffect(() => {
        request
            .get('/tag/getListTags.php', {
                params: {
                    mode: mode,
                },
            })
            .then((res) => {
                setTags(res);
                setTagId(res[0].id);
            });
    }, [mode]);

    useEffect(() => {
        const link = mode === 'aolang' ? '/maxpoint/getListAoMaxPoints.php' : '/maxpoint/getListMaxPoints.php';

        const date = new Date();
        let firstTime = date;
        if (date.getDay() === 0) {
            firstTime = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 6, 0, 0, 0, 0);
        } else {
            firstTime = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + 1, 0, 0, 0, 0);
        }
        setFirstDay(firstTime.toLocaleDateString('fr-BE'));
        setLastDay(new Date(firstTime.getTime() + 86400000 * 7 - 1).toLocaleDateString('fr-BE'));

        request
            .get(link, {
                params: {
                    tagId: tagId,
                    firstTime: firstTime.getTime(),
                },
            })
            .then((res) => {
                setPoints(res);
            });
    }, [tagId]);

    if (getCookie().islogin || getCookie().dxnlcm !== undefined) {
        return (
            <div>
                <Header isLogin />
                <div className={cx('logo-wrapper')}>
                    <div className={cx('logo-item-wrapper', { 'mode-active': mode === 'marathon' })}>
                        <img className={cx('logo-mode')} src={images.marathon} alt="" />
                        <button
                            className={cx('logo-link', { 'mode-active': mode === 'marathon' })}
                            onClick={() => {
                                setMode('marathon');
                                setPoints([]);
                            }}
                        >
                            Marathon
                        </button>
                    </div>
                    <div className={cx('logo-item-wrapper', { 'mode-active': mode === 'hurdling' })}>
                        <img className={cx('logo-mode')} src={images.hurdling} alt="" />
                        <button
                            className={cx('logo-link', { 'mode-active': mode === 'hurdling' })}
                            onClick={() => {
                                setMode('hurdling');
                                setPoints([]);
                            }}
                        >
                            Hurdling
                        </button>
                    </div>
                    <div className={cx('logo-item-wrapper', { 'mode-active': mode === 'calculaphobia' })}>
                        <img className={cx('logo-mode')} src={images.calculaphobia} alt="" />
                        <button
                            className={cx('logo-link', { 'mode-active': mode === 'calculaphobia' })}
                            onClick={() => {
                                setMode('calculaphobia');
                                setPoints([]);
                            }}
                        >
                            Calculaphobia
                        </button>
                    </div>
                    <div className={cx('logo-item-wrapper', { 'mode-active': mode === 'deciphering' })}>
                        <img className={cx('logo-mode')} src={images.deciphering} alt="" />
                        <button
                            className={cx('logo-link', { 'mode-active': mode === 'deciphering' })}
                            onClick={() => {
                                setMode('deciphering');
                                setPoints([]);
                            }}
                        >
                            Deciphering
                        </button>
                    </div>
                    <div className={cx('logo-item-wrapper', { 'mode-active': mode === 'vocab' })}>
                        <img className={cx('logo-mode')} src={images.vocab} alt="" />
                        <button
                            className={cx('logo-link', { 'mode-active': mode === 'vocab' })}
                            onClick={() => {
                                setMode('vocab');
                                setPoints([]);
                            }}
                        >
                            Vocaboostery
                        </button>
                    </div>
                    <div className={cx('logo-item-wrapper', { 'mode-active': mode === 'aolang' })}>
                        <img className={cx('logo-mode')} src={images.iot} alt="" />
                        <button
                            className={cx('logo-link', { 'mode-active': mode === 'aolang' })}
                            onClick={() => {
                                setMode('aolang');
                                setPoints([]);
                            }}
                        >
                            AOLANG IOT
                        </button>
                    </div>
                </div>
                {mode.length > 0 && (
                    <div className={cx('body-wrapper')}>
                        <div className={cx('sidebar')}>
                            {tags.map((tag, index) => (
                                <button
                                    className={cx('sidebar-item', 'mode-btn', {
                                        'tag-active': tag.id === tagId,
                                    })}
                                    onClick={() => setTagId(tag.id)}
                                    key={tag.id}
                                >
                                    <img className={cx('logo-ao')} src={images[mode]} alt="" />
                                    <div>
                                        <h5 className={cx('edition')}>{tag.mode.toUpperCase() + (index + 1)}</h5>
                                        <p className={cx('edition-name')}>{tag.tagname.toUpperCase()}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                        <div>
                            {mode !== 'aolang' && (
                                <p className={cx('title')}>
                                    BẢNG XẾP HẠNG TUẦN {firstDay} - {lastDay}
                                </p>
                            )}
                            <table className={cx('rank-table')}>
                                <thead className={cx('rank-header-wrapper')}>
                                    <tr className={cx('rank-header-info')}>
                                        <td></td>
                                        <td>Tài khoản</td>
                                        <td>Họ và tên</td>
                                        <td>Số điểm</td>
                                        {mode === 'aolang' ? <td>Đạt được ở trận</td> : <td>Đạt được vào lúc</td>}
                                    </tr>
                                    <tr className={cx('gap1')}>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                </thead>
                                <tbody className={cx('rank-body-wrapper')}>
                                    {points.map((point, index) => (
                                        <Fragment key={point.id}>
                                            <tr className={cx('rank-body-row')}>
                                                <td className={cx('stt')}>{index + 1}</td>
                                                <td className={cx('rank-body', 'first-rank-body')}>{point.username}</td>
                                                <td className={cx('rank-body')}>{point.fullname}</td>
                                                <td className={cx('rank-body', 'point')}>{point.maxpoint}</td>
                                                {mode === 'aolang' ? (
                                                    <td className={cx('rank-body', 'last-rank-body')}>
                                                        {'AOLANG' + (tagId - 24) + '-' + ('000' + point.game).slice(-3)}
                                                    </td>
                                                ) : (
                                                    <td className={cx('rank-body', 'last-rank-body')}>
                                                        {new Date(Number.parseInt(point.time)).toLocaleString('fr-BE')}
                                                    </td>
                                                )}
                                            </tr>
                                            <tr className={cx('gap2')}>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        </Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        );
    } else {
        navigate(config.routes.login);
    }
}

export default MaxPoint;
