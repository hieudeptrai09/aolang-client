import classNames from 'classnames/bind';
import { useRef, useState } from 'react';
import Popup from 'reactjs-popup';
import { images } from '../../assets';
import styles from '../Register/Register.module.scss';
import Header from '../../Component/Layout/Header';
import { request } from '../../warehouse';

const cx = classNames.bind(styles);

function ForgetPassword() {
    const [username, setUsername] = useState('');
    const [verify, setVerify] = useState('');
    const [open, setOpen] = useState(false);
    const verifyResult = useRef();

    const toVerify = () => {
        request
            .get('/user/checkAccount.php', {
                params: {
                    input: username,
                },
            })
            .then((res) => {
                verifyResult.current = res;
                if (!res) {
                    setVerify('Tên đăng nhập hoặc email này không tồn tại');
                    return false;
                } else {
                    setVerify('');
                    return true;
                }
            });
        return verifyResult.current;
    };

    const toReset = () => {
        if (toVerify()) {
            const payload = new FormData();
            payload.append('input', username);
            payload.append('time', new Date().getTime());
            request.post('/user/resetPassword.php', payload).then((res) => {
                setOpen(res);
            });
        }
    };

    const toResetWhenEnter = (e) => {
        if (e.keyCode === 13) toReset();
    };

    function closePopup() {
        setOpen(false);
    }

    return (
        <div>
            <Header />
            <div
                className={cx('wrapper', {
                    popupOpen: open,
                })}
            >
                <div className={cx('form-wrapper')}>
                    <div className={cx('field', 'login-field')}>
                        <label className={cx('field-label')}>Tên đăng nhập hoặc email</label>
                        <input
                            className={cx('field-input')}
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                            onKeyUp={(e) => toResetWhenEnter(e)}
                            onBlur={() => toVerify()}
                        />
                    </div>
                    <p className={cx('validate-info', 'login-field')}>{verify}</p>
                    <button className={cx('register-button')} onClick={toReset}>
                        Gửi thông tin
                    </button>
                </div>
                <img className={cx('logo')} src={images.aolangOpacity} alt="" />
                <Popup open={open} onClose={closePopup}>
                    <div className={cx('confirm-wrapper')}>
                        <div>
                            <img className={cx('check-icon')} src={images.check} alt="" />
                            <p className={cx('confirm-text')}>Đã gửi mail thành công</p>
                        </div>
                        <button className={cx('confirm-button-popup')} onClick={closePopup}>
                            Xác nhận
                        </button>
                    </div>
                </Popup>
            </div>
        </div>
    );
}

export default ForgetPassword;
