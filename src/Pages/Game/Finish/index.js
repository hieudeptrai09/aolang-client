import { useEffect, useLayoutEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { audios } from '../../../assets';
import { request, useGlobalStates, actions, getCookie } from '../../../warehouse';
import Question from '../component/Question';
import config from '../../../config';

function Finish({ tagId, referenceTagId, award }) {
    const dispatch = useGlobalStates()[1];

    const [aQuestion, setAQuestion] = useState({});
    const [ids, setIds] = useState([]);
    const [count, setCount] = useState(1);
    const [mark, setMark] = useState(0);
    const [correctAnswered, setCorrectAnswered] = useState([]);
    const [playersAnswered, setPlayersAnswered] = useState([]);
    const [playersAnsweredWithId, setPlayersAnsweredWithId] = useState([]);
    const [time, setTime] = useState(-1);
    const [countRound, setCountRound] = useState(0);
    const [askedQuestion, setAskedQuestion] = useState([]);
    let navigate = useNavigate();
    const tenSecondRef = useRef(new Audio(audios.tenSecond));
    const fifteenSecondRef = useRef(new Audio(audios.fifteenSecond));
    const twentySecondRef = useRef(new Audio(audios.twentySecond));
    const twentyFiveSecondRef = useRef(new Audio(audios.twentyFiveSecond));
    

    const [isDisconnect, setIsDisconnect] = useState(false);
    const [star, setStar] = useState(false);
    const [alreadyUseStar, setAlreadyUseStar] = useState(false);
    
    const waitingRef = useRef();

    const marks = [10, 10, 10, 10, 20, 20, 20, 30, 30, 40];
    const times = [10, 10, 10, 10, 15, 15, 15, 20, 20, 25];
    const audioArray = [
        tenSecondRef,
        tenSecondRef,
        tenSecondRef,
        tenSecondRef,
        fifteenSecondRef,
        fifteenSecondRef,
        fifteenSecondRef,
        twentySecondRef,
        twentySecondRef,
        twentyFiveSecondRef,
    ];

    useEffect(() => {
        if (count > 0 && count <= 10) {
            
            request
                .get('/question/getARandomQuestion.php', {
                    params: {
                        type: 'hurdling',
                        difficulty: marks[count - 1],
                        ids: JSON.stringify(ids),
                        tagId: referenceTagId,
                    },
                })
                .then((data) => {
                    let question = data;
                    let waiting = question.question.split(' ').length * 100;

                    if(alreadyUseStar === true) {
                        setStar(false)
                    }

                    {
                        !star && !alreadyUseStar ? setAQuestion({
                            "question": `Ngôi sao hi vọng có thể giúp bạn nhân đôi số điểm của câu hỏi này! Nhấn vào nút Sử dụng ngôi sao hy vọng để sử dụng nhé.`
                        }) : setAQuestion({
                            "question": "Chúc bạn thành công ở câu hỏi sắp tới!"
                        });
                    }

                   
                    
                    setIds([...ids, question.id]);
                    setAskedQuestion([...askedQuestion, question]);
                    setTime(-1);
                    setTimeout(function() {
                        setAQuestion(question);
                        
                        if (question.audio) {
                            let a = new Audio(question.audio);
                            let audioDuration = 0;
                            a.preload = 'metadata';
                            a.onloadedmetadata = () => {
                                audioDuration = a.duration;
                                waiting = Math.ceil(Math.max(waiting, audioDuration * 1000));
                                waitingRef.current = waiting;
                                setTimeout(() => {
                                    setTime(times[count - 1]);
                                    audioArray[count - 1].current.play();
                                    if (countRound > 10) audioArray[count - 1].current.pause();
                                }, waiting);
                            };
                        } else {
                            waitingRef.current = waiting;
                            setTimeout(() => {
                                setTime(times[count - 1]);
                                audioArray[count - 1].current.play();
                                if (countRound > 10) audioArray[count - 1].current.pause();
                            }, waiting);
                        }
                    }, 5000)
                    
                })
                .catch(() => {
                    setIsDisconnect(true);
                });
        } else if (count > 10) {
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

            audioArray[10 - 1].current.pause();
            dispatch(actions.setMode('hurdling'));
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
            payload3.append('tagId', referenceTagId);
            payload3.append('userId', getCookie().dxnlcm);
            request.post('/usersanswer/save.php', payload3).then((res) => {});

            const payload4 = new FormData();
            payload4.append('id', getCookie().dxnlcm);
            payload4.append('lotus', (mark / 10) * -award);
            request.post('/user/addLotus.php', payload4).then((res) => {});

            if (countRound <= 10) navigate(config.routes.questionsTable, { replace: true });
        }
    }, [count, countRound]);

    useEffect(() => {
        return () => {
            tenSecondRef.current.pause();
            fifteenSecondRef.current.pause();
            twentySecondRef.current.pause();
            twentyFiveSecondRef.current.pause();
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
            maxTime={times[count - 1]}
            waiting={waitingRef.current}
            count={count}
            setCount={setCount}
            mark={mark}
            setMark={setMark}
            setCorrectAnswered={setCorrectAnswered}
            setPlayersAnswered={setPlayersAnswered}
            setPlayersAnsweredWithId={setPlayersAnsweredWithId}
            readingAnswer={5000}
            maxMark={marks[count - 1]}
            instantMark={false}
            countRound={countRound}
            setCountRound={setCountRound}
            star={star}
            setStar={setStar}
            alreadyUseStar={alreadyUseStar}
            setAlreadyUseStar={setAlreadyUseStar}
            mode="hurdling"
            isDisconnect={isDisconnect}
        />
    );
}

export default Finish;
