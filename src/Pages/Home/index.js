import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import { images } from '../../assets';
import Header from '../../Component/Layout/Header';
import config from '../../config';
import { getCookie } from '../../warehouse';
import styles from './Home.module.scss';

const cx = classNames.bind(styles);

function HomePage() {
    return (
        <div>
            <Header isLogin={getCookie().islogin} />
            <div className={cx('wrapper', 'second-wrapper')}>
                <img className={cx('logo-opacity')} src={images.aolang} alt="" />
                <div className={cx('game-instruction')}>
                    <div className={cx('logo-block-wrapper')}>
                        <div className={cx('logo-wrapper')}>
                            <Link to={config.routes.game + '?mode=marathon'}>
                                <img className={cx('logo-game')} src={images.marathon} alt="" />
                            </Link>
                            <Link to={config.routes.game + '?mode=marathon'} className={cx('logo-link')}>
                                Marathon
                            </Link>
                            <p className={cx('game-description')}>Chạy đua với 60s và tối đa 30 câu hỏi</p>
                        </div>
                        <div className={cx('logo-wrapper', 'left')}>
                            <Link to={config.routes.game + '?mode=hurdling'}>
                                <img className={cx('logo-game')} src={images.hurdling} alt="" />
                            </Link>
                            <Link to={config.routes.game + '?mode=hurdling'} className={cx('logo-link')}>
                                Hurdling
                            </Link>
                            <p className={cx('game-description')}>Trả lời 10 câu hỏi với độ khó tăng dần</p>
                        </div>
                        <div className={cx('logo-wrapper', 'left')}>
                            <Link to={config.routes.game + '?mode=calculaphobia'}>
                                <img className={cx('logo-game')} src={images.calculaphobia} alt="" />
                            </Link>
                            <Link to={config.routes.game + '?mode=calculaphobia'} className={cx('logo-link')}>
                                Calculaphobia
                            </Link>
                            <p className={cx('game-description')}>Luyện tập tính nhanh, chính xác</p>
                        </div>
                    </div>
                    <div className={cx('logo-block-wrapper')}>
                        <div className={cx('logo-wrapper')}>
                            <Link to={config.routes.game + '?mode=deciphering'}>
                                <img className={cx('logo-game')} src={images.deciphering} alt="" />
                            </Link>
                            <Link className={cx('logo-link')} to={config.routes.game + '?mode=deciphering'}>
                                Deciphering
                            </Link>
                            <p className={cx('game-description')}>Giải mã mật thư, tìm ra thông điệp</p>
                        </div>
                        <div className={cx('logo-wrapper', 'left')}>
                            <Link to={config.routes.game + '?mode=vocab'}>
                                <img className={cx('logo-game')} src={images.vocab} alt="" />
                            </Link>
                            <Link to={config.routes.game + '?mode=vocab'} className={cx('logo-link')}>
                                Vocaboostery
                            </Link>
                            <p className={cx('game-description')}>"Boost" vốn từ tiếng Anh của bạn</p>
                        </div>
                    </div>
                </div>
            </div>
            <footer className={cx('third-wrapper')}>
                <p className={cx('slogan')}>
                    <span className={cx('slogan-first-letter')}>A</span>ttaining{' '}
                    <span className={cx('slogan-first-letter')}>O</span>pportunities,
                    <br />
                    <span className={cx('slogan-first-letter')}>L</span>earning{' '}
                    <span className={cx('slogan-first-letter')}>A</span>nd{' '}
                    <span className={cx('slogan-first-letter')}>N</span>onstop{' '}
                    <span className={cx('slogan-first-letter')}>G</span>rowing.
                </p>
                <div className={cx('policy')}>
                    <div>
                        <a href={config.routes.csqdt} className={cx('link')} target="_blank">
                            Chính sách quyền riêng tư
                        </a>
                        <a href={config.routes.dkdv} className={cx('second-policy', 'link')} target="_blank">
                            Điều khoản dịch vụ
                        </a>
                    </div>
                    <div>
                        <p>
                            <Link to={config.routes.contact} className={cx('link')}>
                                Liên hệ với chúng tôi
                            </Link>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default HomePage;
