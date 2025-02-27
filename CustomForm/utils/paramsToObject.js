// Преобразование URL-параметров в объект
export default function ParamsToObject(url) {
    const searchParams = new URL(url).searchParams;
    return Object.fromEntries(searchParams.entries());
}