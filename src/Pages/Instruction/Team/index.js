import classNames from 'classnames/bind';
import styles from './Team.module.scss';
import { images } from '../../../assets';

const cx = classNames.bind(styles);

function Team({ members }) {
    return (
        <div className={cx('wrapper')}>
            {members.map((member) => (
                <div className={cx('content-wrapper')} key={member.id}>
                    <img className={cx('member-image')} src={member.image} alt="" />
                    <div>
                        <div>
                            <h2 className={cx('member-name')}>{member.name}</h2>
                            <p className={cx('member-title')}>{member.title}</p>
                        </div>
                        <div>
                            <p className={cx('member-content')}>
                                <span>
                                    <img className={cx('icon')} src={images.teamDob} alt="" />
                                </span>
                                {' ' + member.dob}
                            </p>
                            <p className={cx('member-content')}>
                                <span>
                                    <img className={cx('icon')} src={images.teamHome} alt="" />
                                </span>
                                {' ' + member.province}
                            </p>
                            <p className={cx('member-content')}>
                                <span>
                                    <img
                                        className={cx('icon')}
                                        src={member.isGraduate ? images.teamGraduate : images.teamSchool}
                                        alt=""
                                    />
                                </span>
                                {' ' + member.school}
                            </p>
                            <p className={cx('member-content')}>
                                <span>
                                    <img className={cx('icon')} src={images.teamPeak} alt=""/> 
                                </span>
                                {' ' + member.peak}
                            </p>
                            <p className={cx('member-content')}>
                                <span>
                                    <img className={cx('icon')} src={images.teamHobby} alt=""/>
                                </span>
                                {' ' + member.hobby}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Team;
