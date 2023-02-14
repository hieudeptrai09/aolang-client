import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../../../config';

function LogOut() {
    const navigate = useNavigate();

    useEffect(() => {
        var date = new Date();
        date.setTime(date.getTime() - 3600000);
        document.cookie = 'islogin=true; expires=' + date.toUTCString();
        document.cookie = 'dxnlcm=sth; expires=' + date.toUTCString();

        navigate(config.routes.home);
    }, []);
}

export default LogOut;
