import { Fragment, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk, faFileArrowUp, faPhotoFilm } from '@fortawesome/free-solid-svg-icons';
import Popup from 'reactjs-popup';
import { getCookie, request, HOST_URL } from '../../warehouse';
import CustomizeAudio from '../../Component/CustomizeAudio';
import config from '../../config';
import classNames from 'classnames/bind';
import styles from './AddQuestion.module.scss';
import Header from '../../Component/Layout/Header';
const cx = classNames.bind(styles);

function AddQuestion() {
    const navigate = useNavigate();
    const aQuestion = {
        question: '',
        answer: '',
        image: '',
        explanation: '',
        audio: '',
        keyWords: '',
        difficulty: 10,
        type: 'marathon',
    };
    const [question, setQuestion] = useState(aQuestion);
    const [index, setIndex] = useState(0);
    const [saveStates, setSaveStates] = useState('');
    const [tags, setTags] = useState([4]);

    const toAddATag = () => {
        setTags([...tags, 0]);
    };

    const toChangeTag = (value, tagIndex) => {
        let newTags = [...tags];
        newTags[tagIndex] = Number.parseInt(value);
        setTags(newTags);
    };

    const toDeleteTags = (tagIndex) => {
        tags.splice(tagIndex, 1);
        setTags([...tags]);
    };

    const updateQuestion = (value, position) => {
        question[position] = value;
        setQuestion(question);
    };

    useEffect(() => {
        setIndex(index + 1);
    }, []);

    const uploadMedia = (e) => {
        var file = document.getElementById('upload-media').files[0];
        if (file.size > 1048576) alert('File phải nhỏ hơn 1MB');
        else {
            const payload = new FormData(document.getElementById('upload-media-form'));
            payload.append('id', getCookie().dxnlcm);
            payload.append('type', 'media');
            request.post('/file/uploadFile.php', payload).then((res) => {
                if (res.path.indexOf('/') < 0) {
                    alert(res.path);
                } else {
                    document.getElementById('upload-' + res.type + '-link').value = HOST_URL + res.path;
                    updateQuestion(HOST_URL + res.path, res.type);
                }
            });
        }
    };

    const toSave = () => {
        if (question.question !== '' && question.answer !== '') {
            const payload = new FormData();
            payload.append('question', JSON.stringify(question));
            payload.append('tag', JSON.stringify(tags));
            payload.append('id', getCookie().dxnlcm);
            request.post('/pendingQuestion/sendPendingQuestion.php', payload).then((res) => {
                console.log(res);
                if (!!res) {
                    setSaveStates('Đã lưu thành công');
                } else setSaveStates('Lưu thất bại');
                setTimeout(() => {
                    setSaveStates('');
                    setQuestion(aQuestion);
                    setIndex(index + 1);
                    // setTags([4])
                    document.getElementById('captain').classList.remove('popupOpen');
                }, 1000);
            });
        } else {
            let states = '';
            if (question.question === '') states += 'Câu hỏi để trống. ';
            if (question.answer === '') states += 'Câu trả lời để trống.';
            setSaveStates(states);
        }
    };

    if (getCookie().islogin || getCookie().dxnlcm !== undefined) {
        return (
            <Fragment>
                <Header isLogin />
                <div className={cx('wrapper')} id="captain">
                    <div className={cx('step20-wrapper')}>
                        <div className={cx('type-area')} id="question-captain" key={index}>
                            <div className={cx('field-wrapper')}>
                                <label className={cx('field-label')}>Câu hỏi</label>
                                <textarea
                                    className={cx('field-input', 'question-input')}
                                    defaultValue={question.question}
                                    onChange={(e) => updateQuestion(e.target.value, 'question')}
                                ></textarea>
                            </div>
                            <div className={cx('field-wrapper')}>
                                <label className={cx('field-label')}>Câu trả lời</label>
                                <textarea
                                    className={cx('field-input', 'answer-input')}
                                    defaultValue={question.answer}
                                    onChange={(e) => updateQuestion(e.target.value, 'answer')}
                                ></textarea>
                            </div>
                            <div className={cx('field-wrapper')}>
                                <label className={cx('field-label')}>Giải thích</label>
                                <textarea
                                    className={cx('field-input', 'question-input')}
                                    defaultValue={question.explanation}
                                    onChange={(e) => updateQuestion(e.target.value, 'explanation')}
                                ></textarea>
                            </div>
                            <div className={cx('small-text-wrapper')}>
                                <div className={cx('field-wrapper')}>
                                    <label className={cx('media-label')}>Link ảnh</label>
                                    <textarea
                                        id="upload-image-link"
                                        className={cx('field-input', 'media-input')}
                                        defaultValue={question.image}
                                        onChange={(e) => updateQuestion(e.target.value, 'image')}
                                    ></textarea>
                                </div>
                                <div className={cx('field-wrapper')}>
                                    <label className={cx('media-label')}>Link âm thanh</label>
                                    <textarea
                                        id="upload-audio-link"
                                        className={cx('field-input', 'media-input')}
                                        defaultValue={question.audio}
                                        onChange={(e) => updateQuestion(e.target.value, 'audio')}
                                    ></textarea>
                                </div>
                                <div className={cx('file-input-wrapper')}>
                                    <form id="upload-media-form" encType="multipart/form-data">
                                        <label className={cx('add-btn-upload')} htmlFor="upload-media">
                                            <FontAwesomeIcon icon={faFileArrowUp} />
                                        </label>
                                        <input
                                            type="file"
                                            id="upload-media"
                                            name="myFile"
                                            onChange={(e) => uploadMedia(e)}
                                        />
                                    </form>
                                </div>
                                <div className={cx('file-input-wrapper')}>
                                    <Popup
                                        modal
                                        trigger={
                                            <button className={cx('add-btn-upload')}>
                                                <FontAwesomeIcon icon={faPhotoFilm} />
                                            </button>
                                        }
                                        onOpen={() =>
                                            document.getElementById('question-captain').classList.add('popupOpen')
                                        }
                                        onClose={() =>
                                            document.getElementById('question-captain').classList.remove('popupOpen')
                                        }
                                    >
                                        {(close) => (
                                            <div
                                                className={cx('file-popup-wrapper', {
                                                    'popup-wrapper': true,
                                                })}
                                            >
                                                <button className="close" onClick={close}>
                                                    &times;
                                                </button>
                                                {question.image && (
                                                    <img className={cx('preview-image')} src={question.image} alt="" />
                                                )}
                                                {question.audio && (
                                                    <CustomizeAudio src={question.audio} autoplay={false} />
                                                )}
                                            </div>
                                        )}
                                    </Popup>
                                </div>
                            </div>
                            <div className={cx('dropdown-wrapper')}>
                                <div className={cx('field-wrapper')}>
                                    <label className={cx('media-label')}>Từ khóa tìm kiếm</label>
                                    <textarea
                                        className={cx('field-input')}
                                        defaultValue={question.keyWords}
                                        onChange={(e) => updateQuestion(e.target.value, 'keyWords')}
                                    ></textarea>
                                </div>
                                <div className={cx('field-wrapper')}>
                                    <label className={cx('field-label')}>Độ khó</label>
                                    <select
                                        defaultValue={question.difficulty}
                                        className={cx('dropdown-input')}
                                        onChange={(e) => updateQuestion(e.target.value, 'difficulty')}
                                    >
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                        <option value={30}>30</option>
                                        <option value={40}>40</option>
                                    </select>
                                </div>
                                <div className={cx('field-wrapper')}>
                                    <label className={cx('field-label')}>Vòng thi</label>
                                    <select
                                        defaultValue={question.type}
                                        className={cx('dropdown-input')}
                                        onChange={(e) => updateQuestion(e.target.value, 'type')}
                                    >
                                        <option value="marathon">Marathon</option>
                                        <option value="hurdling">Hurdling</option>
                                    </select>
                                </div>
                            </div>
                            <div className={cx('dropdown-wrapper', 'tag-wrapper')}>
                                {tags.map((tag, tagIndex) => (
                                    <div key={tagIndex} className={cx('field-wrapper')}>
                                        <label className={cx('field-label')}>Lĩnh vực</label>
                                        <select
                                            className={cx('dropdown-input')}
                                            value={tag}
                                            onChange={(e) => toChangeTag(e.target.value, tagIndex)}
                                        >
                                            <option value="0" disabled></option>
                                            <option value="4">Toán học</option>
                                            <option value="5">Vật lí</option>
                                            <option value="6">Hóa học</option>
                                            <option value="7">Sinh học</option>
                                            <option value="8">Văn học</option>
                                            <option value="9">Lịch sử</option>
                                            <option value="10">Địa lí</option>
                                            <option value="11">Thể thao</option>
                                            <option value="12">Nghệ thuật</option>
                                            <option value="13">Hiểu biết chung</option>
                                            <option value="14">Tiếng Anh</option>
                                            <option value="15">Lĩnh vực khác</option>
                                        </select>
                                        <button className={cx('delete-btn')} onClick={() => toDeleteTags(tagIndex)}>
                                            Xóa lĩnh vực này
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className={cx('function-area')}>
                                <button className={cx('add-btn-item')} onClick={() => toAddATag()}>
                                    Thêm một lĩnh vực
                                </button>
                                <Popup
                                    modal
                                    trigger={
                                        <button className={cx('add-btn-item')}>
                                            <FontAwesomeIcon icon={faFloppyDisk} />
                                        </button>
                                    }
                                    onOpen={() => document.getElementById('captain').classList.add('popupOpen')}
                                    onClose={() => document.getElementById('captain').classList.remove('popupOpen')}
                                >
                                    {(close) => (
                                        <div className="popup-wrapper">
                                            <p>Bạn có muốn lưu không?</p>
                                            <div className={cx('popup-header')}>
                                                <button className="popup-btn wrong-color" onClick={close}>
                                                    Không
                                                </button>
                                                <button className="popup-btn correct-color" onClick={toSave}>
                                                    Có
                                                </button>
                                            </div>
                                            {saveStates !== '' && <p className="save-successfully">{saveStates}</p>}
                                        </div>
                                    )}
                                </Popup>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    } else {
        navigate(config.routes.login);
    }
}

export default AddQuestion;
