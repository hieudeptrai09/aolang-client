import { useNavigate } from 'react-router-dom';
import Header from '../../Component/Layout/Header';
import NotFound from '../../Component/NotFound';
import config from '../../config';
import { getCookie } from '../../warehouse';

function Media() {
    const navigate = useNavigate();

    if (getCookie().islogin || getCookie().dxnlcm !== undefined) {
        return (
            <div>
                <Header isLogin />
                <NotFound />
            </div>
        );
    } else {
        navigate(config.routes.login);
    }
}

export default Media;
