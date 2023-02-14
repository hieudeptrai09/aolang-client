import classNames from 'classnames/bind';
import { images } from '../../../assets';
import Header from '../../../Component/Layout/Header';
import { getCookie } from '../../../warehouse';
import styles from './Contact.module.scss';

const cx = classNames.bind(styles);

function Contact() {
    return (
        <div>
            <Header isLogin={getCookie().islogin} />
            <div className={cx('third-wrapper', 'wrapper')}>
                <p className={cx('subject')}>Ao Làng</p>
                <p className={cx('predicate')}>Liên hệ với chúng tôi qua</p>
                <div className={cx('contact-wrapper')}>
                    <div className={cx('contact-item-wrapper')}>
                        <a href="https://www.facebook.com/aolang.edu.vn">
                            <img className={cx('logo')} src={images.aolang} alt="" />
                        </a>
                        <p className={cx('contact-item')}>Fanpage</p>
                    </div>
                    <div className={cx('contact-item-wrapper')}>
                        <a href="https://www.facebook.com/groups/1278600006068969">
                            <img className={cx('logo')} src={images.facebook} alt="" />
                        </a>
                        <p className={cx('contact-item')}>Nhóm Facebook</p>
                    </div>
                    <div className={cx('contact-item-wrapper')}>
                        <a href="https://mail.google.com">
                            <img className={cx('logo')} src={images.mail} alt="" />
                        </a>
                        <p className={cx('contact-item', 'email')}>Thư điện tử (aolang.edu.vn@gmail.com)</p>
                    </div>
                    <div className={cx('contact-item-wrapper')}>
                        <a>
                            <img className={cx('logo')} src={images.feedback} alt="" />
                        </a>
                        <p className={cx('contact-item')}>Feedback</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contact;
