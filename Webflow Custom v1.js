console.log('Hello world! This Custom Code...')


///////////////////////////


const domain = new URL(window.location.href).hostname;
const page = window.location.pathname.split('/').pop();

const url = window.location.href
const cookie = document.cookie
const utmArray = utmsToArray(url);
const cookieArray = cookiesToArray(cookie);

const containers = document.querySelectorAll('[custom-form="container"]');

document.addEventListener('DOMContentLoaded', function() {
    containers.forEach(container => {

        let checkResult
        const waInstance = container.getAttribute('instance')
        const waToken = container.getAttribute('token')
        const redirectTrue = container.getAttribute('redirect-true')
        const redirectFalse = container.getAttribute('redirect-false')

        const phoneField = container.querySelector('[field="phone"]')

        container.querySelector('form').insertAdjacentHTML('afterbegin', `
            <!-- Metrix Field -->
            <div metrix="container" style="display: none;"></div>
        `);

        const metrixContainer = container.querySelector('[metrix="container"]');
    
        if (phoneField) {
            const phoneMask = phoneField.getAttribute('mask')

            if (phoneMask) {
                maskPhone(phoneField, phoneMask)
            } 

            if (waInstance && waToken) {
                if (redirectTrue && redirectFalse) {
                    checkResult = checkWhatsApp(waInstance, waToken, container)
                }
            }

        }

        metrixContainer.insertAdjacentHTML('afterbegin', `
            <!-- System data -->
            <input type="hidden" metrix-field="url" name="url">
            <input type="hidden" metrix-field="domain" name="domain">
            <input type="hidden" metrix-field="page" name="page">
            <input type="hidden" metrix-field="cookie" name="cookie">
            <!-- Сollection data -->
            <input type="hidden" metrix-field="heading" name="heading">
            <input type="hidden" metrix-field="discription" name="discription">
            <input type="hidden" metrix-field="quck-link-1" name="quck_link-1">
            <input type="hidden" metrix-field="quck-link-2" name="quck_link-2">
            <input type="hidden" metrix-field="quck-link-3" name="quck-link-3">
            <!-- Dynamic partition data -->
            <input type="hidden" metrix-field="dynamic-section" name="dynamic-section">
            <input type="hidden" metrix-field="dynamic-section-percentage" name="dynamic-section-percentage">
            <input type="hidden" metrix-field="dynamic-section-layout" name="dynamic-section-layout">
        `);
    
        document.querySelector('[metrix-field="url"]').value = url
        document.querySelector('[metrix-field="domain"]').value = new URL(url).hostname;
        document.querySelector('[metrix-field="page"]').value = page
        document.querySelector('[metrix-field="cookie"]').value = cookie

        document.querySelector('[metrix-field="heading"]').value = heading
        document.querySelector('[metrix-field="discription"]').value = discription
        document.querySelector('[metrix-field="quck-link-1"]').value = quck_link_1
        document.querySelector('[metrix-field="quck-link-2"]').value = quck_link_2
        document.querySelector('[metrix-field="quck-link-3"]').value = quck_link_3

        document.querySelector('[metrix-field="dynamic-section"]').value = dynamic_section
        document.querySelector('[metrix-field="dynamic-section-percentage"]').value = dynamic_section_percentage
        document.querySelector('[metrix-field="dynamic-section-layout"]').value = 'Default'
        
        for (let i = 0; i < utmArray.length; i++) {
            const utm = utmArray[i];
            metrixContainer.insertAdjacentHTML('beforeend', `
                <!-- UTM: ${utm.name}=${utm.value} -->
                <input type="hidden" metrix-field="${utm.name}" name="${utm.name}">
            `);
    
            document.querySelector(`[metrix-field="${utm.name}"]`).value = `${utm.value}`
        }
    
        for (let i = 0; i < cookieArray.length; i++) {
            const cookie = cookieArray[i];
            metrixContainer.insertAdjacentHTML('beforeend', `
                <!-- Cookie: ${cookie.name}=${cookie.value} -->
                <input type="hidden" metrix-field="${cookie.name}" name="cookie: ${cookie.name}">
            `);
    
            document.querySelector(`[metrix-field="${cookie.name}"]`).value = `${cookie.value}`
        }

        // // // // // // // // // // // // // //   // // // // // // // // // // // // // //
        // // //     Dynamic Section     // // //   // // // // // // // // // // // // // //
        // // // // // // // // // // // // // //   // // // // // // // // // // // // // //

        if (dynamic_section) {
            // const dynamic_section_percentage = 80 // Debug
            const randomValue = Math.floor(Math.random() * 100) + 1
            const sectionAboutCompany = document.querySelector('[section=about-company]')
            const sectionSocial = document.querySelector('[section=social]')
            
            sectionAboutCompany.style.display = 'none'
            sectionSocial.style.display = 'none'

            // Debug Values
            // console.log(`Процент: ${dynamic_section_percentage}`)
            // console.log(`Случайное число: ${randomValue}`)

            if (randomValue <= dynamic_section_percentage) {
                if (dynamic_section_layout == 'About Company + Social') {
                    const sections = [sectionAboutCompany, sectionSocial]

                    onBlock(sections)
                }
            }

            function onBlock(sections) {
                const fields = document.querySelectorAll('[metrix-field="dynamic-section-layout"]')

                // Преобразуем массив `sections` в текст (например, берем атрибуты `section`)
                const sectionsText = sections
                    .map(section => section.getAttribute('section')) // Берем значение атрибута `section`
                    .filter(Boolean) // Убираем `null` или `undefined`, если атрибут отсутствует
                    .join(', '); // Соединяем элементы запятой и пробелом

                // Устанавливаем текстовое значение в поля
                fields.forEach(field => {
                    field.value = sectionsText;
                });
                
                sections.forEach(section => {
                    section.style.display = 'block'
                })
            }
        }

        // // // // // // // // // // // // // //   // // // // // // // // // // // // // //
        // // // // // // // // // // // // // //   // // // // // // // // // // // // // //
        // // // // // // // // // // // // // //   // // // // // // // // // // // // // //

        // Debugging
        // console.log(container);
    });
});

function maskPhone(field, mask) {
    var phoneValue = IMask(field, {
      mask: '+{7} 000 000 00 00',
      lazy: true,
      placeholderChar: ''
    });
    
    field.addEventListener('blur', function() {
        // Если введенная длина меньше длины маски, то сбрасываем значение поля
        // Если введенная длина меньше 11 (длины номера с маской), то сбрасываем значение поля
        if (phoneValue.unmaskedValue.length < 11) {
            phoneValue.value = ''; // Очищаем значение поля
        }
    });
}

function checkWhatsApp (instance, token, container) {

    let checkFlag = true

    container.querySelector('[metrix="container"]').insertAdjacentHTML('afterbegin', `
        <!-- Field Check WhatsApp Result -->
        <input type="hidden" metrix-field="check-wa" name="whatsapp">
    `);

    const submit = container.querySelector('[type="submit"]')
    const filedCheckResult = container.querySelector('[metrix-field="check-wa"]')

    submit.addEventListener('click', (event) => {

        if (checkFlag == true) {

            // Создаем флаг для отслеживания статуса отправки запроса
            let requestSent = false;

            // Функция для проверки заполненности всех обязательных полей
            function areAllFieldsFilled() {
                const inputs = container.querySelectorAll('input');
                let allFieldsFilled = true;

                inputs.forEach(input => {
                    if (input.hasAttribute('required') && !input.value.trim()) {
                        allFieldsFilled = false;
                    }
                });

                return allFieldsFilled;
            }

            // Проверяем, заполнены ли все поля перед отправкой запроса
            if (areAllFieldsFilled() && !requestSent) {
                // Флаг, указывающий на отправку запроса
                requestSent = true;

                const phoneNumber = container.querySelector('[field="phone"]').value.replace(/\D/g, '');
                const submitTextDefault = submit.getAttribute('value')
                const submitTextLoading = submit.getAttribute('data-wait')

                submit.setAttribute('value', submitTextLoading)

                fetch(`https://api.green-api.com/waInstance${instance}/checkWhatsapp/${token}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        phoneNumber: phoneNumber
                    })
                })
                .then(response => response.json())
                .then(data => {
                    checkFlag = false

                    if (data.existsWhatsapp === true) {
                        filedCheckResult.value = 'true'
                        checkResult = 'true'

                        redirect(checkResult, container)
                        submit.setAttribute('value', submitTextDefault)
                        submit.click()

                        // console.log('Флаг проверки:', checkFlag)
                    } else {
                        filedCheckResult.value = 'false'
                        checkResult = 'false'

                        redirect(checkResult, container)
                        submit.setAttribute('value', submitTextDefault)
                        submit.click()

                        // console.log('Флаг проверки:', checkFlag)
                    }

                    // console.log('Рузультат проверки WhatsApp:', data.existsWhatsapp)
                })
                .catch(error => {
                    checkFlag = false
                    filedCheckResult.value = `error: ${error}`
                    checkResult = 'error'

                    redirect(checkResult, container)
                    submit.setAttribute('value', submitTextDefault)
                    submit.click()

                    // console.log('Флаг проверки:', checkFlag)
                });
            } else {
                // Если не все обязательные поля заполнены или запрос уже отправлен, ничего не делаем
                alert('Пожалуйста, заполните все поля!');
            }

            event.preventDefault();
        } else {
            submit.click()
        }


    })
    
    // console.log('Проверка WA запущена')
}

function redirect(value, container) {

    const success = container.querySelector('[ae-form="success"]')

    container.querySelector('form').addEventListener('submit', (event) => {

        // Экземпляр Mutation Observer для отслеживания изменения в блоке Success
        const observer = new MutationObserver((mutationsList, observer) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes') {
                    // Если произошло изменение атрибутов в контейнере Success
                    if (value == 'false') {
                        // ~~~ ~~~ Если поле Email заполнено ~~~ ~~~ //
                        window.location.href = container.getAttribute('redirect-false')
                    } else {
                        // ~~~ ~~~ Если поле Email НЕ заполнено ~~~ ~~~ //
                        window.location.href = `${container.getAttribute('redirect-true')}${page}`
                    }
                }
            }
        });
                
        // Начинаем отслеживание изменений в контейнере
        observer.observe(success, { attributes: true });
    });

}



// Parsing UTM and creating an array
function utmsToArray(url) {
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

// Parsing Cookie and creating an array
function cookiesToArray(cookie) {
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