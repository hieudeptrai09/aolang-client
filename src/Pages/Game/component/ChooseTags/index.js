import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './ChooseTags.module.scss';
import { getCookie, request } from '../../../../warehouse';
import Starting from '../../Starting';
import Deciphering from '../../Deciphering';
import Vocab from '../../Vocab';
import Finish from '../../Finish';
import MentalCalculating from '../../MentalCalculating';
import { images } from '../../../../assets';
import Header from '../../../../Component/Layout/Header';
import { useNavigate } from 'react-router-dom';
import config from '../../../../config';
import Popup from 'reactjs-popup';

const cx = classNames.bind(styles);

function ChooseTags() {
    const [tags, setTags] = useState([]);
    const [boughtTags, setBoughtTags] = useState([]);
    const [lockTags, setLockTags] = useState([]);
    const [lotus, setLotus] = useState(0);
    const [mode, setMode] = useState('');
    const [choseTags, setChoseTags] = useState(0);
    const [award, setAward] = useState(0);
    const [totalQuestion, setTotalQuestion] = useState(0);
    const [result, setResult] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const params = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        });
        setMode(params.mode);
        if (params.mode !== 'deciphering') setTotalQuestion(-1);
        request
            .get('/tag/getListTags.php', {
                params: {
                    mode: params.mode,
                },
            })
            .then((res) => {
                for (let i = 0; i < res.length; i++) {
                    if (!res[i].coin) {
                        res[i].coin = Math.floor((res[i].noOfQues * 4) / 100) * 100 + 99;
                    }
                }
                setTags(res);
            });
        request
            .get('/tag/getTagBought.php', {
                params: {
                    id: getCookie().dxnlcm,
                    mode: params.mode,
                },
            })
            .then((res) => setBoughtTags(res));
        request
            .get('/user/search2.php', {
                params: {
                    id: getCookie().dxnlcm,
                },
            })
            .then((res) => {
                setLotus(Number.parseInt(res.lotus));
            });
    }, []);

    useEffect(() => {
        let a = [],
            b = [];
        for (let i = 0; i < tags.length; i++) a.push('' + tags[i].id);
        for (let i = 0; i < boughtTags.length; i++) b.push('' + boughtTags[i].id);
        a = a.filter((tagId) => b.indexOf(tagId) === -1);
        setLockTags(tags.filter((tag) => a.indexOf(tag.id) > -1));
    }, [tags.length, boughtTags.length]);

    const toBuy = (tagId, tagCoin) => {
        if (lotus >= tagCoin) {
            const payload = new FormData();
            payload.append('tag', tagId);
            payload.append('id', getCookie().dxnlcm);
            payload.append('lotus', tagCoin);
            request.post('/user/buyTag.php', payload).then((res) => {
                if (res) {
                    let temp = {};
                    for (let i = 0; i < tags.length; i++)
                        if (tags[i].id === tagId) {
                            temp = tags[i];
                            break;
                        }
                    setBoughtTags([...boughtTags, temp]);
                    setLotus((prev) => prev - tagCoin);
                    setResult('Bạn đã mua gói này thành công');
                }
            });
            document.getElementById('captain').classList.remove(cx('popupOpen'));
        } else {
            setResult('Bạn không có đủ tiền mua gói này');
        }
    };

    if (getCookie().islogin || getCookie().dxnlcm !== undefined) {
        if (choseTags === 0 || totalQuestion === 0) {
            return (
                <div>
                    <Header isLogin />
                    <div className={cx('mode-super-wrapper')}>
                        <div className={cx('mode-wrapper')}>
                            <img className={cx('mode-logo')} src={images[mode]} alt="" />
                            <p className={cx('mode-info')}>
                                {(mode === 'vocab'
                                    ? 'Vocaboostery'
                                    : mode.charAt(0).toLocaleUpperCase() + mode.substring(1)) + ' Mode'}
                            </p>
                        </div>
                    </div>
                    {mode === 'deciphering' && (
                        <select
                            className={cx('number-ques')}
                            value={totalQuestion}
                            onChange={(e) => setTotalQuestion(e.target.value)}
                        >
                            <option value="0" disabled>
                                Tổng số câu hỏi
                            </option>
                            <option value="1">1 câu</option>
                            <option value="2">2 câu</option>
                            <option value="3">3 câu</option>
                            <option value="4">4 câu</option>
                            <option value="5">5 câu</option>
                        </select>
                    )}
                    <div className={cx('taglist-superwrapper')}>
                        <div
                            className={cx('taglist-wrapper', {
                                'deciphering-taglist-wrapper': mode === 'deciphering',
                            })}
                            id="captain"
                        >
                            {boughtTags.map((tag) => (
                                <button
                                    key={tag.id}
                                    onClick={() => {
                                        setChoseTags(tag.id);
                                        setAward(tag.award);
                                    }}
                                    className={cx('tag', 'open')}
                                >
                                    {tag.tagname}
                                </button>
                            ))}
                            {lockTags.map((tag) => (
                                <Popup
                                    key={tag.id}
                                    modal
                                    trigger={
                                        <button className={cx('tag', 'close')}>
                                            <img className={cx('image-close')} src={images.aolang} alt="" />
                                            <div className={cx('text-close')}>
                                                <div>
                                                    <img className={cx('lock')} src={images.lock} alt="" />
                                                    <p>{tag.tagname}</p>
                                                </div>
                                                <div className={cx('coin-wrapper')}>
                                                    <span className={cx('coin-price')}>{tag.coin}</span>
                                                    <img className={cx('coin')} src={images.lotus} alt="" />
                                                </div>
                                            </div>
                                        </button>
                                    }
                                    onOpen={() => {
                                        document.getElementById('captain').classList.add(cx('popupOpen'));
                                        setResult('');
                                    }}
                                    onClose={() => {
                                        document.getElementById('captain').classList.remove(cx('popupOpen'));
                                    }}
                                >
                                    {(close) => (
                                        <div className={cx('buy-wrapper')}>
                                            <div className={cx('popup-coin-wrapper')}>
                                                <img className={cx('coin')} src={images.lotus} alt="" />
                                                <p className={cx('popup-lotus')}>{lotus}</p>
                                            </div>
                                            <p className={cx('question-wrapper')}>
                                                Bạn có muốn mua gói {tag.tagname} với giá {tag.coin} Sen không?
                                            </p>
                                            <div>
                                                <button
                                                    className={cx('confirm-btn', 'yes')}
                                                    onClick={() => toBuy(tag.id, tag.coin)}
                                                >
                                                    <FontAwesomeIcon icon={faCheck} />
                                                </button>
                                                <button className={cx('confirm-btn', 'no')} onClick={close}>
                                                    <FontAwesomeIcon icon={faXmark} />
                                                </button>
                                            </div>
                                            <p>{result}</p>
                                        </div>
                                    )}
                                </Popup>
                            ))}
                        </div>
                    </div>
                </div>
            );
        } else {
            switch (mode) {
                case 'marathon':
                    return <Starting tagId={choseTags} award={award} />;
                case 'hurdling':
                    return <Finish tagId={choseTags} award={award} />;
                case 'calculaphobia':
                    return <MentalCalculating tagId={choseTags} award={award} />;
                case 'deciphering':
                    return (
                        <Deciphering tagId={Number.parseInt(choseTags)} totalQuestion={totalQuestion} award={award} />
                    );
                case 'vocab':
                    return <Vocab tagId={Number.parseInt(choseTags)} award={award} />;
                default:
            }
        }
    } else {
        navigate(config.routes.login);
    }
}

export default ChooseTags;
