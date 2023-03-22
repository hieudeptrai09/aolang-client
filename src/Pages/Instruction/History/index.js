import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './History.module.scss';
import { images } from '../../../assets';
import { request } from '../../../warehouse';

const cx = classNames.bind(styles);

function History() {
    const [data, setData] = useState([]);
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        request
            .get('/static/getContents.php', {
                params: {
                    filename: 'history',
                },
            })
            .then((res) => {
                setHistory(res);
            });
    }, []);

    useEffect(() => {
        let data = [];
        for (let i = 0; i < history.length; i++)
            for (let j = 0; j < history[i].length; j++) data.push({ data: history[i][j], y: i, x: j });
        setData(data);
    }, [history]);

    return (
        <div className={cx('super-wrapper')}>
            <div className={cx('wrapper')}>
                <div className={cx('spandiv')}>
                    {data.map((event, index) => {
                        return (
                            <span key={index}>
                                <span
                                    style={{
                                        top: event.y * 220 + 70 + 'px',
                                        left:
                                            event.y % 2 === 0
                                                ? event.x * (135 / history[event.y].length) + 'vh'
                                                : (history[event.y].length - event.x - 1) *
                                                      (135 / history[event.y].length) +
                                                  'vh',
                                    }}
                                    className={cx('leaf-wrapper')}
                                >
                                    <img
                                        className={cx('leaf')}
                                        src={images.lotusLeaf}
                                        onMouseOver={(e) => {
                                            let x =
                                                event.y % 2 === 0
                                                    ? event.x * (135 / history[event.y].length)
                                                    : (history[event.y].length - event.x - 1) *
                                                      (135 / history[event.y].length);
                                            setX((x * window.innerHeight) / 100);
                                            setY(event.y * 220 + 70);
                                        }}
                                        alt=""
                                    />
                                    <div
                                        className={cx('event', {
                                            historyTop: event.x % 2 === 1,
                                        })}
                                    >
                                        <h5>{event.data.date}</h5>
                                    </div>
                                </span>
                                <div className={cx('tooltip')} style={{ top: y + 'px', left: x + 'px' }}>
                                    <div className={cx('title-wrapper')}>
                                        <img className={cx('logo')} src={images.lotusLeaf} alt="" />
                                        <h5 className={cx('title')}>{event.data.title}</h5>
                                    </div>
                                    <p className={cx('description')}>{event.data.description}</p>
                                </div>
                            </span>
                        );
                    })}
                </div>
                {history.map((events, index) => {
                    if (index < history.length - 1) {
                        return (
                            <div
                                key={index}
                                className={cx('shelf', {
                                    shelf1: index === 0,
                                    shelf2: index % 2 === 0,
                                    shelf3: index % 2 !== 0,
                                })}
                                style={{ top: index * 220 + 100 + 'px' }}
                            ></div>
                        );
                    } else return <div key={index}></div>;
                })}
            </div>
        </div>
    );
}

export default History;
