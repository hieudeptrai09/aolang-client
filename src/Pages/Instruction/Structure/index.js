import { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Structure.module.scss';

const cx = classNames.bind(styles);

function Structure({ structure, members }) {
    const [chosenBranch, setChosenBranch] = useState(-1);

    return (
        <div className="wrapper">
            <div className={cx('level-wrapper')}>
                {structure.head.captain.map((member) => (
                    <div key={member.id} className={cx('captain-title-wrapper')}>
                        <p className={cx('captain-title')}>Trưởng Ban điều hành</p>
                        <div className={cx('personnel-wrapper', 'captain-content-wrapper', 'toEqually')}>
                            <img className={cx('captain-image')} src={members[member.id].image} alt="" />
                            <div>
                                <p className={cx('member-name')}>{members[member.id].name}</p>
                                <p className={cx('member-title')}>{member.title}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className={cx('level-wrapper')}>
                {structure.head.vicecaptain.map((member) => (
                    <div key={member.id} className={cx('captain-title-wrapper')}>
                        <p className={cx('captain-title')}>Phó trưởng Ban điều hành</p>
                        <div className={cx('personnel-wrapper', 'captain-content-wrapper', 'toEqually')}>
                            <img className={cx('captain-image')} src={members[member.id].image} alt="" />
                            <div>
                                <p className={cx('member-name')}>{members[member.id].name}</p>
                                <p className={cx('member-title')}>{member.title}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <p className={cx('title')}>CÁC THÀNH VIÊN THƯỜNG TRỰC</p>
            <div className={cx('level-wrapper')}>
                {structure.head.member.map((member) => (
                    <div className={cx('personnel-wrapper', 'captain-personnel-wrapper', 'toEqually')} key={member.id}>
                        <img className={cx('member-image')} src={members[member.id].image} alt="" />
                        <div>
                            <p className={cx('member-name')}>{members[member.id].name}</p>
                            <p className={cx('member-title')}>{member.title}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div
                className={cx('btn-wrapper', {
                    'final-wrapper': chosenBranch === -1,
                })}
            >
                {structure.branch.map((branch, index) => (
                    <button
                        className={cx('btn-item', {
                            active: chosenBranch === index,
                        })}
                        key={index}
                        onClick={() => setChosenBranch(index)}
                    >
                        {branch.name}
                    </button>
                ))}
            </div>
            {chosenBranch > -1 && (
                <div>
                    <p className={cx('title')}>
                        {structure.branch[chosenBranch].member.head.title.toLocaleUpperCase()}
                    </p>
                    <div
                        className={cx('level-wrapper', {
                            'final-wrapper': structure.branch[chosenBranch].member.member.member.length === 0,
                        })}
                    >
                        {structure.branch[chosenBranch].member.head.member.map((member) => (
                            <div
                                className={cx('personnel-wrapper', 'captain-personnel-wrapper', 'toEqually')}
                                key={member.id}
                            >
                                <img className={cx('member-image')} src={members[member.id].image} alt="" />
                                <div>
                                    <p className={cx('member-name')}>{members[member.id].name}</p>
                                    <p className={cx('member-title')}>{member.title}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    {structure.branch[chosenBranch].member.member.member.length > 0 && (
                        <fieldset className={cx('fieldset')}>
                            <legend className={cx('member-wrapper-title')}>
                                {structure.branch[chosenBranch].member.member.title.toLocaleUpperCase()}
                            </legend>
                            <div className={cx('level-wrapper', 'list-mem-branch-wrapper')}>
                                {structure.branch[chosenBranch].member.member.member.map((member) => (
                                    <div
                                        className={cx('personnel-wrapper', 'toEqually', 'member-branch-wrapper')}
                                        key={member}
                                    >
                                        <img className={cx('member-image')} src={members[member].image} alt="" />
                                        <p className={cx('member-name')}>{members[member].name}</p>
                                    </div>
                                ))}
                            </div>
                        </fieldset>
                    )}
                </div>
            )}
        </div>
    );
}

export default Structure;
