import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import Header from '../../Component/Layout/Header';
import History from './History';
import Structure from './Structure';
import Team from './Team';
import AoLangIOT from './AoLangIOT';
import AoLangApp from './AoLangApp';
import { getCookie, request } from '../../warehouse';
import styles from './Instruction.module.scss';

const cx = classNames.bind(styles);

function Instruction() {
    const [category, setCategory] = useState(0);
    const [structure, setStructure] = useState([]);
    const [members, setMembers] = useState([]);

    useEffect(() => {
        request.get('/information/getStructure.php').then((res) => {
            setStructure(res);
        });
    }, []);

    useEffect(() => {
        request.get('/information/getMember.php').then((res) => {
            setMembers(res);
            setCategory(2);
        });
    }, []);

    return (
        <div>
            <Header isLogin={getCookie().islogin} />
            <div className={cx('wrapper')}>
                <div className={cx('link-wrapper')}>
                    <button
                        className={cx('link-item', {
                            active: category === 1,
                        })}
                        onClick={() => setCategory(1)}
                    >
                        Quá trình hình thành và phát triển
                    </button>
                    <button
                        className={cx('link-item', {
                            active: category === 2,
                        })}
                        onClick={() => setCategory(2)}
                    >
                        Bộ máy tổ chức
                    </button>
                    <button
                        className={cx('link-item', {
                            active: category === 3,
                        })}
                        onClick={() => setCategory(3)}
                    >
                        Thông tin thành viên
                    </button>
                    <button
                        className={cx('link-item', {
                            active: category === 4,
                        })}
                        onClick={() => setCategory(4)}
                    >
                        AOLANG on IOT
                    </button>
                    <button
                        className={cx('link-item', {
                            active: category === 5,
                        })}
                        onClick={() => setCategory(5)}
                    >
                        Hướng dẫn sử dụng
                    </button>
                </div>
                <div className={cx('content-wrapper')}>
                    {category === 1 ? (
                        <History />
                    ) : category === 2 ? (
                        <Structure structure={structure} members={members} />
                    ) : category === 3 ? (
                        <Team members={members} />
                    ) : category === 4 ? (
                        <AoLangIOT />
                    ) : (
                        <AoLangApp />
                    )}
                </div>
            </div>
        </div>
    );
}

export default Instruction;
