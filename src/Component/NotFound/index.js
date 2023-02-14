import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './NotFound.module.scss';
import { images } from '../../assets';
import config from '../../config';

const cx = classNames.bind(styles);

function NotFound() {
    return (
        <div className={cx('wrapper')}>
            <p className={cx('first')}>
                4<img className={cx('first-image')} src={images.aolang} alt="" />4
            </p>
            <p className={cx('middle')}>
                Hiện bạn chưa thể xem nội dung này
                <br />
                Quay lại sau bạn nhé
            </p>
            <Link className={cx('last')} to={config.routes.home}>
                Về trang chủ
            </Link>
        </div>
    );
}

export default NotFound;
