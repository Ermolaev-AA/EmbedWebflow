// Преобразование cookie в объект
export default function CookiesToObject(cookieString) {
    return cookieString.split('; ').reduce((acc, cookie) => {
        const [name, value] = cookie.split('=');
        if (name && value) {
            acc[name] = decodeURIComponent(value);
        }
        return acc;
    }, {});
}