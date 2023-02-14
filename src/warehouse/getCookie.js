const getCookie = () => {
    let cookies = document.cookie.split('; ');
    let cookiesObject = {};
    for (let i = 0; i < cookies.length; i++) {
        let equalPosition = cookies[i].indexOf('=');
        let key = cookies[i].substring(0, equalPosition);
        let value = cookies[i].substring(equalPosition + 1);
        cookiesObject[key] = value;
    }
    return cookiesObject;
};

export default getCookie;
