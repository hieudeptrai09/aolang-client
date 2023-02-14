import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Account.module.scss';
import Header from '../../Component/Layout/Header';
import config from '../../config';
import { getCookie } from '../../warehouse';
import ChangePassword from './ChangePassword';
import PersonalInformation from './PersonalInformation';
import SentQuestion from './SentQuestion';
import LovedQuestion from './LovedQuestion';
import LogOut from './LogOut';
import AccountHeader from './AccountHeader';

const cx = classNames.bind(styles);

function Account() {
    const navigate = useNavigate();

    const [changed, setChanged] = useState(0);
    const [contentNow, setContentNow] = useState(1);

    if (getCookie().islogin || getCookie().dxnlcm !== undefined) {
        return (
            <div>
                <Header isLogin />
                <div className={cx('wrapper')}>
                    <div className={cx('menu-sidebar')}>
                        <button
                            className={cx('menu-item', 'first-menu-item', {
                                active: contentNow === 1,
                            })}
                            onClick={() => setContentNow(1)}
                        >
                            Thông tin cá nhân
                        </button>
                        <button
                            className={cx('menu-item', {
                                active: contentNow === 2,
                            })}
                            onClick={() => setContentNow(2)}
                        >
                            Đổi mật khẩu
                        </button>
                        <button
                            className={cx('menu-item', {
                                active: contentNow === 3,
                            })}
                            onClick={() => setContentNow(3)}
                        >
                            Câu hỏi đóng góp
                        </button>
                        <button
                            className={cx('menu-item', {
                                active: contentNow === 4,
                            })}
                            onClick={() => setContentNow(4)}
                        >
                            Câu hỏi ưa thích
                        </button>
                        <button className={cx('menu-item')} onClick={() => setContentNow(5)}>
                            Đăng xuất
                        </button>
                    </div>
                    <div>
                        <AccountHeader changed={changed} setChanged={setChanged} />
                        {contentNow === 1 ? (
                            <PersonalInformation setChanged={setChanged} />
                        ) : contentNow === 2 ? (
                            <ChangePassword />
                        ) : contentNow === 3 ? (
                            <SentQuestion />
                        ) : contentNow === 4 ? (
                            <LovedQuestion />
                        ) : (
                            <LogOut />
                        )}
                    </div>
                </div>
            </div>
        );
    } else {
        navigate(config.routes.login);
    }
}

export default Account;
