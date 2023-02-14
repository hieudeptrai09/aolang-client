import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { audios } from '../../../assets';
import { actions, useGlobalStates, getCookie, request } from '../../../warehouse';
import Question from '../component/Question';
import config from '../../../config';

function MentalCalculating({ tagId }) {
    const [aQuestion, setAQuestion] = useState({});
    const [count, setCount] = useState(1);
    const [noOfQuestion, setNoOfQuestion] = useState(1);
    const [mark, setMark] = useState(0);
    const [time, setTime] = useState(60);
    const [correctAnswered, setCorrectAnswered] = useState([]);
    const [playersAnswered, setPlayersAnswered] = useState([]);
    const [playersAnsweredWithId, setPlayersAnsweredWithId] = useState([]);
    const [askedQuestion, setAskedQuestion] = useState([]);
    const [countRound, setCountRound] = useState(0);
    const [isDisconnect, setIsDisconnect] = useState(false);
    let navigate = useNavigate();
    const timerRef = useRef(new Audio(audios.starting));

    const dispatch = useGlobalStates()[1];

    useEffect(() => {
        if (time > 0) {
            let question = {};
            let member = new Array(2);
            let digits = new Array(2);
            let isNegative = Math.floor(Math.random() * 4);
            let operator = tagId >= 41 ? tagId - 41 : Math.floor(Math.random() * 4);
            let minorOperator = '';

            if (operator === 2) {
                //phép nhân
                minorOperator = Math.floor(Math.random() * 4);
                if (minorOperator <= 1) digits[0] = Math.floor(Math.random() * 4);
                else digits[0] = Math.floor(Math.random() * 2);
                if (digits[0] === 0) {
                    //1 chữ số
                    digits[1] = Math.floor(Math.random() * 4);
                    member[0] = Math.floor(Math.random() * 10);
                    do {
                        member[1] = Math.floor(Math.random() * 9 * Math.pow(10, digits[1])) + Math.pow(10, digits[1]);
                    } while (minorOperator === 1 && member[1] === 0);
                } else if (digits[0] === 1) {
                    //2 chữ số
                    member[0] = Math.floor(Math.random() * 90) + 10;
                    do {
                        member[1] = Math.floor(Math.random() * 100);
                    } while (minorOperator === 1 && member[1] === 0);
                } else {
                    //3 hoặc 4 chữ số
                    member[0] = Math.floor(Math.random() * 9 * Math.pow(10, digits[0])) + Math.pow(10, digits[0]);
                    do {
                        member[1] = Math.floor(Math.random() * 10);
                    } while (minorOperator === 1 && member[1] === 0);
                }
                if (minorOperator === 2) member[1] = 2;
                else if (minorOperator === 3) member[1] = -2;
            } else {
                digits[1] = Math.floor(Math.random() * 4);
                if (operator === 3) digits[0] = Math.floor(Math.random() * (4 - digits[1])) + digits[1];
                //phép chia
                else digits[0] = Math.floor(Math.random() * 4);
                do {
                    if (digits[1] === 0) member[1] = Math.floor(Math.random() * 10);
                    else member[1] = Math.floor(Math.random() * 9 * Math.pow(10, digits[1])) + Math.pow(10, digits[1]);
                } while (operator === 3 && member[1] === 0);
                if (digits[0] === 0) member[0] = Math.floor(Math.random() * 10);
                else member[0] = Math.floor(Math.random() * 9 * Math.pow(10, digits[0])) + Math.pow(10, digits[0]);
                if (operator === 3) {
                    let min = Math.floor(Math.pow(10, digits[0]) / member[1]);
                    let max = Math.floor(Math.pow(10, digits[0] + 1) / member[1]);
                    member[0] = Math.floor(Math.random() * (max - min + 1) + min) * member[1];
                    minorOperator = Math.floor(Math.random() * 2);
                }
            }

            switch (isNegative) {
                case 1:
                    member[0] *= -1;
                    break;
                case 2:
                    if (!(operator === 2 && minorOperator >= 2)) member[1] *= -1;
                    break;
                case 3:
                    member[0] *= -1;
                    if (!(operator === 2 && minorOperator >= 2)) member[1] *= -1;
                    break;
                default:
            }

            if (member[0] >= 0) question.question = '' + member[0];
            else question.question = '(' + member[0] + ')';

            switch (operator) {
                case 0:
                    question.question += '+';
                    question.answer = member[0] + member[1];
                    break;
                case 1:
                    question.question += '-';
                    question.answer = member[0] - member[1];
                    break;
                case 2:
                    if (minorOperator === 0) {
                        question.question += '*';
                        question.answer = member[0] * member[1];
                    } else if (minorOperator === 1) {
                        question.question += '/';
                        question.answer = member[0] * member[1];
                    } else if (minorOperator === 2) {
                        question.question += '^';
                        question.answer = member[0] * member[0];
                    } else {
                        question.question += '^';
                        let answer = member[0] * member[0];
                        if (answer === 1) question.answer = '1';
                        else if (answer === -1) question.answer = '-1';
                        else if (answer > 0) question.answer = '1/' + answer;
                        else question.answer = '-1/' + answer + '~|1/-' + answer + '~|1/(-' + answer + ')';
                    }
                    break;
                case 3:
                    minorOperator === 0 ? (question.question += '/') : (question.question += '*');
                    question.answer = member[0] / member[1];
                    break;
                default:
            }
            if (member[1] < 0) question.question += '(' + member[1] + ')';
            else question.question += member[1];
            if (operator === 2) {
                if (minorOperator === 1) question.question += '^(-1)';
            } else if (operator === 3) {
                if (minorOperator === 1) question.question += '^(-1)';
            }
            question.answer += '';
            question.id = noOfQuestion;
            setNoOfQuestion((prev) => prev + 1);
            setAQuestion(question);
            if (time > 1) setAskedQuestion([...askedQuestion, question]);
            timerRef.current.play();
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

            dispatch(actions.setMode('calculaphobia'));
            dispatch(actions.setMark(mark));
            dispatch(actions.setAskedQuestion(askedQuestionCorrect));
            dispatch(actions.setCorrect(correctAnswered));
            dispatch(actions.setAnswered(playersAnswered));
            const payload2 = new FormData();
            payload2.append('userId', getCookie().dxnlcm);
            payload2.append('mark', mark);
            payload2.append('time', new Date().getTime());
            payload2.append('tagId', 20);
            request.post('/maxpoint/saveMaxPoint.php', payload2).then((res) => {});
            navigate(config.routes.questionsTable, { replace: true });
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

        return () => clearTimeout(timerId);
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
            mode="calculaphobia"
            isDisconnect={isDisconnect}
        />
    );
}

export default MentalCalculating;
