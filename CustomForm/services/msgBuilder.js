class MSGBuilder {
    Fields (data, settings) {
        const { name, phone, email, request } = data

        return `
${ name ? `Имя: ${name}` : '' }
${ phone ? `Телефон: +${phone}` : '' }
${ email ? `Почта: ${email}` : '' }
${ request ? `Запрос: ${request}` : '' }
        `
    }

    Connection (data, settings) {
        // city: "Ryazan’"
        // country: "RU"
        // hostname: "95.83.131.222.spark-ryazan.ru"
        // ip: "95.83.131.222"
        // loc: "54.6269,39.6916"
        // org: "AS15774 Limited Liability Company \"TTK-Svyaz\""
        // postal: "390505"
        // readme: "https://ipinfo.io/missingauth"
        // region: "Ryazan Oblast"
        // timezone: "Europe/Moscow"

        const { country, region, city, loc, postal, timezone, org, hostname, ip } = data

        return `
${ country ? `Старана: ${country}` : '' }
${ region ? `Регион: ${region}` : '' }
${ city ? `Город: ${city}` : '' }
${ loc ? `Координаты: ${loc}` : '' }
${ postal ? `Почтовый индекс: ${postal}` : '' }
${ timezone ? `Часовой пояс: ${timezone}` : '' }

${ org ? `ORG: ${org}` : '' }
${ hostname ? `HOST: ${hostname}` : '' }
${ ip ? `IP: ${ip}` : '' }
        `
    }

    Сontact (data, settings) {
        // is_phone: isPhone,
        // is_spam: isSpam,
        // on_whatsapp: onWhatsApp,
        // on_telegram: onTelegram,
        // report_phone: resPhoneInfo,
        // report_whatsapp: resWhatsApp,
        // report_telegram: resTelegram,
        // dumps: resDumps,

        const { phone, isPhone, isSpam, onWhatsApp, onTelegram, resPhoneInfo, resWhatsApp, resTelegram, resDumps } = data

        if (isPhone === false) return 'Номера телефона НЕ СУЩЕСТВУЕТ!'
        if (isSpam === true) return 'Номера телефона НЕ ПРОШЕЛ ПРОВЕРКУ! (СПАМ, но это не точно, попробуйте позвонить!)'

        let msg = `
${ isPhone === true ? 'Номер телефона существует!' : 'Номера телефона НЕ СУЩЕСТВУЕТ!' }
${ isSpam === false ? 'Номер телефона прошел проверку!' : 'Номера телефона НЕ ПРОШЕЛ ПРОВЕРКУ! (СПАМ, но это не точно, попробуйте позвонить!)' }
        `

        const indented = `
`

        if (resPhoneInfo && isPhone === true) {
            // msg = msg + indented
            msg = msg + `
Номер телефона: +7${resPhoneInfo.full_num}
Регион: ${resPhoneInfo.region}
Оператор: ${resPhoneInfo.operator}
            `
        }

        if (onWhatsApp === true || onTelegram === true) {
            // msg = msg + indented
            msg = msg + `
${ onWhatsApp === true && resWhatsApp ? `WhatsApp: wa.me/${phone}` : '' }
${ onTelegram === true && resTelegram ? `Telegram: t.me/${resTelegram.contact.username}` : '' }
            `
        }

        return msg
    }
}

export default new MSGBuilder