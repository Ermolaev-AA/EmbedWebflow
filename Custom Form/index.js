// Docs
// 
// Контейнер формы должен содержать атрибут ermolaev-custom-form-enabled='true'
//

import IMASK from 'https://cdn.jsdelivr.net/npm/imask@7.6.1/esm/index.js'

import GET from './api/get.js'
import MSGBuilder from './services/msgBuilder.js'
import ParamsToObject from './utils/paramsToObject.js'
import CookiesToObject from './utils/cookiesToObject.js'

const { WAPPIPRO_TOKEN, WAPPIPRO_WHATSAPP_ID, WAPPIPRO_TELEGRAM_ID } = ErmolaevCode_Settings

const ErmolaevCode_Settings_DEMO = {
    'EVENT_SUBMIT': {
        'WEBHOOKS': 'https://h.albato.ru/wh/38/1lfo9ut/mloRZ6UPAeW1kx-4JhYiOnfN72Bhi7DvdTgutc2Afxc/',
        'PARAMS_REDIRECT_IF_SPAM_TRUE': 'is_spam=true',
        'PARAMS_REDIRECT_IF_SPAM_FALSE': 'is_spam=false',
    }
}

const Consts_Page_DEMO = {
    'HEADING_PAGE': 'Старт продаж небоскреба на берегу реки в Дорогомилово',
    'DISCRIPTION_PAGE': 'Панорамные виды на гостиницу Украина и реку! Рассрочка 0%, потолки 3,7 м',
}

const eventSubmit = (form) => {
    form.addEventListener('submit', async function(event) {
        event.preventDefault() // предотвращаем стандартную отправку формы

        // if (!ErmolaevCode_Settings?.EVENT_SUBMIT?.WEBHOOKS) return console.error('⛔️ :: Отсутствует обязательный парамтер «WEBHOOKS», отправка формы остановлена!')
        // if (!ErmolaevCode_Settings?.EVENT_SUBMIT?.PARAMS_REDIRECT_IF_SPAM_TRUE) return console.error('⛔️ :: Отсутствует обязательный парамтер «PARAMS REDIRECT IF SPAM TRUE», отправка формы остановлена!')
        // if (!ErmolaevCode_Settings?.EVENT_SUBMIT?.PARAMS_REDIRECT_IF_SPAM_FALSE) return console.error('⛔️ :: Отсутствует обязательный парамтер «PARAMS REDIRECT IF SPAM FALSE», отправка формы остановлена!')

        const submitButton = form.querySelector('button#submit')
        const uploadText = submitButton.getAttribute('upload-text')
        const submitText = submitButton.getAttribute('text')
        submitButton.textContent = uploadText

        const url = window.location.href
        const domain = new URL(window.location.href).hostname
        const page = window.location.pathname.split('/').pop()
        const cookie = document.cookie

        const userAgent = navigator.userAgent
        const userDevice = userAgent.split(' ')[0] // Вообще нужно?
        const userOS = userAgent.split('(')[1].split(')')[0] // Вообще нужно?

        const metaTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content')
        const metaDescription = document.querySelector('meta[property="og:description"]')?.getAttribute('content')
        const metaImage = document.querySelector('meta[property="og:image"]')?.getAttribute('content')

        const name = form.querySelector('input#name').value
        const phone = form.querySelector('input#phone').value

        const formattedPhone = phone.replace(/[^0-9]/g, '')

        const userConnectionData = await GET.ConnectionData()
        const resPhoneInfo = await GET.PhoneInfo(formattedPhone)
        const isPhone = resPhoneInfo?.code ? true : false

        const resWhatsApp = isPhone === true ? await GET.WhatsApp(formattedPhone) : null
        const resTelegram = isPhone === true ? await GET.Telegram(formattedPhone) : null
        const resDumps = isPhone === true ? await GET.Userbox(formattedPhone) : null

        const onWhatsApp = resWhatsApp?.on_whatsapp || false
        const onTelegram = resTelegram?.status === 'done' ? true : false
        const isSpam = (onWhatsApp === true || resTelegram === true) ? false : true

        const reqBody = {
            url: url,
            domain: domain,
            cookie: cookie,
            params: ParamsToObject(url),
            cookies: CookiesToObject(cookie),
            page: {
                slug: page,
                meta_title: metaTitle,
                meta_description: metaDescription,
                meta_image: metaImage,
            },
            user: {
                agent: userAgent,
                device: userDevice,
                os: userOS,
                is_phone: isPhone,
                is_spam: JSON.stringify(isSpam),
                connection_data: JSON.stringify(userConnectionData),
                on_whatsapp: onWhatsApp,
                on_telegram: onTelegram,
                report_phone: JSON.stringify(resPhoneInfo),
                report_whatsapp: JSON.stringify(resWhatsApp),
                report_telegram: JSON.stringify(resTelegram),
                dumps: JSON.stringify(resDumps),
                answers: {
                    name: name,
                    phone: formattedPhone
                }
            },
            messages: {
                fields: MSGBuilder.Fields({ name, phone: formattedPhone }),
                device: `Устройство: ${userAgent}`,
                connection: MSGBuilder.Connection(userConnectionData),
                contact: MSGBuilder.Сontact({ formattedPhone, isPhone, isSpam, onWhatsApp, onTelegram, resPhoneInfo, resWhatsApp, resTelegram, resDumps }),
            }

        }

        console.log('Submit Req-Body:', reqBody)
    
        // ... можно добавить отправку данных через fetch или AJAX
        const requestURL = ErmolaevCode_Settings.EVENT_SUBMIT.WEBHOOKS
        const request = await fetch(requestURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reqBody),
        }); 

        // Redirect 
        let paramSpam
        if (ErmolaevCode_Settings?.EVENT_SUBMIT?.PARAMS_REDIRECT_IF_SPAM_TRUE && ErmolaevCode_Settings?.EVENT_SUBMIT?.PARAMS_REDIRECT_IF_SPAM_FALSE) {
            if (isSpam === true) {
                paramSpam = ErmolaevCode_Settings?.EVENT_SUBMIT?.PARAMS_REDIRECT_IF_SPAM_TRUE
            } else {
                paramSpam = ErmolaevCode_Settings?.EVENT_SUBMIT?.PARAMS_REDIRECT_IF_SPAM_FALSE
            }
        } else {
            if (isSpam === true) {
                paramSpam = 'is_spam=true'
            } else {
                paramSpam = 'is_spam=false'
            }
        }

        const linkRedirect = `${form.getAttribute('redirect')}/?${paramSpam}&last_page=${page}`        
        window.location.href = linkRedirect // Action Redirect
        
        // возвращаем текст в конпке
        submitButton.textContent = submitText
    })
}

const forms = document.querySelectorAll("[ermolaev-custom-form-enabled='true']")
const parentForms = Array.from(forms).map(form => form.parentElement)

parentForms.forEach(parentForm => {
    const formWrapper = parentForm.querySelector("[ermolaev-custom-form-enabled='true']")
    const form = formWrapper.querySelector('form')
    const inputName = form.querySelector('input#name')
    const inputPhone = form.querySelector('input#phone')
    const inputSubmit = form.querySelector('input#submit')    

    // console.log('Form Wrapper:', formWrapper) // Debug
    // console.log('Form:', form) // Debug
    // console.log('Input Name:', inputName) // Debug
    // console.log('Input Phone:', inputPhone) // Debug
    // console.log('Input Submit:', inputSubmit) // Debug

    // 1. В Webflow в родительском контейнере формы (уловный formWrapper) заложен классический принцип
    //    обработки события «submit» (отправки формы). Чтобы его сломать, нужно в родительском 
    //    контейнере (условном formWrapper) избавиться от класса «w-form» и клонировать форму

    const newClass_formWrapper = formWrapper.className.replace(/\bw-form\b$/, '').trim()
    const newClass_form = form.className
    const newRedirect_form = form.getAttribute('redirect')
    const newClass_inputName = inputName.className
    const newPlaceholder_inputName = inputName.getAttribute('placeholder')
    const newClass_inputPhone = inputPhone.className
    const newPlaceholder_inputPhone = inputPhone.getAttribute('placeholder')
    const newClass_inputSubmit = inputSubmit.className
    const newValue_inputSubmit = inputSubmit.getAttribute('value')
    const newUploadText_inputSubmit = inputSubmit.getAttribute('data-wait')

    // 2. Создание новой формы на основе существующей
    parentForm.insertAdjacentHTML('beforeend', `
        <div id='form-wrapper' class='${newClass_formWrapper}'>
            <form id='ermolaev-custom-form' redirect="${newRedirect_form}" class='${newClass_form}'>
                <input id='name' type='text' class='${newClass_inputName}' placeholder='${newPlaceholder_inputName}' required>
                <input id='phone' type='text' class='${newClass_inputPhone}' placeholder='${newPlaceholder_inputPhone}' required>
                <button id='submit' type='submit' class='${newClass_inputSubmit}' upload-text='${newUploadText_inputSubmit}' text='${newValue_inputSubmit}'>${newValue_inputSubmit}</button>
            </form>
        </div>
    `)

    // 3. Удаляем старую форму
    // formWrapper.remove()

    // 3.1. Создаем маску для нового поля номера телефона с помощью IMASK
    const newForm = parentForm.querySelector('form#ermolaev-custom-form')
    const newPhoneField = newForm.querySelector('input#phone')
    const newPhoneValue = IMASK(newPhoneField, {
        mask: '+{7} 000 000 00 00',
        lazy: true,
        placeholderChar: '',
    })

    newPhoneField.addEventListener('blur', function() {
        // Если введенная длина меньше длины маски, то сбрасываем значение поля
        // Если введенная длина меньше 11 (длины номера с маской), то сбрасываем значение поля
        if (newPhoneValue.unmaskedValue.length < 11) {
            newPhoneValue.value = ''; // Очищаем значение поля
        }
    })

    // 4. Запускаем свою оброботку «submit» (отправки формы)
    eventSubmit(newForm)
})