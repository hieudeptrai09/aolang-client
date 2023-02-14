import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import Popup from 'reactjs-popup';
import { images } from '../../../assets';
import styles from './PersonalInformation.module.scss';
import { request, getCookie } from '../../../warehouse';

const cx = classNames.bind(styles);

function PersonalInformation({ setChanged }) {
    const [birthdate, setBirthdate] = useState('');
    const [birthmonth, setBirthmonth] = useState('');
    const [birthyear, setBirthyear] = useState('');

    const [province, setProvince] = useState('');
    const [provinceList, setProvinceList] = useState([]);
    const [district, setDistrict] = useState('');
    const [districtList, setDistrictList] = useState([]);
    const [school, setSchool] = useState('');
    const [schoolList, setSchoolList] = useState([]);

    const [open, setOpen] = useState(false);

    useEffect(() => {
        request
            .get('/user/search2.php', {
                params: {
                    id: getCookie().dxnlcm,
                },
            })
            .then((res) => {
                setSchool(res.schoolid);
                setProvince(res.provinceid);
                setDistrict(res.districtid);
                setBirthdate(res.birthday.substring(0, 2));
                setBirthmonth(res.birthday.substring(3, 5));
                setBirthyear(res.birthday.substring(6));
            });
    }, []);

    function getProvinceList() {
        request.get('/user/searchProvince.php').then((res) => {
            setProvinceList(res);
        });
    }

    function getDistrictList() {
        request
            .get('/user/searchDistrict.php', {
                params: {
                    provinceId: province,
                },
            })
            .then((res) => setDistrictList(res));
    }

    function getSchoolList() {
        request
            .get('/user/searchSchool.php', {
                params: {
                    provinceId: province,
                    districtId: district,
                },
            })
            .then((res) => {
                setSchoolList(res);
            });
    }

    const toSave = () => {
        const payload = new FormData();
        payload.append('id', getCookie().dxnlcm);
        payload.append('province', province);
        payload.append('district', district);
        payload.append('school', school);
        payload.append('birthday', birthdate + '/' + birthmonth + '/' + birthyear);
        request.post('/user/updateAccount.php', payload).then((res) => {
            setOpen(res);
            if (res) setChanged((prev) => prev + 1);
        });
    };

    function closePopup() {
        setOpen(false);
    }

    return (
        <div className={cx('wrapper')} id="captain">
            <div className={cx('header-wrapper')}>
                <h4 className={cx('header')}>Thông tin cá nhân</h4>
                <p className={cx('post-header')}>Vui lòng cập nhật đầy đủ các thông tin thiết yếu.</p>
            </div>
            <div className={cx('input-wrapper')}>
                <div className={cx('row-input-wrapper')}>
                    <div className={cx('cell-input-wrapper')}>
                        <label className={cx('cell-label')}>Trường</label>
                        <select
                            onClick={getSchoolList}
                            className={cx('cell-input')}
                            onChange={(e) => setSchool(e.target.value)}
                            value={school}
                        >
                            <option value="" disabled></option>
                            {schoolList.map((school, index) => {
                                return (
                                    <option key={index} value={school.schoolId}>
                                        {school.schoolName}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    <div className={cx('cell-input-wrapper')}>
                        <label className={cx('cell-label')}>Huyện</label>
                        <select
                            onClick={getDistrictList}
                            className={cx('cell-input')}
                            onChange={(e) => {
                                if (e.target.value.localeCompare(district) !== 0) setSchool('');
                                setDistrict(e.target.value);
                            }}
                            value={district}
                        >
                            <option value="" disabled></option>
                            {districtList.map((district, index) => {
                                return (
                                    <option key={index} value={district.districtid}>
                                        {district.districtname}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    <div className={cx('cell-input-wrapper')}>
                        <label className={cx('cell-label')}>Tỉnh</label>
                        <select
                            onClick={getProvinceList}
                            className={cx('cell-input')}
                            onChange={(e) => {
                                if (e.target.value.localeCompare(province) !== 0) {
                                    setDistrict('');
                                    setSchool('');
                                }
                                setProvince(e.target.value);
                            }}
                            value={province}
                        >
                            <option value="" disabled></option>
                            {provinceList.map((province, index) => {
                                return (
                                    <option key={index} value={province.provinceid}>
                                        {province.provincename}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                </div>
                <div className={cx('row-input-wrapper')}>
                    <div className={cx('cell-input-wrapper')}>
                        <label className={cx('cell-label')}>Ngày</label>
                        <select
                            className={cx('cell-input')}
                            onChange={(e) => setBirthdate(e.target.value)}
                            value={birthdate}
                        >
                            <option value="" disabled></option>
                            <option value="01">1</option>
                            <option value="02">2</option>
                            <option value="03">3</option>
                            <option value="04">4</option>
                            <option value="05">5</option>
                            <option value="06">6</option>
                            <option value="07">7</option>
                            <option value="08">8</option>
                            <option value="09">9</option>
                            <option value="10">10</option>
                            <option value="11">11</option>
                            <option value="12">12</option>
                            <option value="13">13</option>
                            <option value="14">14</option>
                            <option value="15">15</option>
                            <option value="16">16</option>
                            <option value="17">17</option>
                            <option value="18">18</option>
                            <option value="19">19</option>
                            <option value="20">20</option>
                            <option value="21">21</option>
                            <option value="22">22</option>
                            <option value="23">23</option>
                            <option value="24">24</option>
                            <option value="25">25</option>
                            <option value="26">26</option>
                            <option value="27">27</option>
                            <option value="28">28</option>
                            {(birthmonth !== '2' ||
                                (birthmonth === '2' &&
                                    (birthyear % 400 === 0 || (birthyear % 4 === 0 && birthyear % 100 !== 0)))) && (
                                <option value="29">29</option>
                            )}
                            {birthmonth !== '2' && <option value="30">30</option>}
                            {birthmonth !== '2' &&
                                birthmonth !== '4' &&
                                birthmonth !== '6' &&
                                birthmonth !== '9' &&
                                birthmonth !== '11' && <option value="31">31</option>}
                        </select>
                    </div>
                    <div className={cx('cell-input-wrapper')}>
                        <label className={cx('cell-label')}>Tháng</label>
                        <select
                            className={cx('cell-input')}
                            onChange={(e) => setBirthmonth(e.target.value)}
                            value={birthmonth}
                        >
                            <option value="" disabled></option>
                            <option value="01">1</option>
                            <option value="02">2</option>
                            <option value="03">3</option>
                            <option value="04">4</option>
                            <option value="05">5</option>
                            <option value="06">6</option>
                            <option value="07">7</option>
                            <option value="08">8</option>
                            <option value="09">9</option>
                            <option value="10">10</option>
                            <option value="11">11</option>
                            <option value="12">12</option>
                        </select>
                    </div>
                    <div className={cx('cell-input-wrapper')}>
                        <label className={cx('cell-label')}>Năm</label>
                        <input
                            className={cx('cell-input')}
                            value={birthyear}
                            onChange={(e) => setBirthyear(e.target.value)}
                        />
                    </div>
                </div>
                <button className={cx('save-btn')} onClick={toSave}>
                    Lưu
                </button>
                <Popup open={open} onClose={closePopup}>
                    <div className={cx('confirm-wrapper')}>
                        <div>
                            <img className={cx('check-icon')} src={images.check} alt="" />
                            <p className={cx('confirm-text')}>Bạn đã thay đổi thông tin tài khoản thành công</p>
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

export default PersonalInformation;
