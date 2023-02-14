import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { images } from '../../assets';
import styles from '../Register/Register.module.scss';
import Header from '../../Component/Layout/Header';
import { request, useGlobalStates, actions } from '../../warehouse';
import config from '../../config';
import Password from '../../Component/Password';

const cx = classNames.bind(styles);

function LogIn() {
    const dispatch = useGlobalStates()[1];
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [verify, setVerify] = useState('');
    const [checked, setChecked] = useState(false);
    const [isEnter, setIsEnter] = useState(false);
    let navigate = useNavigate();

    const toLogIn = () => {
        if (username.length > 0 && password.length > 0) {
            const payload = new FormData();
            payload.append('input', username);
            payload.append('password', password);
            request.post('/user/login.php', payload).then((res) => {
                if (res === 'Tên đăng nhập hoặc mật khẩu không khớp') {
                    setVerify('Thông tin đăng nhập chưa chính xác hoặc tài khoản chưa được duyệt');
                } else {
                    if (res.isConfirm === '0') {
                        setVerify('Tài khoản chưa được xác thực qua email');
                        return;
                    }
                    if (res.isApprove === '0') {
                        setVerify('Tài khoản của bạn chưa được duyệt');
                        return;
                    }
                    if (res.isApprove === '1') {
                        setVerify('Tài khoản của bạn đã bị từ chối');
                        return;
                    }
                    if (new Date().getTime() < res.ban) {
                        setVerify(
                            'Tài khoản của bạn đã bị khóa tới ' +
                                new Date(Number.parseInt(res.ban)).toLocaleString('fr-BE') +
                                '. Vui lòng kiểm tra email hoặc liên hệ fanpage để biết thêm chi tiết.',
                        );
                        return;
                    }
                    dispatch(actions.setIsLogIn(true));
                    setVerify('');
                    if (checked) {
                        document.cookie = 'islogin=true; expires=1 Jan 2122 00:00:00 UTC';
                        document.cookie = 'dxnlcm=' + res.id + '; expires=1 Jan 2122 00:00:00 UTC;';
                    } else {
                        var date = new Date();
                        date.setTime(date.getTime() + 3600000);
                        document.cookie = 'islogin=true; expires=' + date.toUTCString();
                        document.cookie = 'dxnlcm=' + res.id + '; expires=' + date.toUTCString();
                    }
                    navigate(config.routes.home);
                }
            });
        }
    };

    useEffect(() => {
        if (isEnter) toLogIn();
    }, [isEnter]);

    return (
        <div>
            <Header />
            <div className={cx('wrapper')}>
                <div className={cx('form-wrapper')}>
                    <div className={cx('field', 'login-field')}>
                        <label className={cx('field-label')}>Tên đăng nhập hoặc email</label>
                        <input
                            className={cx('field-input')}
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                            onKeyUp={(e) => {
                                if (e.key === 'Enter') toLogIn();
                            }}
                        />
                    </div>
                    <Password setPassword={setPassword} password={password} setIsEnter={setIsEnter} label="Mật khẩu" />
                    <p className={cx('validate-info', 'login-field')}>{verify}</p>
                    <div className={cx('checkbox-login-wrapper')}>
                        <div>
                            <input type="checkbox" onChange={(e) => setChecked(e.target.checked)} />
                            <span className={cx('remember-login')}>Ghi nhớ đăng nhập</span>
                        </div>
                        <Link className={cx('forget-password')} to={config.routes.forget}>
                            Quên mật khẩu?
                        </Link>
                    </div>
                    <button className={cx('register-button')} onClick={toLogIn}>
                        Đăng nhập
                    </button>
                </div>
                <img className={cx('logo')} src={images.aolangOpacity} alt="" />
            </div>
        </div>
    );
}

export default LogIn;
