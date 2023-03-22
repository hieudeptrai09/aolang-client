import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './ExternalLink.module.scss';
import Header from '../../Component/Layout/Header';
import { images } from '../../assets';
import { getCookie, request } from '../../warehouse';
import config from '../../config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faYoutube } from '@fortawesome/free-brands-svg-icons';

const cx = classNames.bind(styles);

function ExternalLink() {
    const [link, setLink] = useState([]);
    const [title, setTitle] = useState([]);
    const [chosenCategory, setChosenCategory] = useState(-1);
    const [chosenLink, setChosenLink] = useState([]);
    let navigate = useNavigate();

    useEffect(() => {
        request
            .get('/static/getContents.php', {
                params: {
                    filename: 'title',
                },
            })
            .then((res) => {
                setTitle(res);
            });
        request
            .get('/static/getContents.php', {
                params: {
                    filename: 'link',
                },
            })
            .then((res) => {
                setLink(res);
                setChosenCategory(2);
                setChosenLink(res.filter((aLink) => aLink.type === 2));
            });
    }, []);

    const chooseCategory = (id) => {
        setChosenCategory(id);
        setChosenLink(link.filter((aLink) => aLink.type === id));
    };

    if (getCookie().islogin || getCookie().dxnlcm !== undefined)
        return (
            <div>
                <Header isLogin />
                <div className={cx('logo-wrapper')}>
                    <button
                        className={cx('logo-item-wrapper', {
                            active: chosenCategory === 0,
                        })}
                        onClick={() => chooseCategory(0)}
                    >
                        <img class={cx('logo-mode')} src={images.puzzleSmall} alt="" />
                        <p
                            class={cx('logo-link', {
                                active: chosenCategory === 0,
                            })}
                        >
                            Giải đố và tiện ích
                        </p>
                    </button>
                    <button
                        className={cx('logo-item-wrapper', {
                            active: chosenCategory === 2,
                        })}
                        onClick={() => chooseCategory(2)}
                    >
                        <img class={cx('logo-mode')} src={images.communitySmall} alt="" />
                        <p
                            class={cx('logo-link', {
                                active: chosenCategory === 2,
                            })}
                        >
                            Cộng đồng
                        </p>
                    </button>
                    <button
                        className={cx('logo-item-wrapper', {
                            active: chosenCategory === 1,
                        })}
                        onClick={() => chooseCategory(1)}
                    >
                        <img class={cx('logo-mode')} src={images.encyclopediaSmall} alt="" />
                        <p
                            class={cx('logo-link', {
                                active: chosenCategory === 1,
                            })}
                        >
                            Kiến thức
                        </p>
                    </button>
                </div>
                {chosenCategory !== -1 && (
                    <div className={cx('body-wrapper')}>
                        <div className={cx('title-wrapper')}>
                            <img className={cx('big-logo-mode')} src={images[title[chosenCategory].logo]} alt="" />
                            <div>
                                <h3 className={cx('big-logo-title')}>
                                    {title[chosenCategory].name.toLocaleUpperCase()}
                                </h3>
                                <p className={cx('big-logo-description')}>{title[chosenCategory].description}</p>
                            </div>
                        </div>
                        <div className={cx('content-wrapper')}>
                            {chosenLink.map((link, index) => (
                                <a className={cx('content-item-wrapper')} href={link.link} target="_blank" key={index}>
                                    {link.logo && <img className={cx('content-logo')} src={link.logo} alt="" />}
                                    <div className={cx('content-description-wrapper')}>
                                        <h4>
                                            {link.name}{' '}
                                            <span>
                                                {link.platform === 'web' ? (
                                                    <FontAwesomeIcon className={cx('globe')} icon={faGlobe} />
                                                ) : link.platform === 'facebook' ? (
                                                    <FontAwesomeIcon className={cx('facebook')} icon={faFacebook} />
                                                ) : (
                                                    <FontAwesomeIcon icon={faYoutube} />
                                                )}
                                            </span>
                                        </h4>
                                        <p className={cx('content-description')}>{link.description}</p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    else {
        navigate(config.routes.login);
    }
}

export default ExternalLink;
