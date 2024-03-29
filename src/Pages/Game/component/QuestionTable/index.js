import { useState, useRef } from 'react';
import Popup from 'reactjs-popup';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import { request, useGlobalStates, getCookie } from '../../../../warehouse';
import formatAnswer from '../formatAnswer';
import CustomizeAudio from '../../../../Component/CustomizeAudio';
import styles from './QuestionTable.module.scss';
import config from '../../../../config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faBullhorn, faCircleInfo, faFlag, faImage } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function QuestionTable() {
    const state = useGlobalStates()[0];
    const [report, setReport] = useState('');
    let navigate = useNavigate();

    const cookies = useRef(getCookie());

    const toSend = (e) => {
        const index = e.target.id.substring(5);
        const payload = new FormData();
        payload.append('questionId', state.askedQuestion[index].id);
        payload.append('userId', cookies.current.dxnlcm);
        payload.append('report', report);
        payload.append('mode', state.mode);
        request.post('/report/saveReport.php', payload).then((res) => {
            if (!!res) {
                document.getElementById('send-' + index).disabled = true;
                document.getElementById('send-inform-' + index).classList.remove(styles['will-send-successfully']);
            }
        });
    };

    return (
        <div id="captain">
            <p className={cx('mark')}>{state.mark}</p>
            <table className={cx('wrapper')}>
                <thead>
                    <tr>
                        <th>Câu hỏi</th>
                        <th>Nguồn</th>
                        <th>Người chơi</th>
                        <th>Đáp án</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {state.askedQuestion.map((eachQuestion, index) => (
                        <tr key={index} className={cx('content-wrapper')} id={'content-wrapper-' + index}>
                            <td className={cx('content-item', 'poem')}>
                                <span className={cx('numeral')}>{index + 1 + '. '}</span>
                                {eachQuestion.question}
                                {eachQuestion.image && (
                                    <Popup
                                        modal
                                        trigger={
                                            <button className={cx('media-btn')}>
                                                <FontAwesomeIcon icon={faImage} />
                                            </button>
                                        }
                                        onOpen={() => {
                                            document.getElementById('captain').classList.add('popupOpen');
                                        }}
                                        onClose={() => document.getElementById('captain').classList.remove('popupOpen')}
                                    >
                                        <div className={cx('explain-wrapper')}>
                                            <p>Ảnh của câu hỏi số {index + 1}</p>
                                            <img className={cx('question-image')} src={eachQuestion.image} alt="" />
                                        </div>
                                    </Popup>
                                )}
                                {eachQuestion.audio && (
                                    <Popup
                                        modal
                                        trigger={
                                            <button className={cx('media-btn')}>
                                                <FontAwesomeIcon icon={faBullhorn} />
                                            </button>
                                        }
                                        onOpen={() => {
                                            document.getElementById('captain').classList.add('popupOpen');
                                        }}
                                        onClose={() => document.getElementById('captain').classList.remove('popupOpen')}
                                    >
                                        <div className={cx('explain-wrapper', 'audio-wrapper')}>
                                            <p>Âm thanh của câu hỏi số {index + 1}</p>
                                            <CustomizeAudio src={eachQuestion.audio} autoPlay={false} />
                                        </div>
                                    </Popup>
                                )}
                            </td>
                            <td className={cx('content-item')}>{eachQuestion.credit}</td>
                            <td
                                className={cx('content-item', {
                                    wrong: state.correct[index] === false,
                                    right: state.correct[index] === true,
                                })}
                            >
                                {state.playersAnswered[index]}
                            </td>
                            <td className={cx('content-item')}>
                                {formatAnswer(eachQuestion.answer)}
                                {eachQuestion.explanation && (
                                    <Popup
                                        modal
                                        trigger={
                                            <button>
                                                <FontAwesomeIcon icon={faCircleInfo} className={cx('explain-btn')} />
                                            </button>
                                        }
                                        onOpen={() => {
                                            document.getElementById('captain').classList.add('popupOpen');
                                        }}
                                        onClose={() => document.getElementById('captain').classList.remove('popupOpen')}
                                    >
                                        <div className={cx('explain-wrapper')}>
                                            {state.mode === 'vocab' ? (
                                                <p>Câu ví dụ cho từ {eachQuestion.answer}</p>
                                            ) : (
                                                <p>Giải thích câu hỏi số {index + 1}</p>
                                            )}
                                            <p>{eachQuestion.explanation}</p>
                                        </div>
                                    </Popup>
                                )}
                                {state.mode === 'marathon' && (
                                    <a
                                        className={cx('hover-btn')}
                                        href={'https://www.google.com/search?q=' + eachQuestion.keyWords}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <FontAwesomeIcon icon={faGoogle} />
                                    </a>
                                )}
                            </td>
                            {state.mode !== 'calculaphobia' && state.mode !== 'deciphering' && (
                                <td>
                                    <Popup
                                        modal
                                        trigger={
                                            <button className={cx('report-btn')}>
                                                <FontAwesomeIcon icon={faFlag} />
                                            </button>
                                        }
                                        onOpen={() => {
                                            document.getElementById('captain').classList.add('popupOpen');
                                            setReport('');
                                        }}
                                        onClose={() => document.getElementById('captain').classList.remove('popupOpen')}
                                    >
                                        {(close) => (
                                            <div className="popup-wrapper">
                                                <button className="close" onClick={close}>
                                                    &times;
                                                </button>
                                                <div className={cx('popup-header')}>
                                                    <p className={cx('save-name')}>
                                                        Bạn muốn báo cáo điều gì ở câu số {index + 1}?
                                                    </p>
                                                    <button
                                                        id={'send-' + index}
                                                        className="popup-btn"
                                                        onClick={(e) => toSend(e)}
                                                    >
                                                        Lưu
                                                    </button>
                                                </div>
                                                <textarea
                                                    className={cx('send-report-input')}
                                                    value={report}
                                                    onChange={(e) => {
                                                        setReport(e.target.value);
                                                        document.getElementById('send-' + index).disabled = false;
                                                        document
                                                            .getElementById('send-inform-' + index)
                                                            .classList.add(styles['will-send-successfully']);
                                                    }}
                                                ></textarea>
                                                {
                                                    <p
                                                        id={'send-inform-' + index}
                                                        className={cx('will-send-successfully', {
                                                            'save-successfully': true,
                                                        })}
                                                    >
                                                        Đã gửi thành công
                                                    </p>
                                                }
                                            </div>
                                        )}
                                    </Popup>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className={cx('footer-btn-wrapper')}>
                <button
                    className={cx('ques-table-btn')}
                    onClick={() => navigate(config.routes.game + '?mode=' + state.mode)}
                >
                    Chơi lại mode cũ
                </button>
                <button className={cx('ques-table-btn')} onClick={() => navigate(config.routes.home)}>
                    Về trang chủ
                </button>
            </div>
        </div>
    );
}

export default QuestionTable;
