import { useRef, useState } from 'react';
import classNames from 'classnames/bind';
import Popup from 'reactjs-popup';
import Password from '../../../Component/Password';
import { images } from '../../../assets';
import styles from './ChangePassword.module.scss';
import { getCookie, request } from '../../../warehouse';

const cx = classNames.bind(styles);

function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPassword2nd, setNewPassword2nd] = useState('');
    const [currentPasswordVerify, setCurrentPasswordVerify] = useState('');
    const [newPasswordVerify, setNewPasswordVerify] = useState('');
    const [newPassword2ndVerify, setNewPassword2ndVerify] = useState('');
    const [open, setOpen] = useState(false);

    const passwordVerify = useRef();

    function toCurrentPasswordVerify() {
        request
            .get('/user/checkPassword.php', {
                params: {
                    id: getCookie().dxnlcm,
                    password: currentPassword,
                },
            })
            .then((res) => {
                passwordVerify.current = res;
                if (!res) {
                    setCurrentPasswordVerify('Hãy nhập mật khẩu hợp lệ rồi thử lại nha');
                    return false;
                } else {
                    setCurrentPasswordVerify('');
                    return true;
                }
            });
        return passwordVerify.current;
    }

    const toNewPasswordVerify = () => {
        let result = true;

        if (newPassword.length < 8) {
            setNewPasswordVerify('Mật khẩu cần phải có tối thiểu 8 kí tự');
            result = false;
        } else if (!/^[\x00-\x7F]*$/.test(newPassword)) {
            setNewPasswordVerify('Mật khẩu không được dùng chữ cái không có trong bảng mã ASCII');
            result = false;
        } else {
            setNewPasswordVerify('');
        }

        return result;
    };

    const toNewPassword2ndVerify = () => {
        let result = true;
        if (newPassword2nd !== newPassword) {
            setNewPassword2ndVerify('Mật khẩu xác nhận không khớp với mật khẩu gốc');
            result = false;
        } else {
            setNewPassword2ndVerify('');
        }
        return result;
    };

    const toSave = () => {
        if (passwordVerify.current && toNewPasswordVerify() && toNewPassword2ndVerify()) {
            const payload = new FormData();
            payload.append('id', getCookie().dxnlcm);
            payload.append('password', newPassword);
            request.post('/user/changePassword.php', payload).then((res) => {
                setOpen(res);
            });
        }
    };

    function closePopup() {
        setOpen(false);
    }

    return (
        <div
            className={cx('wrapper', {
                popupOpen: open,
            })}
        >
            <div className={cx('header-wrapper')}>
                <h4 className={cx('header')}>Thông tin cá nhân</h4>
                <p className={cx('post-header')}>Vui lòng cập nhật đầy đủ các thông tin thiết yếu.</p>
            </div>
            <div className={cx('input-wrapper')}>
                <div className={cx('cell-input-wrapper')}>
                    <Password
                        password={currentPassword}
                        setPassword={setCurrentPassword}
                        label="Nhập mật khẩu hiện tại"
                        onBlur={() => toCurrentPasswordVerify()}
                        width="70vh"
                        marginLeft="0vh"
                    />
                    <p className={cx('validate-info')}>{currentPasswordVerify}</p>
                </div>
                <div className={cx('cell-input-wrapper')}>
                    <Password
                        password={newPassword}
                        setPassword={setNewPassword}
                        label="Nhập mật khẩu mới"
                        onBlur={() => toNewPasswordVerify()}
                        width="70vh"
                        marginLeft="0vh"
                    />
                    <p className={cx('validate-info')}>{newPasswordVerify}</p>
                </div>
                <div className={cx('cell-input-wrapper')}>
                    <Password
                        password={newPassword2nd}
                        setPassword={setNewPassword2nd}
                        label="Nhập lại mật khẩu mới"
                        onBlur={() => toNewPassword2ndVerify()}
                        width="70vh"
                        marginLeft="0vh"
                    />
                    <p className={cx('validate-info')}>{newPassword2ndVerify}</p>
                </div>
                <button onClick={toSave} className={cx('save-btn')}>
                    Lưu
                </button>
                <Popup open={open} onClose={closePopup}>
                    <div className={cx('confirm-wrapper')}>
                        <div>
                            <img className={cx('check-icon')} src={images.check} alt="" />
                            <p className={cx('confirm-text')}>Đổi mật khẩu thành công</p>
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

export default ChangePassword;
