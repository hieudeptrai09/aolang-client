import { useEffect, useLayoutEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { audios } from '../../../assets';
import { request, useGlobalStates, actions, getCookie } from '../../../warehouse';
import Question from '../component/Question';
import config from '../../../config';

function Starting({ tagId }) {
    const dispatch = useGlobalStates()[1];

    const [aQuestion, setAQuestion] = useState({});
    const [ids, setIds] = useState([]);
    const [count, setCount] = useState(1);
    const [mark, setMark] = useState(0);
    const [correctAnswered, setCorrectAnswered] = useState([]);
    const [playersAnswered, setPlayersAnswered] = useState([]);
    const [playersAnsweredWithId, setPlayersAnsweredWithId] = useState([]);
    const [time, setTime] = useState(60);
    const [askedQuestion, setAskedQuestion] = useState([]);
    const [countRound, setCountRound] = useState(0);
    const [isDisconnect, setIsDisconnect] = useState(false);
    let navigate = useNavigate();
    const timerRef = useRef(new Audio(audios.starting));

    useEffect(() => {
        if (time > 0 && count <= 30) {
            request
                .get('/question/getARandomQuestion.php', {
                    params: {
                        type: 'marathon',
                        difficulty: 10,
                        ids: JSON.stringify(ids),
                        tagId: tagId,
                    },
                })
                .then((data) => {
                    let question = data;
                    setAQuestion(question);
                    setIds([...ids, question.id]);
                    if (time > 1) setAskedQuestion([...askedQuestion, question]);
                    timerRef.current.play();
                    if (countRound > 20) timerRef.current.pause();
                })
                .catch(() => {
                    setIsDisconnect(true);
                });
        } else {
            timerRef.current.pause();
            let askedQuestionCorrect = [];
            let j = 0;
            for (let i = 0; i < askedQuestion.length; i++) {
                if (askedQuestion[i].id !== playersAnsweredWithId[j].id) {
                } else {
                    askedQuestionCorrect.push(askedQuestion[i]);
                    ++j;
                }
                if (j >= playersAnsweredWithId.length) break;
            }

            dispatch(actions.setMode('marathon'));
            dispatch(actions.setMark(mark));
            dispatch(actions.setAskedQuestion(askedQuestionCorrect));
            dispatch(actions.setCorrect(correctAnswered));
            dispatch(actions.setAnswered(playersAnswered));
            const payload = new FormData();
            let id = [];
            for (let i = 0; i < askedQuestion.length; i++) {
                id.push(askedQuestion[i].id);
            }
            payload.append('ids', JSON.stringify(id));
            payload.append('areCorrect', JSON.stringify(correctAnswered));
            request.post('/question/rightOrWrong.php', payload).then((res) => {});

            const payload2 = new FormData();
            payload2.append('userId', getCookie().dxnlcm);
            payload2.append('mark', mark);
            payload2.append('time', new Date().getTime());
            payload2.append('tagId', tagId);
            request.post('/maxpoint/saveMaxPoint.php', payload2).then((res) => {});

            const payload3 = new FormData();
            payload3.append('ids', JSON.stringify(id));
            payload3.append('answered', JSON.stringify(playersAnswered));
            payload3.append('tagId', tagId);
            payload3.append('userId', getCookie().dxnlcm);
            request.post('/usersanswer/save.php', payload3).then((res) => {});

            const payload4 = new FormData();
            payload4.append('id', getCookie().dxnlcm);
            payload4.append('lotus', (mark / 10) * -1);
            request.post('/user/addLotus.php', payload4).then((res) => {});

            if (countRound <= 20) navigate(config.routes.questionsTable, { replace: true });
        }
    }, [count, countRound]);

    useEffect(() => {
        return () => {
            timerRef.current.pause();
        };
    }, []);

    useLayoutEffect(() => {
        const timerId = setTimeout(() => {
            if (time > 0) setTime(time - 1);
        }, 1000);
        return () => clearInterval(timerId);
    }, [time]);

    return (
        <Question
            aQuestion={aQuestion}
            time={time}
            maxTime={60}
            count={count}
            setCount={setCount}
            mark={mark}
            setMark={setMark}
            setCorrectAnswered={setCorrectAnswered}
            setPlayersAnswered={setPlayersAnswered}
            setPlayersAnsweredWithId={setPlayersAnsweredWithId}
            readingAnswer={0}
            maxMark={10}
            instantMark={true}
            waiting={0}
            countRound={countRound}
            setCountRound={setCountRound}
            mode="marathon"
            isDisconnect={isDisconnect}
        />
    );
}

export default Starting;
