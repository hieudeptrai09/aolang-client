import { useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { request, useGlobalStates, actions, getCookie, HOST_URL } from '../../../warehouse';
import Question from '../component/Question';
import config from '../../../config';

function Deciphering({ tagId, totalQuestion, award }) {
    const dispatch = useGlobalStates()[1];

    const [aQuestion, setAQuestion] = useState({});
    const [ids, setIds] = useState([]);
    const [count, setCount] = useState(1);
    const [mark, setMark] = useState(0);
    const [correctAnswered, setCorrectAnswered] = useState([]);
    const [playersAnswered, setPlayersAnswered] = useState([]);
    const [playersAnsweredWithId, setPlayersAnsweredWithId] = useState([]);
    const [time, setTime] = useState(-1);
    const [askedQuestion, setAskedQuestion] = useState([]);
    const [maxTime, setMaxTime] = useState(0);
    const [countRound, setCountRound] = useState(0);
    const [isDisconnect, setIsDisconnect] = useState(false);
    let navigate = useNavigate();

    const answerGenerator = (word) => {
        let words = word.split('~|');
        word = words[Math.floor(Math.random() * words.length)].toLowerCase().trim();
        return word;
    };

    const questionGenerator = (word) => {
        var blankSpace = '';

        if (tagId === 21 || tagId === 22) {
            const key = Math.floor(Math.random() * 25) + 1;
            for (let i = 0; i < word.length; i++) {
                if (word.charAt(i) !== ' ' && word.charAt(i) !== '-') {
                    let letter = word.charCodeAt(i);
                    letter = letter + key;
                    if (letter > 122) letter = letter - 26;
                    blankSpace += String.fromCharCode(letter);
                } else blankSpace += word.charAt(i);
            }
            if (tagId === 21) return 'Giải mật mã ' + blankSpace + ' với khóa là ' + key;
            else return 'Giải mật mã ' + blankSpace;
        } else if (tagId === 23) {
            for (let i = 0; i < word.length; i++) {
                if (word.charAt(i) !== ' ' && word.charAt(i) !== '-') {
                    let letter = word.charCodeAt(i);
                    letter = 219 - letter; //219 = 'z'+'a'
                    blankSpace += String.fromCharCode(letter);
                } else blankSpace += word.charAt(i);
            }
            return 'Giải mật mã ' + blankSpace;
        } else if (tagId === 33) {
            const code = [1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 8, 8, 9, 9, 0, 0];
            for (let i = 0; i < word.length; i++) {
                if (word.charAt(i) !== ' ' && word.charAt(i) !== '-') {
                    blankSpace += code[word.charCodeAt(i) - 97];
                } else blankSpace += word.charAt(i);
            }
            return 'Giải mật mã ' + blankSpace + ' với đáp án là một từ tiếng Anh có nghĩa';
        }
    };

    useEffect(() => {
        if (count > 0 && count <= totalQuestion) {
            request
                .get('/vocab/getARandomWord.php', {
                    params: {
                        ids: JSON.stringify(ids),
                    },
                })
                .then((data) => {
                    let question = {};
                    let answer = answerGenerator(data.word);
                    question.question = questionGenerator(answer);
                    question.answer = answer;
                    question.id = data.id;
                    if (tagId === 33) question.image = HOST_URL + '/telephone.jpg';
                    else question.image = HOST_URL + '/alphabet.jpg';
                    setMaxTime(question.answer.trim().length * 5);
                    setAQuestion(question);
                    setIds([...ids, data.id]);
                    setTime(question.answer.trim().length * 5);
                    setAskedQuestion([...askedQuestion, question]);
                })
                .catch(() => {
                    setIsDisconnect(true);
                });
        } else if (count > totalQuestion) {
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

            dispatch(actions.setMode('deciphering'));
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

            const payload4 = new FormData();
            payload4.append('id', getCookie().dxnlcm);
            payload4.append('lotus', (mark / 10) * -award);
            request.post('/user/addLotus.php', payload4).then((res) => {});

            if (totalQuestion > 0) navigate(config.routes.questionsTable, { replace: true });
        }
    }, [count, countRound]);

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
            maxTime={maxTime}
            waiting={0}
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
            countRound={countRound}
            setCountRound={setCountRound}
            mode="deciphering"
            isDisconnect={isDisconnect}
        />
    );
}

export default Deciphering;
