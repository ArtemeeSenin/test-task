var MyForm = (function(){

    var form = document.forms.myForm;
    var fields = Array.from(form.querySelectorAll('input')); // Массив полей формы
    var submitBtn = form.querySelector('#submitButton');
    var resultContainer = document.querySelector('#resultContainer');
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        resultContainer.textContent = '';
        MyForm.submit();
    });


    function getResponse(url, cb){
        console.log('url cb', url, cb);
        var oReq = new XMLHttpRequest();
        oReq.open("GET", url, true);
        oReq.addEventListener('load', function(){
            var response = JSON.parse(this.responseText);
            if (response.status === 'progress'){ // Если ответ progress, повтор запроса через timeout миллисекунд
                console.log('progress ', response);
                setTimeout(getResponse, response.timeout, url, cb);
                return;
            } else {
                console.log('ready ', response);
                cb(response); // Если ответ пришел, выполнение коллбэка
                return;
            }
        });
        oReq.send();
    }

    function responseAction(response){
        console.log('response: ', response);
        switch (response.status) {
            case 'success':
                resultContainer.classList.remove('error');
                resultContainer.classList.add('success');
                resultContainer.textContent = 'Success';
                break;
            case 'error':
                resultContainer.classList.add('error');
                resultContainer.textContent = response.reason;
                break;
        }
        submitBtn.removeAttribute('disabled');
    }

    function checkPhoneDigitsSum(phoneString){
        var sum = 0;
        var maxSumInc = 30; // Максимальная сумма включительно
        var phoneSymbols = phoneString.split('');
        console.log('checking sum of: ', phoneSymbols);
        for(var i = 0; i < phoneSymbols.length; i++){
            var phoneSymbolAsNumber = parseInt(phoneSymbols[i], 10);
            if(!isNaN(phoneSymbolAsNumber)){ // Если сифвол число, то прибавить к сумме, иначе пропустить
                sum += phoneSymbolAsNumber;
            }
        }
        console.log('sum = ', sum);
        if(sum > maxSumInc){
            return false;
        } else{
            return true;
        }
    }

    return {
        validate: function () {
            console.log('validate');
            var result = {
                isValid: true,
                errorFields: []
            };
            var reForm = { // Регулярки для проверки полей
                fio: /^(([A-Za-zА-Яа-я]+)\ ){2}([A-Za-zА-Яа-я]+){1}$/,
                email: /^([a-z0-9_.-]+)@((ya\.ru)|((yandex)\.(ru|ua|by|kz|com)))$/,
                phone: /^\+7\([\d]{3}\)[\d]{3}\-[\d]{2}\-[\d]{2}$/
            };

            for (var i = 0; i < fields.length; i++) { // Проверка полей в массиве fields
                var currentField = fields[i];
                console.log(currentField);
                if (!reForm[currentField.name].test(currentField.value)) {
                    currentField.classList.add('error');
                    result.isValid = false;
                    result.errorFields.push(currentField.name);
                } else {
                    currentField.classList.remove('error');
                }
                if (currentField.name === 'phone' && result.errorFields.indexOf('phone') === -1) {
                    console.log('phone numbers check', result.errorFields);
                    if (!checkPhoneDigitsSum(currentField.value)) { // Если телефон, то проверка суммы цифр
                        currentField.classList.add('error');
                        result.isValid = false;
                        result.errorFields.push(currentField.name);
                    }
                }
            }

            return result;
        },
        getData: function () {
            var fieldsData = {};
            for (var i = 0; i < fields.length; i++) {
                var currentField = fields[i];
                fieldsData[currentField.name] = currentField.value;
            }
            return fieldsData;
        },
        setData: function (data) {
            var acceptedFieldNames = ['phone', 'fio', 'email']; // Массив допустимых полей

            for (var k in data) { // Занесение данных по ключам полученного объекта
                if (acceptedFieldNames.indexOf(k) !== -1) {
                    form[k].value = data[k];
                }
            }
        },
        submit: function () {
            console.log('submit');
            var validationResult = this.validate();
            console.log(validationResult);
            if (validationResult.isValid) {
                console.log('ready to send');
                submitBtn.setAttribute('disabled', 'disabled');

                getResponse(form.action, responseAction); // Ajax запрос
            }
        }
    }
})();

