import { useState, useEffect } from 'react';
import Popup from 'reactjs-popup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullhorn, faImage, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './SentQuestion.module.scss';
import { getCookie, request } from '../../../warehouse';
import CustomizeAudio from '../../../Component/CustomizeAudio';

const cx = classNames.bind(styles);

function SentQuestion() {
    const [questions, setQuestions] = useState([]);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        request
            .get('/pendingQuestion/getPendingQuestionById.php', {
                params: {
                    id: getCookie().dxnlcm,
                },
            })
            .then((res) => setQuestions(res));
    }, []);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('header-wrapper')}>
                <h4 className={cx('header')}>Câu hỏi số {index + 1}</h4>
                <div>
                    <button className={cx('btn')} onClick={() => setIndex(0)}>
                        {'<<'}
                    </button>
                    <button
                        className={cx('btn')}
                        onClick={() => {
                            if (index >= 1) setIndex(index - 1);
                            else setIndex(0);
                        }}
                    >
                        {'<'}
                    </button>
                    <input
                        className={cx('input-btn')}
                        value={index + 1}
                        onChange={(e) => {
                            if (e.target.value.length === 0) setIndex(0);
                            else {
                                let temp = Number.parseInt(e.target.value);
                                if (temp <= 1) setIndex(0);
                                else if (temp >= questions.length) setIndex(questions.length - 1);
                                else setIndex(temp - 1);
                            }
                        }}
                    />
                    <button
                        className={cx('btn')}
                        onClick={() => {
                            if (index <= questions.length - 2) setIndex(index + 1);
                            else setIndex(questions.length - 1);
                        }}
                    >
                        {'>'}
                    </button>
                    <button className={cx('btn')} onClick={() => setIndex(questions.length - 1)}>
                        {'>>'}
                    </button>
                </div>
            </div>
            {questions.length > 0 && (
                <div className={cx('content-wrapper')}>
                    <div>
                        <label className={cx('cell-label')}>
                            Câu hỏi{' '}
                            {questions[index].image && (
                                <Popup
                                    modal
                                    trigger={
                                        <button className={cx('media-btn')}>
                                            <FontAwesomeIcon icon={faImage} />
                                        </button>
                                    }
                                >
                                    <div className={cx('explain-wrapper')}>
                                        <p>Ảnh</p>
                                        <img className={cx('question-image')} src={questions[index].image} alt="" />
                                    </div>
                                </Popup>
                            )}
                            {questions[index].audio && (
                                <Popup
                                    modal
                                    trigger={
                                        <button className={cx('media-btn')}>
                                            <FontAwesomeIcon icon={faBullhorn} />
                                        </button>
                                    }
                                >
                                    <div className={cx('explain-wrapper', 'audio-wrapper')}>
                                        <p>Âm thanh</p>
                                        <CustomizeAudio src={questions[index].audio} autoPlay={false} />
                                    </div>
                                </Popup>
                            )}
                        </label>
                        <p className={cx('cell-input')}>{questions[index].question}</p>
                    </div>
                    <div>
                        <label className={cx('cell-label')}>
                            Câu trả lời{' '}
                            {questions[index].explanation && (
                                <Popup
                                    modal
                                    trigger={
                                        <button>
                                            <FontAwesomeIcon icon={faCircleInfo} className={cx('explain-btn')} />
                                        </button>
                                    }
                                >
                                    <div className={cx('explain-wrapper')}>
                                        <p>Giải thích</p>
                                        <p>{questions[index].explanation}</p>
                                    </div>
                                </Popup>
                            )}
                        </label>
                        <p className={cx('cell-input')}>{questions[index].answer}</p>
                    </div>
                    <div>
                        <label className={cx('cell-label')}>Phản hồi</label>
                        {questions[index].message && <p className={cx('cell-input')}>{questions[index].message}</p>}
                    </div>
                    <div>
                        <label className={cx('cell-label')}>
                            Trạng thái:{' '}
                            <span
                                className={cx('', {
                                    pending: questions[index].approvement === '0',
                                    notApprove: questions[index].approvement === '1',
                                    approve: questions[index].approvement === '2',
                                })}
                            >
                                {questions[index].approvement === '0'
                                    ? 'Chưa phê duyệt'
                                    : questions[index].approvement === '1'
                                    ? 'Không chấp thuận'
                                    : 'Chấp thuận'}
                            </span>
                        </label>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SentQuestion;
