import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { images } from '../../assets';
import Popup from 'reactjs-popup';
import styles from '../Register/Register.module.scss';
import Header from '../../Component/Layout/Header';
import Password from '../../Component/Password';
import { request } from '../../warehouse';
import config from '../../config';

const cx = classNames.bind(styles);

function ResetPassword() {
    const [password, setPassword] = useState('');
    const [password2nd, setPassword2nd] = useState('');
    const [passwordVerify, setPasswordVerify] = useState('');
    const [password2ndVerify, setPassword2ndVerify] = useState('');
    const [isEnter, setIsEnter] = useState(false);
    const [open, setOpen] = useState(false);
    const [userId, setUserId] = useState('');
    const [time, setTime] = useState('');
    const [isSet, setIsSet] = useState(0);
    const [id, setId] = useState('');
    let navigate = useNavigate();

    useEffect(() => {
        const params = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        });
        setId(params.resetCode);
        const payload = new FormData();
        payload.append('resetCode', params.resetCode);
        request.post('/user/getInfoReset.php', payload).then((res) => {
            setIsSet(Number.parseInt(res.isSet));
            setTime(res.time);
            setUserId(res.userid);
        });
    }, []);

    const toVerify = () => {
        let result = true;

        if (password.length < 8) {
            setPasswordVerify('Mật khẩu cần phải có tối thiểu 8 kí tự');
            result = false;
        } else if (!/^[\x00-\x7F]*$/.test(password)) {
            setPasswordVerify('Mật khẩu không được dùng chữ cái không có trong bảng mã ASCII');
            result = false;
        } else {
            setPasswordVerify('');
        }

        if (password2nd !== password) {
            setPassword2ndVerify('Mật khẩu xác nhận không khớp với mật khẩu gốc');
            result = false;
        } else {
            setPassword2ndVerify('');
        }

        return result;
    };

    const toReset = () => {
        if (toVerify()) {
            const payload2 = new FormData();
            payload2.append('id', userId);
            payload2.append('password', password);
            request.post('/user/changePassword.php', payload2).then((res) => {
                if (res) {
                    const payload3 = new FormData();
                    payload3.append('id', id);
                    request.post('/user/changeResetIsSet.php', payload3).then((res) => {});
                }
                setOpen(res);
            });
        }
    };

    useEffect(() => {
        if (isEnter) toReset();
    }, [isEnter]);

    function closePopup() {
        setOpen(false);
    }

    return (
        <div>
            <Header />
            {isSet === 1 || new Date().getTime() - time > 86400000 ? (
                <div className={cx('wrapper')}>ĐƯỜNG LINK CẤP LẠI MẬT KHẨU NÀY ĐÃ HẾT HẠN.</div>
            ) : (
                <div
                    className={cx('wrapper', {
                        popupOpen: open,
                    })}
                >
                    <div className={cx('form-wrapper')}>
                        <div className={cx('field', 'login-field')}>
                            <Password
                                password={password}
                                setPassword={setPassword}
                                label="Mật khẩu mới"
                                setIsEnter={setIsEnter}
                            />
                            <p className={cx('validate-info', 'login-field')}>{passwordVerify}</p>
                        </div>
                        <div className={cx('field', 'login-field')}>
                            <Password
                                password={password2nd}
                                setPassword={setPassword2nd}
                                label="Nhắc lại mật khẩu mới"
                                setIsEnter={setIsEnter}
                            />
                            <p className={cx('validate-info', 'login-field')}>{password2ndVerify}</p>
                        </div>
                        <button className={cx('register-button')} onClick={toReset}>
                            Gửi thông tin
                        </button>
                        <Popup open={open} onClose={closePopup}>
                            <div className={cx('confirm-wrapper')}>
                                <div>
                                    <img className={cx('check-icon')} src={images.check} alt="" />
                                    <p className={cx('confirm-text')}>Thiết lập lại mật khẩu thành công</p>
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
                    <img className={cx('logo')} src={images.aolangOpacity} alt="" />
                </div>
            )}
        </div>
    );
}

export default ResetPassword;
