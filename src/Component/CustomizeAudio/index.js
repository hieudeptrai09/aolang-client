import { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './CustomizeAudio.module.scss';

const cx = classNames.bind(styles);

function Audio({ src, autoPlay }) {
    const audioRef = useRef();
    const [isPlay, setIsPlay] = useState(autoPlay);

    const letsPlay = () => {
        if (isPlay) audioRef.current.pause();
        else audioRef.current.play();
        setIsPlay(!isPlay);
    };

    const rewind = (newTime) => {
        audioRef.current.currentTime = newTime;
        audioRef.current.play();
    };

    return (
        <div>
            <audio src={src} autoPlay={autoPlay} preload="metadata" ref={audioRef} />
            <button className={cx('play')} onClick={letsPlay}>
                {isPlay ? <FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} />}
            </button>
            <input
                type="range"
                min={0}
                max={audioRef.current !== undefined ? audioRef.current.duration : 0}
                onChange={(e) => rewind(e.target.value)}
            />
        </div>
    );
}

export default Audio;
