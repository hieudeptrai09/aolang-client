import { useEffect, useLayoutEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { audios } from '../../../assets';
import { request, useGlobalStates, actions, getCookie } from '../../../warehouse';
import Question from '../component/Question';
import config from '../../../config';

function Vocab({ tagId }) {
    const dispatch = useGlobalStates()[1];

    const [aQuestion, setAQuestion] = useState({});
    const [ids, setIds] = useState([]);
    const [count, setCount] = useState(1);
    const [mark, setMark] = useState(0);
    const [correctAnswered, setCorrectAnswered] = useState([]);
    const [playersAnswered, setPlayersAnswered] = useState([]);
    const [playersAnsweredWithId, setPlayersAnsweredWithId] = useState([]);
    const [time, setTime] = useState(tagId === 3 ? 60 : -1);
    const [askedQuestion, setAskedQuestion] = useState([]);
    const [countRound, setCountRound] = useState(0);
    const [isDisconnect, setIsDisconnect] = useState(false);
    const waitingRef = useRef();

    let navigate = useNavigate();
    const interpretoRef = useRef(new Audio(audios.starting));
    const scenarioRef = useRef(new Audio(audios.twentyFiveSecond));

    const questionGenerator = (sentence, word, mean, partOfSpeech) => {
        let wordLength = word.indexOf('~|');
        if (wordLength > 0) word = word.substring(0, wordLength);
        else word = word.trim();
        var blankSpace = '';
        blankSpace += word.charAt(0);
        for (let i = 1; i < word.length - 1; i++) {
            if (word.charAt(i) === ' ') blankSpace += '\u00A0 ';
            else if (word.charAt(i) === '-') blankSpace += '- ';
            else blankSpace += '_ ';
        }
        blankSpace = blankSpace + '_';
        if (tagId === 3) return blankSpace + ' (' + partOfSpeech + '): ' + mean;
        else if (tagId === 24) return sentence.replace(word, blankSpace);
    };

    useEffect(() => {
        if ((tagId === 3 && time > 0 && count <= 30) || (tagId === 24 && count > 0 && count <= 10)) {
            request
                .get('/vocab/getARandomWord.php', {
                    params: {
                        ids: JSON.stringify(ids),
                    },
                })
                .then((data) => {
                    let question = {};
                    question.question = questionGenerator(data.sentence, data.word, data.mean, data.partOfSpeech);
                    question.answer = data.word;
                    question.id = data.id;
                    question.explanation = data.sentence;
                    setAQuestion(question);
                    setIds([...ids, data.id]);
                    if ((tagId === 3 && time > 1) || tagId === 24) setAskedQuestion([...askedQuestion, question]);
                    if (tagId === 3) interpretoRef.current.play();
                    if (tagId === 24) {
                        let waiting = data.sentence.split(' ').length * 100;
                        waitingRef.current = waiting;
                        setTimeout(() => {
                            setTime(25);
                            scenarioRef.current.play();
                        }, waiting);
                    }
                })
                .catch(() => {
                    setIsDisconnect(true);
                });
        } else {
            interpretoRef.current.pause();
            scenarioRef.current.pause();
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

            dispatch(actions.setMode('vocab'));
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
            payload.append('answered', JSON.stringify(playersAnswered));
            payload.append('tagId', tagId);
            payload.append('userId', getCookie().dxnlcm);
            // payload.append('areCorrect', JSON.stringify(correctAnswered));
            request.post('/usersanswer/save.php', payload).then((res) => {});

            const payload2 = new FormData();
            payload2.append('userId', getCookie().dxnlcm);
            payload2.append('mark', mark);
            payload2.append('time', new Date().getTime());
            payload2.append('tagId', tagId);
            request.post('/maxpoint/saveMaxPoint.php', payload2).then((res) => {});

            if (tagId === 24) {
                const payload4 = new FormData();
                payload4.append('id', getCookie().dxnlcm);
                payload4.append('lotus', (mark / 10) * -1);
                request.post('/user/addLotus.php', payload4).then((res) => {});
            }

            navigate(config.routes.questionsTable, { replace: true });
        }
    }, [count, countRound]);

    useEffect(() => {
        return () => {
            interpretoRef.current.pause();
            scenarioRef.current.pause();
        };
    }, []);

    useLayoutEffect(() => {
        const timerId = setTimeout(() => {
            if (time > 0) setTime(time - 1);
        }, 1000);
        return () => clearInterval(timerId);
    }, [time]);

    return tagId === 3 ? (
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
            mode="vocab"
            isDisconnect={isDisconnect}
        />
    ) : (
        <Question
            aQuestion={aQuestion}
            time={time}
            maxTime={25}
            count={count}
            setCount={setCount}
            mark={mark}
            setMark={setMark}
            setCorrectAnswered={setCorrectAnswered}
            setPlayersAnswered={setPlayersAnswered}
            setPlayersAnsweredWithId={setPlayersAnsweredWithId}
            readingAnswer={5000}
            maxMark={10}
            instantMark={false}
            waiting={waitingRef.current}
            countRound={countRound} //?
            setCountRound={setCountRound} //?
            mode="vocab"
            isDisconnect={isDisconnect}
        />
    );
}

export default Vocab;
