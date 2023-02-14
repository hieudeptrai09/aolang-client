import { Fragment, useEffect, useState } from 'react';
import { request, getCookie } from '../../../warehouse';
import classNames from 'classnames/bind';
import styles from './Pending.module.scss';

const cx = classNames.bind(styles);

function PendingQuestion() {
    const [questions, setQuestions] = useState([]);
    const [chosen, setChosen] = useState('');

    useEffect(() => {
        let cookies = getCookie();
        let id = cookies['uid'];
        request
            .get('/pendingQuestion/getPendingQuestionById.php', {
                params: {
                    id,
                },
            })
            .then((res) => setQuestions(res));
    }, []);

    return (
        <div className={cx('wrapper')}>
            <aside className={cx('btn-wrapper')}>
                {questions.map((question, index) => {
                    return (
                        <button
                            key={index}
                            id={'ques-' + index}
                            className={cx('btn', {
                                'correct-color': question.approvement === '2',
                                'wrong-color': question.approvement === '1',
                            })}
                            onClick={(e) => setChosen(e.target.id.substring(5))}
                        >
                            {question.question}
                        </button>
                    );
                })}
            </aside>
            <div className={cx('content-wrapper')}>
                {chosen !== '' && (
                    <>
                        <p>Câu hỏi:</p>
                        <p className={cx('content')}>{questions[chosen].question}</p>
                        <p>Câu trả lời:</p>
                        <p className={cx('content')}>{questions[chosen].answer}</p>
                        {questions[chosen].image !== null && (
                            <>
                                <p>Ảnh:</p>
                                <p className={cx('content')}>{questions[chosen].image}</p>
                            </>
                        )}
                        {questions[chosen].audio !== null && (
                            <>
                                <p>Âm thanh:</p>
                                <p className={cx('content')}>{questions[chosen].audio}</p>
                            </>
                        )}
                        <p>Phản hồi từ người duyệt:</p>
                        <p className={cx('content')}>{questions[chosen].message}</p>
                    </>
                )}
            </div>
        </div>
    );
}

export default PendingQuestion;
