import { useEffect } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { request } from '../../warehouse';

function QuillRender({ filename }) {
    useEffect(() => {
        const quill = new Quill('.quill', {
            theme: 'bubble',
        });
        quill.disable();
        request
            .get('/static/getContents.php', {
                params: {
                    filename: filename,
                },
            })
            .then((res) => quill.setContents(res));
    }, []);

    return <div className="quill"></div>;
}

export default QuillRender;
