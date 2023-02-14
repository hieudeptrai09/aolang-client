import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';
import Popup from 'reactjs-popup';
import style from './Register.module.scss';
import { useEffect, useState } from 'react';
import Header from '../../Component/Layout/Header';
import { images } from '../../assets';
import { request } from '../../warehouse';
import config from '../../config';

const cx = classNames.bind(style);

function Register() {
    const [open, setOpen] = useState(false);
    const [securityQuestion, setSecurityQuestion] = useState('');
    const [securityAnswer, setSecurityAnswer] = useState('');
    const [dayofBirth, setDayofBirth] = useState('');
    const [monthofBirth, setMonthofBirth] = useState('');
    const [yearofBirth, setYearofBirth] = useState('');
    const [securityQuestionVerify, setSecurityQuestionVerify] = useState('');
    const [securityAnswerVerify, setSecurityAnswerVerify] = useState('');
    const [birthdateVerify, setBirthdateVerify] = useState('');
    const [fullname, setFullname] = useState('');
    const [school, setSchool] = useState('');
    const [province, setProvince] = useState('');
    const [username, setUsername] = useState('');
    const [id, setId] = useState('');
    const [isConfirm, setIsConfirm] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        const params = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        });
        setId(params.verifyCode);
        request
            .get('/user/search.php', {
                params: {
                    id: params.verifyCode,
                },
            })
            .then((res) => {
                setFullname(res.fullname);
                setSchool(res.schoolName);
                setProvince(res.provinceName);
                setUsername(res.username);
                setIsConfirm(Number.parseInt(res.isConfirm));
            });
    }, []);

    function toVerify() {
        let result = true;

        if (securityQuestion === 0) {
            setSecurityQuestionVerify('Thông tin bắt buộc');
            result = false;
        } else {
            setSecurityQuestionVerify('');
        }

        if (securityAnswer.length === 0) {
            setSecurityAnswerVerify('Thông tin bắt buộc');
            result = false;
        } else {
            setSecurityAnswerVerify('');
        }

        if (dayofBirth.length === 0) {
            setBirthdateVerify('Thông tin bắt buộc');
            result = false;
        } else {
            setBirthdateVerify('');
        }

        if (monthofBirth.length === 0) {
            setBirthdateVerify('Thông tin bắt buộc');
            result = false;
        } else {
            setBirthdateVerify('');
        }

        if (yearofBirth.length === 0) {
            setBirthdateVerify('Thông tin bắt buộc');
            result = false;
        } else {
            let currentYear = new Date().getFullYear();
            if (yearofBirth > currentYear || yearofBirth < currentYear - 100) {
                setBirthdateVerify('Năm sinh không hợp lệ');
                result = false;
            } else {
                setBirthdateVerify('');
            }
        }

        return result;
    }

    function toSubmit() {
        let result = toVerify();
        if (result) {
            const payload = new FormData();
            payload.append('id', id);
            payload.append('securityQuestion', securityQuestion);
            payload.append('securityAnswer', securityAnswer);
            payload.append('birthday', dayofBirth + '/' + monthofBirth + '/' + yearofBirth);
            payload.append('time', new Date().getTime());
            request.post('/user/addInfo.php', payload).then((res) => {});
        }
        setOpen(result);
    }

    function closePopup() {
        setOpen(false);
    }

    return (
        <div className={cx('form')}>
            <Header isLogin={false} />
            {isConfirm === 0 ? (
                <div
                    className={cx('wrapper', {
                        popupOpen: open,
                    })}
                >
                    <div className={cx('user')}>
                        <img className={cx('avatar')} src={images.defaultAvatar} alt="" />
                        <h3 className={cx('fullname-confirm', 'info-confirm')}>{fullname.toUpperCase()}</h3>
                        <p className={cx('username-confirm', 'info-confirm')}>{'@' + username}</p>
                        <p className={cx('info-confirm')}>{school}</p>
                        <p className={cx('info-confirm')}>{province}</p>
                    </div>
                    <div className={cx('form-wrapper')}>
                        <h2 className={cx('title')}>HOÀN TẤT ĐĂNG KÍ</h2>
                        <div>
                            <div className={cx('a-line-field')}>
                                <div className={cx('field')}>
                                    <label className={cx('field-label')}>
                                        Ngày<span>*</span>
                                    </label>
                                    <select
                                        className={cx('field-input', 'day-input')}
                                        onChange={(e) => setDayofBirth(e.target.value)}
                                        value={dayofBirth}
                                    >
                                        <option value="" disabled></option>
                                        <option value="01">1</option>
                                        <option value="02">2</option>
                                        <option value="03">3</option>
                                        <option value="04">4</option>
                                        <option value="05">5</option>
                                        <option value="06">6</option>
                                        <option value="07">7</option>
                                        <option value="08">8</option>
                                        <option value="09">9</option>
                                        <option value="10">10</option>
                                        <option value="11">11</option>
                                        <option value="12">12</option>
                                        <option value="13">13</option>
                                        <option value="14">14</option>
                                        <option value="15">15</option>
                                        <option value="16">16</option>
                                        <option value="17">17</option>
                                        <option value="18">18</option>
                                        <option value="19">19</option>
                                        <option value="20">20</option>
                                        <option value="21">21</option>
                                        <option value="22">22</option>
                                        <option value="23">23</option>
                                        <option value="24">24</option>
                                        <option value="25">25</option>
                                        <option value="26">26</option>
                                        <option value="27">27</option>
                                        <option value="28">28</option>
                                        {(monthofBirth !== '2' ||
                                            (monthofBirth === '2' &&
                                                (yearofBirth % 400 === 0 ||
                                                    (yearofBirth % 4 === 0 && yearofBirth % 100 !== 0)))) && (
                                            <option value="29">29</option>
                                        )}
                                        {monthofBirth !== '2' && <option value="30">30</option>}
                                        {monthofBirth !== '2' &&
                                            monthofBirth !== '4' &&
                                            monthofBirth !== '6' &&
                                            monthofBirth !== '9' &&
                                            monthofBirth !== '11' && <option value="31">31</option>}
                                    </select>
                                </div>
                                <div className={cx('field')}>
                                    <label className={cx('field-label')}>
                                        Tháng<span>*</span>
                                    </label>
                                    <select
                                        className={cx('field-input', 'month-input')}
                                        onChange={(e) => setMonthofBirth(e.target.value)}
                                        value={monthofBirth}
                                    >
                                        <option value="" disabled></option>
                                        <option value="01">1</option>
                                        <option value="02">2</option>
                                        <option value="03">3</option>
                                        <option value="04">4</option>
                                        <option value="05">5</option>
                                        <option value="06">6</option>
                                        <option value="07">7</option>
                                        <option value="08">8</option>
                                        <option value="09">9</option>
                                        <option value="10">10</option>
                                        <option value="11">11</option>
                                        <option value="12">12</option>
                                    </select>
                                </div>
                                <div className={cx('field')}>
                                    <label className={cx('field-label')}>
                                        Năm sinh<span>*</span>
                                    </label>
                                    <input
                                        className={cx('field-input', 'year-input')}
                                        type="numbers"
                                        onChange={(e) => setYearofBirth(e.target.value)}
                                        value={yearofBirth}
                                    />
                                </div>
                            </div>
                            <p className={cx('validate-info')}>{birthdateVerify}</p>
                        </div>
                        <div className={cx('field')}>
                            <label className={cx('field-label', 'security-question-label')}>
                                Câu hỏi bảo mật<span>*</span>
                            </label>
                            <select
                                className={cx('field-input')}
                                onChange={(e) => setSecurityQuestion(e.target.value)}
                                value={securityQuestion}
                            >
                                <option value="" disabled></option>
                                <option value="1">Bạn thích ăn món gì?</option>
                                <option value="2">Người yêu của bạn tên là gì?</option>
                                <option value="3">Bạn thích loài động vật nào nhất?</option>
                            </select>
                            <p className={cx('validate-info')}>{securityQuestionVerify}</p>
                        </div>
                        <div className={cx('field')}>
                            <label className={cx('field-label')}>
                                Đáp án câu hỏi bảo mật<span>*</span>
                            </label>
                            <input
                                className={cx('field-input')}
                                onChange={(e) => setSecurityAnswer(e.target.value)}
                                value={securityAnswer}
                            />
                            <p className={cx('validate-info')}>{securityAnswerVerify}</p>
                        </div>
                        <button className={cx('confirm-button')} onClick={toSubmit}>
                            Hoàn tất!
                        </button>
                        <Popup open={open} onClose={closePopup}>
                            <div className={cx('confirm-wrapper')}>
                                <div>
                                    <img className={cx('check-icon')} src={images.check} alt="" />
                                    <p className={cx('confirm-text')}>
                                        Đăng kí thông tin hoàn tất. Vui lòng chờ tài khoản của bạn được chúng tôi duyệt.
                                    </p>
                                </div>
                                <button
                                    className={cx('confirm-button-popup')}
                                    onClick={() => navigate(config.routes.home)}
                                >
                                    Xác nhận
                                </button>
                            </div>
                        </Popup>
                    </div>
                </div>
            ) : (
                <div className={cx('wrapper')}>BẠN ĐÃ XÁC THỰC TÀI KHOẢN NÀY RỒI</div>
            )}
        </div>
    );
}

export default Register;
