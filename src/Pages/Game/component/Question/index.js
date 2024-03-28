import { useLayoutEffect, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../../../Component/Layout/Header';
import classNames from 'classnames/bind';
import formatAnswer from '../formatAnswer';
import isCorrect from '../isCorrect';
import CustomizeAudio from '../../../../Component/CustomizeAudio';
import { audios } from '../../../../assets';
import styles from './Question.module.scss';
import config from '../../../../config';
import { getCookie, request } from '../../../../warehouse';
import Popup from 'reactjs-popup';

const cx = classNames.bind(styles);

function Question({
    aQuestion,
    time,
    maxTime,
    waiting,
    count,
    setCount,
    mark,
    setMark,
    setCorrectAnswered,
    setPlayersAnswered,
    setPlayersAnsweredWithId,
    readingAnswer,
    maxMark,
    instantMark,
    countRound,
    setCountRound,
    mode,
    isDisconnect,
    star,
    setStar,
    alreadyUseStar,
    setAlreadyUseStar
}) {
    const [answer, setAnswer] = useState('');
    const [answered, setAnswered] = useState('');
    const [answerDisplay, setAnswerDisplay] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [imageReveal, setImageReveal] = useState(true);
    const [starOpened, setStarOpened] = useState(true);

    const inputRef = useRef();
    const correctRef = useRef(new Audio(audios.correct));
    const wrongRef = useRef(new Audio(audios.wrong));

    const starRef = useRef(new Audio(audios.star));
    

    const navigate = useNavigate();

    const selectStar = () => {
        setStar(true);
        starRef.current.play();
    }

    const doWhenCorrect = () => {
        wrongRef.current.pause();
        correctRef.current.play();
        if(star === true && alreadyUseStar === false) {
            setMark(mark + maxMark + maxMark);
            setAlreadyUseStar(true);
        }
        else {
            setMark(mark + maxMark);
        }
        
        // if (readingAnswer > 0) inputRef.current.classList.add(styles.correct);
        setCorrectAnswered((prev) => [...prev, true]);
    };

    const doWhenWrong = () => {
        correctRef.current.pause();
        wrongRef.current.play();

        if(star === true && alreadyUseStar === false) {
            setMark(mark - maxMark);
            setAlreadyUseStar(true);
        }

        // if (readingAnswer > 0) inputRef.current.classList.add(styles.wrong);
        setCorrectAnswered((prev) => [...prev, false]);
    };

    const resetInputAns = () => {
        // inputRef.current.classList.remove(styles.correct);
        correctRef.current.currentTime = 0;
        // inputRef.current.classList.remove(styles.wrong);
        wrongRef.current.currentTime = 0;
        // inputRef.current.disabled = false;
        // inputRef.current.focus();
        setAnswer('');
        if (readingAnswer > 0) setAnswered('');
        if (readingAnswer > 0) setAnswerDisplay(false);
        setSubmitted(false);
        setCount(count + 1);
        setStarOpened(true);
    };

    const informResult = (playersAnswer) => {
        setPlayersAnsweredWithId((prev) => [...prev, { id: aQuestion.id, playersAnswer: playersAnswer }]);

        setPlayersAnswered((prev) => [...prev, playersAnswer]);

        if (isCorrect(playersAnswer, aQuestion.answer)) {
            doWhenCorrect();
        } else {
            doWhenWrong();
        }
        // inputRef.current.disabled = true;
        if (readingAnswer > 0) setAnswerDisplay(true);
        setTimeout(() => {
            resetInputAns();
        }, readingAnswer);
    };

    const submit = (e) => {
        if (e.keyCode === 13) {
            //mã phím Enter
            setSubmitted(true);
            if (instantMark) {
                informResult(answer);
            } else {
                setAnswered(answer);
                setAnswer('');
            }
        }
    };

    useEffect(() => {
        if (readingAnswer > 0) {
            wrongRef.current.pause();
            correctRef.current.pause();
        }
    }, [count]);

    useLayoutEffect(() => {
        if (time === 0) {
            // inputRef.current.disabled = true;
            if (!instantMark) informResult(answered);
            if (!submitted && instantMark) doWhenWrong();
            if (readingAnswer > 0) setAnswerDisplay(true);
            setTimeout(() => {
                resetInputAns();
            }, readingAnswer);
        }
    }, [time]);

    useLayoutEffect(() => {
        //marathon
        if (instantMark) {
            document.getElementById('time').classList.remove(cx('time-animation'));
            void document.getElementById('time').offsetHeight;
            document.getElementById('time').classList.add(cx('time-animation'));
            document.getElementById('time').style.animationDelay = waiting / 1000 + 's';
            document.getElementById('time').style.animationDuration = maxTime + 's';
        }
    }, []);

    useLayoutEffect(() => {
        //hurdling
        if (!instantMark && countRound <= limit(mode)) {
            

            setTimeout(() => {
                setStarOpened(false);
                document.getElementById('time').classList.remove(cx('time-animation'));
                void document.getElementById('time').offsetHeight;
                document.getElementById('time').classList.add(cx('time-animation'));
                document.getElementById('time').style.animationDelay = waiting / 1000 + 's';
                document.getElementById('time').style.animationDuration = maxTime + 's';
            }, 5000);
        }
    }, [count]);

    useEffect(() => {
        let date = new Date();
        request
            .get('/usersanswer/countRound.php', {
                params: {
                    id: getCookie().dxnlcm,
                    time: date.getTime(),
                    firstTime: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0).getTime(),
                    mode: mode,
                },
            })
            .then((res) => {
                setCountRound(Number.parseInt(res));
            });
    }, []);

    const limit = (mode) => {
        if (mode === 'marathon') return 20;
        else if (mode === 'hurdling') return 10;
        else return 1000000000;
    };

    if (getCookie().islogin || getCookie().dxnlcm !== undefined) {
        if (countRound <= limit(mode)) {
            return (
                <div>
                    <Header isLogin />
                    <div className={cx('wrapper')}>
                        <Popup open={isDisconnect}>
                            <div className={cx('popup-wrapper')}>
                                <p>Có vẻ bạn đã bị mất kết nối</p>
                                <Link className={cx('popup-btn')} to={config.routes.home}>
                                    Quay trở lại
                                </Link>
                            </div>
                        </Popup>
                        <div className={cx('first-division')}>
                            <div className={cx('point-wrapper')}>
                                <p className={cx('point')}>{mark}</p>
                            </div>
                            <div className={cx('question-wrapper')}>
                                <div className={cx('question-count-wrapper')}>
                                    <p className={cx('question-major')}>
                                        <span className={cx('question-count')}>
                                            Câu hỏi số {count} ({maxMark} điểm) 
                                            {
                                                mode == "hurdling" && star && !alreadyUseStar ? <span className={cx('star-text')}> - NGÔI SAO HY VỌNG</span> : ""
                                            }
                                        </span>
                                    </p>
                                </div>
                                <div className={cx('question-content-wrapper')}>
                                    <p className={cx('question-content')}>{aQuestion.question}</p>
                                </div>
                            </div>
                        </div>
                        <div className={cx('second-division')}>
                            
                            <div className={cx('miscellaneous')}>
                                {
                                    mode == "hurdling" && !star && !alreadyUseStar && starOpened ? <button className={cx('star-choose')} onClick={() => selectStar()
                                    }>
                                    SỬ DỤNG NGÔI SAO HY VỌNG
                                </button> : ""
                                }
                                <p>Thời gian</p>
                                <div className={cx('time-wrapper')}>
                                    <div className={cx('time')} id="time"></div>
                                </div>
                                <div className={cx('answer-wrapper')}>
                                    <p className={cx('answer-label')}>Đáp án câu hỏi trước</p>
                                    <p className={cx('answer-content')}>
                                        {answerDisplay ? formatAnswer(aQuestion.answer) : ''}
                                    </p>
                                </div>
                                <textarea
                                    className={cx('input')}
                                    ref={inputRef}
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    onKeyUp={(e) => submit(e)}
                                    autoFocus
                                ></textarea>
                                <p className={cx('answered')}>{answered}</p>
                            </div>
                            <div>
                                {mode === 'deciphering' && (
                                    <div>
                                        <label className={cx('switch')} htmlFor="imageReveal">
                                            <span
                                                className={cx('slider', {
                                                    'slider-on': imageReveal,
                                                })}
                                            ></span>
                                        </label>
                                        <input
                                            type="checkbox"
                                            className={cx('toggle')}
                                            checked={imageReveal}
                                            onChange={() => setImageReveal((prev) => !prev)}
                                            id="imageReveal"
                                        />
                                    </div>
                                )}
                                <div
                                    className={cx('media', {
                                        deciphering: mode === 'deciphering',
                                    })}
                                >
                                    {aQuestion.image && imageReveal && (
                                        <img className={cx('question-image')} src={aQuestion.image} alt="" />
                                    )}
                                    {aQuestion.audio && <CustomizeAudio src={aQuestion.audio} autoPlay={true} />}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    <Header isLogin />
                    <div className={cx('wrapper', 'second-wrapper')}>
                        <p>BẠN ĐÃ HẾT LƯỢT CHƠI NGÀY HÔM NAY</p>
                    </div>
                </div>
            );
        }
    } else {
        navigate(config.routes.login);
    }
}

export default Question;
