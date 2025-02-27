console.log('Helow world! This Custom Code...')

//////////////////////////////////////

const sections = [rec793883453, rec792212758]

const waInstance = '1103909234'
const waToken = 'f9e99e16c8064990a05aafa4c59a6858782355c21af942c499'
const redirectTrue = 'https://www.google.com/' // Если человек
const redirectFalse = 'https://ya.ru/' // Если бот

sections.forEach(section => {
    const form = section.querySelector('form')

    if (form) {
        let checkResult

        // const fields = section.querySelectorAll('input')
        // const allFieldsFilled = Array.from(fields).every(field => field.value.trim() !== '');

        if (waInstance && waToken && redirectTrue) {
            checkResult = checkWhatsApp(waInstance, waToken, form);
        }

    }
})

function checkWhatsApp (instance, token, container) {

    let checkFlag = true

    let checkFields = false

    // container.querySelector('[metrix="container"]').insertAdjacentHTML('afterbegin', `
    //     <!-- Field Check WhatsApp Result -->
    //     <input type="hidden" metrix-field="check-wa" name="whatsapp">
    // `);

    const phone = container.querySelector('[name="phone"]')
    const submit = container.querySelector('[type="submit"]')
    // const successbox = container.querySelector('[class="js-successbox t-form__successbox t-text t-text_md"]')

    // Debug
    console.log(phone)
    console.log(submit)
    // console.log(successbox)


    // const submit = container.querySelector('[type="submit"]')
    // const filedCheckResult = container.querySelector('[metrix-field="check-wa"]')

    submit.addEventListener('click', (event) => {


        
        const fields = container.querySelectorAll('input')
        const allFieldsFilled = Array.from(fields).every(field => field.value.trim() !== '');

        // Debug
        console.log(fields)
        console.log(allFieldsFilled)

        if (!allFieldsFilled && !checkFields) {
            alert('Пожалуйста, заполните все поля');
        } else {
            if (checkFlag == true) {

                // Создаем флаг для отслеживания статуса отправки запроса
                let requestSent = false;
    
                // Функция для проверки заполненности всех обязательных полей
                // function areAllFieldsFilled() {
                //     const inputs = container.querySelectorAll('input');
                //     let allFieldsFilled = true;
    
                //     inputs.forEach(input => {
                //         if (input.hasAttribute('required') && !input.value.trim()) {
                //             allFieldsFilled = false;
                //         }
                //     });
    
                //     return allFieldsFilled;
                // }
    
                // Проверяем, заполнены ли все поля перед отправкой запроса
                if (!requestSent) {
                    // Флаг, указывающий на отправку запроса
                    requestSent = true;
    
                    const phoneNumber = phone.value.replace(/\D/g, '');
                    console.log(phoneNumber)
                    // const submitTextDefault = submit.getAttribute('value')
                    // const submitTextLoading = submit.getAttribute('data-wait')
    
                    // submit.setAttribute('value', submitTextLoading)
    
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
    
                        console.log(data)
    
                        checkFlag = false
    
                        if (data.existsWhatsapp === true) {
                            // filedCheckResult.value = 'true'
                            checkResult = 'true'
    
                            redirect(checkResult, container)
                            // submit.setAttribute('value', submitTextDefault)
                            // submit.click()
    
                            // console.log('Флаг проверки:', checkFlag)
                        } else {
                            // filedCheckResult.value = 'false'
                            checkResult = 'false'
    
                            redirect(checkResult, container)
                            // submit.setAttribute('value', submitTextDefault)
                            // submit.click()
    
                            // console.log('Флаг проверки:', checkFlag)
                        }
    
                        // console.log('Рузультат проверки WhatsApp:', data.existsWhatsapp)
                    })
                    .catch(error => {
                        checkFlag = false
                        // filedCheckResult.value = `error: ${error}`
                        checkResult = 'error'
    
                        redirect(checkResult, container)
                        // submit.setAttribute('value', submitTextDefault)
                        // submit.click()
    
                        // console.log('Флаг проверки:', checkFlag)
                    });
                } else {
                    // Если не все обязательные поля заполнены или запрос уже отправлен, ничего не делаем
                    // alert('Пожалуйста, заполните все поля!');
                }
    
                // event.preventDefault();
            } else {
                // submit.click()
            }
            checkFields = true
        }




    })
    
    // console.log('Проверка WA запущена')
}

function redirect(value, container) {

    const success = container.querySelector('[class="js-successbox t-form__successbox t-text t-text_md"]')
    console.log(success)

    // Экземпляр Mutation Observer для отслеживания изменения в блоке Success
    const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'attributes') {
                // Если произошло изменение атрибутов в контейнере Success
                if (value == 'false') {
                    // ~~~ ~~~ Если поле Email заполнено ~~~ ~~~ //
                    window.location.href = redirectFalse
                } else {
                    // ~~~ ~~~ Если поле Email НЕ заполнено ~~~ ~~~ //
                    window.location.href = redirectTrue
                }
            }
        }
    });
                
    // Начинаем отслеживание изменений в контейнере
    observer.observe(success, { attributes: true });

}