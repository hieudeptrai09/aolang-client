import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import { images } from '../../../assets';
import config from '../../../config';
import { getCookie, request } from '../../../warehouse';

const cx = classNames.bind(styles);

function Header({ isLogin }) {
    useEffect(() => {
        if (isLogin) {
            request
                .get('/user/isBan.php', {
                    params: {
                        id: getCookie().dxnlcm,
                    },
                })
                .then((res) => {
                    let time = new Date().getTime();
                    if (time < res) {
                        var date = new Date();
                        date.setTime(date.getTime() - 3600000);
                        document.cookie = 'islogin=true; expires=' + date.toUTCString();
                        document.cookie = 'dxnlcm=sth; expires=' + date.toUTCString();
                    }
                });
        }
    }, []);

    return (
        <header className={cx('wrapper')}>
            <div className={cx('logo-wrapper')}>
                <img className={cx('logo')} src={images.aolang} alt="" />
                <p className={cx('project-name')}>AO LÀNG</p>
            </div>
            <div className={cx('link-wrapper')}>
                <NavLink to={config.routes.home} className={(nav) => cx('link', { active: nav.isActive })}>
                    Trang chủ
                </NavLink>
                <NavLink to={config.routes.instruction} className={(nav) => cx('link', { active: nav.isActive })}>
                    Giới thiệu
                </NavLink>
                {!isLogin && (
                    <NavLink to={config.routes.login} className={(nav) => cx('link', { active: nav.isActive })}>
                        Đăng nhập
                    </NavLink>
                )}
                {!isLogin && (
                    <NavLink to={config.routes.register} className={(nav) => cx('link', { active: nav.isActive })}>
                        Đăng kí
                    </NavLink>
                )}
                {isLogin && (
                    <NavLink to={config.routes.maxPoint} className={(nav) => cx('link', { active: nav.isActive })}>
                        BXH
                    </NavLink>
                )}
                {isLogin && (
                    <NavLink to={config.routes.externalLink} className={(nav) => cx('link', { active: nav.isActive })}>
                        Liên kết
                    </NavLink>
                )}
                {isLogin && (
                    <NavLink to={config.routes.addQuestion} className={(nav) => cx('link', { active: nav.isActive })}>
                        Đóng góp
                    </NavLink>
                )}
                {isLogin && (
                    <NavLink to={config.routes.media} className={(nav) => cx('link', { active: nav.isActive })}>
                        Media
                    </NavLink>
                )}
                {isLogin && (
                    <NavLink to={config.routes.account} className={(nav) => cx('link', { active: nav.isActive })}>
                        Tài khoản
                    </NavLink>
                )}
            </div>
        </header>
    );
}

export default Header;
