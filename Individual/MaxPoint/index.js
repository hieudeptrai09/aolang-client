import { useState, useEffect } from 'react';
import { getCookie, request } from '../../../warehouse';
import classNames from 'classnames/bind';
import styles from './MaxPoint.module.scss';

const cx = classNames.bind(styles);

function MaxPoint() {
    const [mode, setMode] = useState('');
    const [searched, setSearched] = useState(false);
    const [triggered, setTriggered] = useState(false);
    const ids = ['marathon', 'hurdling', 'calculaphobia'];
    const [points, setPoints] = useState([]);
    const [times, setTimes] = useState([]);

    useEffect(() => {
        if (mode !== '') {
            document.getElementById(mode).classList.add(styles.active);
            for (let i = 0; i < ids.length; i++)
                if (ids[i] !== mode) document.getElementById(ids[i]).classList.remove(styles.active);
            request
                .get('/iotuser/getListIndividualMaxPoints.php', {
                    params: {
                        type: mode,
                        uid: getCookie()['uid'],
                    },
                })
                .then((res) => {
                    if (res.length > 0) setPoints(JSON.parse(res[0][mode]));
                    else setPoints([]);
                    if (res.length > 0) setTimes(JSON.parse(res[0][mode + '_time']));
                    else setTimes([]);
                });
        }
    }, [triggered]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('btn-wrapper')}>
                <button
                    id="marathon"
                    className={cx('btn')}
                    onClick={() => {
                        setMode('marathon');
                        setSearched(true);
                        setTriggered(!triggered);
                    }}
                >
                    Marathon mode
                </button>
                <button
                    id="hurdling"
                    className={cx('btn')}
                    onClick={() => {
                        setMode('hurdling');
                        setSearched(true);
                        setTriggered(!triggered);
                    }}
                >
                    Hurdling mode
                </button>
                <button
                    id="calculaphobia"
                    className={cx('btn')}
                    onClick={() => {
                        setMode('calculaphobia');
                        setSearched(true);
                        setTriggered(!triggered);
                    }}
                >
                    Calculaphobia mode
                </button>
            </div>
            <table className={cx('table')}>
                <tbody>
                    {searched &&
                        (points.length > 0 ? (
                            points.map((point, index) => {
                                return (
                                    <tr key={index} className={cx('table-row')}>
                                        <td>{new Date(times[index]).toLocaleString()}</td>
                                        <td className={cx('point')}>{point}</td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr className={cx('no-data-row')}>
                                <td>Hiện chưa có bảng xếp hạng ở mode này trong cơ sở dữ liệu</td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
}

export default MaxPoint;
