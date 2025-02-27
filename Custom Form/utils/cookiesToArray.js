// Parsing Cookie and creating an array
export default function CookiesToArray(cookie) {
    const cookies = cookie.split('; ');
    const cookieArray = [];
  
    for (const cookie of cookies) {
      const [name, value] = cookie.split('=');
      const cookieObj = {
        name: name,
        value: decodeURIComponent(value)
      };
      cookieArray.push(cookieObj);
    }
  
    return cookieArray;
}