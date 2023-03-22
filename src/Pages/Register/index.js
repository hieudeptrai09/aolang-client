import classNames from 'classnames/bind';
import Popup from 'reactjs-popup';
import { useNavigate } from 'react-router-dom';
import style from './Register.module.scss';
import { useState, useEffect, useRef } from 'react';
import Header from '../../Component/Layout/Header';
import { images } from '../../assets';
import { request } from '../../warehouse';
import config from '../../config';
import Password from '../../Component/Password';

const cx = classNames.bind(style);

function Register() {
    const [open, setOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password2nd, setPassword2nd] = useState('');
    const [email, setEmail] = useState('');
    const [fullname, setFullname] = useState('');
    const [province, setProvince] = useState('1');
    const [provinceList, setProvinceList] = useState([]);
    const [district, setDistrict] = useState('1');
    const [districtList, setDistrictList] = useState([]);
    const [school, setSchool] = useState('1');
    const [schoolList, setSchoolList] = useState([]);
    const [usernameVerify, setUsernameVerify] = useState('');
    const [passwordVerify, setPasswordVerify] = useState('');
    const [password2ndVerify, setPassword2ndVerify] = useState('');
    const [emailVerify, setEmailVerify] = useState('');
    const [fullnameVerify, setFullnameVerify] = useState('');
    const [provinceVerify, setProvinceVerify] = useState('');
    const [schoolVerify, setSchoolVerify] = useState('');
    const [districtVerify, setDistrictVerify] = useState('');
    const [policy, setPolicy] = useState(false);
    const [policyVerify, setPolicyVerify] = useState('');

    const usernameCheckRef = useRef('');
    const emailCheckRef = useRef('');

    const navigate = useNavigate();

    useEffect(() => {
        request.get('/user/searchProvince.php').then((res) => setProvinceList(res));
    }, []);

    useEffect(() => {
        if (province.length === 0) setDistrictVerify('cần chọn tỉnh trước');
        else
            request
                .get('/user/searchDistrict.php', {
                    params: {
                        provinceId: province,
                    },
                })
                .then((res) => setDistrictList(res));
    }, [province]);

    useEffect(() => {
        console.log(province + ' ' + district);
        if (province.length === 0 || district.length === 0) setSchoolVerify('cần chọn tỉnh và huyện trước');
        else
            request
                .get('/user/searchSchool.php', {
                    params: {
                        provinceId: province,
                        districtId: district,
                    },
                })
                .then((res) => setSchoolList(res));
    }, [district]);

    function verifyUsername() {
        if (username.length < 3) {
            setUsernameVerify('Tên đăng nhập cần phải có tối thiểu 3 kí tự');
            return false;
        } else if (username.length > 20) {
            setUsernameVerify('Tên đăng nhập không được vượt quá 20 kí tự');
            return false;
        } else if (!/^[\x00-\x7F]*$/.test(username)) {
            setUsernameVerify('Tên đăng nhập không được dùng chữ cái không có trong bảng mã ASCII');
            return false;
        } else if (username.indexOf(' ') >= 0) {
            setUsernameVerify('Tên đăng nhập không được có dấu cách');
            return false;
        } else {
            request
                .get('/user/checkUsername.php', {
                    params: {
                        username: username,
                    },
                })
                .then((res) => {
                    usernameCheckRef.current = !res;
                    if (res) {
                        setUsernameVerify('Tên đăng nhập đã được dùng');
                    } else {
                        setUsernameVerify('');
                    }
                });
            return usernameCheckRef.current;
        }
    }

    function verifyEmail() {
        if (email.length === 0) {
            setEmailVerify('Thông tin bắt buộc');
            return false;
        } else if (email.indexOf('@') === -1) {
            setEmailVerify('Địa chỉ email cần có kí tự @');
            return false;
        } else {
            request
                .get('/user/checkEmail.php', {
                    params: {
                        email: email,
                    },
                })
                .then((res) => {
                    emailCheckRef.current = !res;
                    if (res) {
                        setEmailVerify('Địa chỉ email đã được dùng');
                    } else {
                        setEmailVerify('');
                    }
                });
            return emailCheckRef.current;
        }
    }

    function verifyPassword() {
        let result = true;

        if (password.length < 8) {
            setPasswordVerify('Mật khẩu cần phải có tối thiểu 8 kí tự');
            result = false;
        } else if (!/^[\x00-\x7F]*$/.test(password)) {
            setPasswordVerify('Mật khẩu không được dùng chữ cái không có trong bảng mã ASCII');
            result = false;
        } else {
            setPasswordVerify('');
        }

        return result;
    }

    function verifyPassword2nd() {
        let result = true;

        if (password2nd !== password) {
            setPassword2ndVerify('Mật khẩu xác nhận không khớp với mật khẩu gốc');
            result = false;
        } else {
            setPassword2ndVerify('');
        }

        return result;
    }

    function verifyFullname() {
        let result = true;

        if (fullname.length === 0) {
            setFullnameVerify('Thông tin bắt buộc');
            result = false;
        } else {
            setFullnameVerify('');
        }

        return result;
    }

    function verifyProvince() {
        let result = true;

        if (province.length === 0) {
            setProvinceVerify('Thông tin bắt buộc');
            result = false;
        } else {
            setProvinceVerify('');
        }

        return result;
    }

    function verifyDistrict() {
        let result = true;

        if (district.length === 0) {
            setDistrictVerify('Thông tin bắt buộc');
            result = false;
        } else {
            setDistrictVerify('');
        }

        return result;
    }

    function verifySchool() {
        let result = true;

        if (school.length === 0) {
            setSchoolVerify('Thông tin bắt buộc');
            result = false;
        } else {
            setSchoolVerify('');
        }
        return result;
    }

    function verifyPolicy() {
        let result = true;

        if (!policy) {
            setPolicyVerify('Bạn cần phải đồng ý với điều khoản dịch vụ của ứng dụng này');
            result = false;
        } else {
            setPolicyVerify('');
        }
        return result;
    }

    function toVerify() {
        return (
            verifyUsername() &&
            verifyEmail() &&
            verifyDistrict() &&
            verifyFullname() &&
            verifyPassword() &&
            verifyPassword2nd() &&
            verifyProvince() &&
            verifySchool() &&
            verifyPolicy()
        );
    }

    function toSubmit() {
        const result = toVerify();
        if (result) {
            const payload = new FormData();
            payload.append('username', username);
            payload.append('password', password);
            payload.append('email', email);
            payload.append('fullname', fullname);
            payload.append('province', province);
            payload.append('district', district);
            payload.append('school', school);
            request.post('/user/register.php', payload).then((res) => {});
        }
        setOpen(result);
    }

    function closePopup() {
        setOpen(false);
    }

    return (
        <div>
            <Header isLogin={false} />
            <div
                className={cx('wrapper', {
                    popupOpen: open,
                })}
            >
                <div className={cx('form-wrapper')}>
                    <div className={cx('a-line-field')}>
                        <div className={cx('field')}>
                            <label className={cx('field-label')}>
                                Tên đăng nhập<span className={cx('hoathi')}>*</span>
                            </label>
                            <input
                                className={cx('username-input', 'field-input')}
                                onChange={(e) => setUsername(e.target.value)}
                                value={username}
                                onBlur={() => verifyUsername()}
                            />
                            <p className={cx('validate-info')}>{usernameVerify}</p>
                        </div>
                        <div className={cx('field')}>
                            <label className={cx('field-label')}>
                                Họ và tên<span className={cx('hoathi')}>*</span>
                            </label>
                            <input
                                className={cx('fullname-input', 'field-input')}
                                onChange={(e) => setFullname(e.target.value)}
                                value={fullname}
                                onBlur={() => verifyFullname()}
                            />
                            <p className={cx('validate-info')}>{fullnameVerify}</p>
                        </div>
                    </div>
                    <div className={cx('a-line-field')}>
                        <div className={cx('field')}>
                            <label className={cx('field-label')}>
                                Tỉnh thành<span className={cx('hoathi')}>*</span>
                            </label>
                            <select
                                className={cx('username-input', 'field-input')}
                                onChange={(e) => {
                                    setProvince(e.target.value);
                                    setDistrict('');
                                    setDistrictVerify('');
                                    setSchool('');
                                    setSchoolVerify('');
                                }}
                                value={province}
                                onBlur={() => verifyProvince()}
                            >
                                {provinceList.map((province, index) => {
                                    return (
                                        <option key={index} value={province.provinceid}>
                                            {province.provincename}
                                        </option>
                                    );
                                })}
                            </select>
                            <p className={cx('validate-info')}>{provinceVerify}</p>
                        </div>
                        <div className={cx('field')}>
                            <label className={cx('field-label')}>
                                Quận, huyện<span className={cx('hoathi')}>*</span>
                            </label>
                            <select
                                className={cx('fullname-input', 'field-input')}
                                onChange={(e) => {
                                    setDistrict(e.target.value);
                                    setSchool('');
                                    setSchoolVerify('');
                                }}
                                value={district}
                                onBlur={() => verifyDistrict()}
                            >
                                {districtList.map((district, index) => {
                                    return (
                                        <option key={index} value={district.districtid}>
                                            {district.districtname}
                                        </option>
                                    );
                                })}
                            </select>
                            <p className={cx('validate-info')}>{districtVerify}</p>
                        </div>
                    </div>
                    <div className={cx('field')}>
                        <label className={cx('field-label')}>
                            Trường<span className={cx('hoathi')}>*</span>
                        </label>
                        <select
                            className={cx('field-input')}
                            onChange={(e) => setSchool(e.target.value)}
                            value={school}
                            onBlur={() => verifySchool()}
                        >
                            {schoolList.map((school, index) => {
                                return (
                                    <option key={index} value={school.schoolId}>
                                        {school.schoolName}
                                    </option>
                                );
                            })}
                        </select>
                        <p className={cx('validate-info')}>{schoolVerify}</p>
                    </div>
                    <div className={cx('field')}>
                        <label className={cx('field-label')}>
                            Email<span className={cx('hoathi')}>*</span>
                        </label>
                        <input
                            className={cx('field-input')}
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            onBlur={() => verifyEmail()}
                        />
                        <p className={cx('validate-info')}>{emailVerify}</p>
                    </div>
                    <div className={cx('a-line-field')}>
                        <div>
                            <Password
                                password={password}
                                setPassword={setPassword}
                                label="Mật khẩu"
                                isForce
                                usernameInput={cx('username-input')}
                                onBlur={() => verifyPassword()}
                                width="41.66vh"
                                marginLeft="0vh"
                            />
                            <p className={cx('validate-info')}>{passwordVerify}</p>
                        </div>
                        <div>
                            <Password
                                password={password2nd}
                                setPassword={setPassword2nd}
                                label="Nhập lại mật khẩu"
                                isForce
                                fullnameInput={cx('fullname-input')}
                                onBlur={() => verifyPassword2nd()}
                                width="41.66vh"
                                marginLeft="2.22vh"
                            />
                            <p className={cx('validate-info')}>{password2ndVerify}</p>
                        </div>
                    </div>
                    <div>
                        <input
                            className={cx('checkbox-input')}
                            type="checkbox"
                            onChange={(e) => setPolicy(e.target.value)}
                            onBlur={() => verifyPolicy()}
                        />
                        <span className={cx('remember-login')}>
                            Tôi đồng ý với{' '}
                            <a className={cx('link')} href={config.routes.csqdt} target="_blank">
                                chính sách quyền riêng tư
                            </a>{' '}
                            và{' '}
                            <a className={cx('link')} href={config.routes.dkdv} target="_blank">
                                điều khoản dịch vụ
                            </a>{' '}
                            của ứng dụng này.
                        </span>
                        <p className={cx('validate-info')}>{policyVerify}</p>
                    </div>
                    <button className={cx('register-button')} onClick={toSubmit}>
                        Xác nhận đăng kí!
                    </button>
                    <Popup open={open} onClose={closePopup}>
                        <div className={cx('confirm-wrapper')}>
                            <div>
                                <img className={cx('check-icon')} src={images.check} alt="" />
                                <p className={cx('confirm-text')}>
                                    Đăng kí thông tin hoàn tất. Vui lòng kiểm tra email để xác thực tài khoản.
                                </p>
                            </div>
                            <button
                                className={cx('confirm-button-popup')}
                                onClick={() => {
                                    navigate(config.routes.home);
                                }}
                            >
                                Xác nhận
                            </button>
                        </div>
                    </Popup>
                </div>
                <img className={cx('logo')} src={images.aolangOpacity} alt="" />
            </div>
        </div>
    );
}

export default Register;
