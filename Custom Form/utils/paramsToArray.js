// Parsing UTM and creating an array
export default function ParamsToArray(url) {
    const utmParams = [];
    const regex = /[?&]([^=]+)=([^&]*)/g;
    let match;
  
    while ((match = regex.exec(url)) !== null) {
        const param = {
            name: match[1],
            value: decodeURIComponent(match[2])
        };
        utmParams.push(param);
    }
  
    return utmParams;
}