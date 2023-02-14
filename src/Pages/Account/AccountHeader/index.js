import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './AccountHeader.module.scss';
import { request, getCookie, HOST_URL } from '../../../warehouse';
import { images } from '../../../assets';

const cx = classNames.bind(styles);

function AccountHeader({ changed, setChanged }) {
    const [user, setUser] = useState({
        avatar: '',
        fullname: '',
        username: '',
        email: '',
        schoolname: '',
        lotus: '',
        provincename: '',
    });

    useEffect(() => {
        request
            .get('/user/search2.php', {
                params: {
                    id: getCookie().dxnlcm,
                },
            })
            .then((res) => {
                setUser(res);
            });
    }, [changed]);

    const changeAvatar = (path) => {
        const payload = new FormData();
        payload.append('avatar', path);
        payload.append('id', getCookie().dxnlcm);
        request.post('/user/changeAvatar.php', payload).then((res) => {
            setChanged((prev) => !prev);
        });
    };

    const uploadMedia = (e) => {
        var file = document.getElementById('avatar-btn').files[0];
        if (file.size > 1048576) alert('File phải nhỏ hơn 1MB');
        else {
            const payload = new FormData(document.getElementById('avatar-form'));
            payload.append('id', getCookie().dxnlcm);
            payload.append('type', 'avatar');
            request.post('/file/uploadFile.php', payload).then((res) => {
                if (res.path.indexOf('/') < 0) {
                    alert(res.path);
                } else {
                    changeAvatar(HOST_URL + res.path);
                }
            });
        }
    };

    return (
        <div className={cx('info-wrapper')}>
            <div className={'avatar-header'}>
                <img className={cx('avatar')} src={user.avatar ? user.avatar : images.defaultAvatar} alt="" />
                <form id="avatar-form" encType="multipart/form-data" className={cx('avatar-btn-wrapper')}>
                    <label htmlFor="avatar-btn">
                        <img className={cx('avatar-btn-image')} src={images.avatarbtn} alt="" />
                    </label>
                    <input
                        type="file"
                        className={cx('avatar-btn')}
                        id="avatar-btn"
                        name="myFile"
                        onChange={(e) => uploadMedia(e)}
                    />
                </form>
            </div>
            <div>
                <p className={cx('info-username')}>
                    <span className={cx('account-letter')}>Tài khoản:</span> {'@' + user.username + ' - ' + user.email}
                </p>
                <p className={cx('info-name')}>{user.fullname.toLocaleUpperCase()}</p>
                <p className={cx('info-school')}>{user.schoolname + ' - ' + user.provincename}</p>
                <p className={cx('lotus-wrapper')}>
                    <span className={cx('no-of-lotus')}>{user.lotus} </span>
                    <img className={cx('lotus')} src={images.lotus} alt="" />
                </p>
            </div>
        </div>
    );
}

export default AccountHeader;
