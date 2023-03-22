import classNames from 'classnames/bind';
import styles from './Policy.module.scss';
import { getCookie } from '../../../warehouse';
import Header from '../../../Component/Layout/Header';
import QuillRender from '../../../Component/QuillRender';

const cx = classNames.bind(styles);

function Csqdt() {
    return (
        <div>
            <Header isLogin={getCookie().islogin} />
            <div className={cx('wrapper')}>
                <QuillRender filename="publicypolicy" />
            </div>
        </div>
    );
}

export default Csqdt;
