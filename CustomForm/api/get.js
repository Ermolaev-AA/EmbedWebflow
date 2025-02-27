// const OnycsAPI_URL = 'https://onycs.ru'

class Get {
    async ConnectionData () {
        try {
            const response = await fetch('https://ipinfo.io/json')
            const data = await response.json()
            return data
        } catch (error) {
            console.error('Ошибка получения IP-адреса:', error)
            return null
        }
    }

    async PhoneInfo (phone) {
        const url = `https://onycs.ru/fetch/phoneinfo?phone=${phone}`
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }
    
        try {
            const response = await fetch(url, options)
                .then(res => res.json())
    
            // console.log('WhatsApp Response:', response) // Debug
            return response
        } catch (error) {
            console.error('WhatsApp ERROR:', error)
            return null
        }
    }

    async WhatsApp (phone) {
        const url = `https://onycs.ru/fetch/whatsapp?phone=${phone}`
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }
    
        try {
            const response = await fetch(url, options)
                .then(res => res.json())
    
            // console.log('WhatsApp Response:', response) // Debug
            return response
        } catch (error) {
            console.error('WhatsApp ERROR:', error)
            return null
        }
    }

    async Telegram (phone) {
        const url = `https://onycs.ru/fetch/telegram?phone=${phone}`
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }
    
        try {
            const response = await fetch(url, options)
                .then(res => res.json())
    
            // console.log('Telegram Response:', response) // Debug
            return response
        } catch (error) {
            console.error('Telegram ERROR:', error)
            return null
        }
    }

    async Userbox (phone) {
        const url = `https://onycs.ru/fetch/userbox?phone=${phone}`
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }
    
        try {
            const response = await fetch(url, options)
                .then(res => res.json())
    
            // console.log('Dumps Response:', response) // Debug
            return response
        } catch (error) {
            console.error('Dumps ERROR:', error)
            return null
        }
    }

}

export default new Get