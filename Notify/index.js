import { useState, useEffect } from 'react';
import { getCookie, request } from '../../warehouse';

function Notify() {
    const cookies = getCookie();
    const [mode, setMode] = useState('');
    const [results, setResults] = useState([]);
    const [chosen, setChosen] = useState(-1);

    useEffect(() => {
        request
            .get('/contribution/getContributions.php', {
                params: {
                    id: cookies.uid,
                },
            })
            .then((res) => {
                setResults(res);
            });
    }, []);

    return (
        <div>
            <aside>
                {results.map((result, index) => {
                    return (
                        <button key={index} onClick={() => setChosen(index)}>
                            Admin đã {result.approvement === '1' ? 'từ chối ' : 'phê duyệt '}
                            {result.mode === 'report' ? 'báo cáo về: ' : 'câu hỏi: '}
                            {result.question}
                        </button>
                    );
                })}
            </aside>
            {chosen >= 0 && (
                <div>
                    <p>{results[chosen].question}</p>
                    <p>{results[chosen].answer}</p>
                    <img src={results[chosen].img} alt="logo Ao" />
                    <p>{results[chosen].message}</p>
                </div>
            )}
        </div>
    );
}

export default Notify;
