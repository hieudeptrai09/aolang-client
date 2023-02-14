import { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Password.module.scss';
import { images } from '../../assets';

const cx = classNames.bind(styles);

function Password({ password, setPassword, setIsEnter, label, isForce, ...passProps }) {
    const [eyesChecked, setEyesChecked] = useState(false);

    return (
        <div className={cx('field')}>
            <div className={cx('checkbox-login-wrapper')}>
                <label className={cx('field-label')}>
                    {label}
                    {isForce && <span>*</span>}
                </label>
                <img
                    className={cx('eyes')}
                    src={eyesChecked ? images.eyesClose : images.eyesOpen}
                    onClick={() => setEyesChecked(!eyesChecked)}
                    alt=""
                />
            </div>
            {eyesChecked ? (
                <input
                    className={cx('field-input')}
                    style={{ width: passProps.width, marginLeft: passProps.marginLeft }}
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    onKeyUp={(e) => {
                        if (setIsEnter) setIsEnter(e.key === 'Enter');
                    }}
                    onBlur={() => {
                        if (passProps.onBlur) passProps.onBlur();
                    }}
                />
            ) : (
                <input
                    type="password"
                    className={cx('field-input')}
                    style={{ width: passProps.width, marginLeft: passProps.marginLeft }}
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    onKeyUp={(e) => {
                        if (setIsEnter) setIsEnter(e.key === 'Enter');
                    }}
                    onBlur={() => {
                        if (passProps.onBlur) passProps.onBlur();
                    }}
                />
            )}
        </div>
    );
}

export default Password;
