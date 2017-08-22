var MyForm = (function(){

    /* init */
    var form = document.forms.myForm;
    var fields = Array.from(form.querySelectorAll('input')); // Массив полей формы
    var submitBtn = form.querySelector('#submitButton');
    var resultContainer = document.querySelector('#resultContainer');
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        resultContainer.textContent = '';
        MyForm.submit();
    });

    /* public */
    function validate() {
        console.log('validate');
        var result = {
            isValid: true,
            errorFields: []
        };

        _checkFields(result);
        _setClasses(result);

        return result;
    }

    function getData() {
        var fieldsData = {};
        for (var i = 0; i < fields.length; i++) {
            var currentField = fields[i];
            fieldsData[currentField.name] = currentField.value;
        }
        return fieldsData;
    }

    function setData(data) {
        var acceptedFieldNames = ['phone', 'fio', 'email']; // Массив допустимых полей

        for (var k in data) { // Занесение данных по ключам полученного объекта
            if (acceptedFieldNames.indexOf(k) !== -1) {
                form[k].value = data[k];
            }
        }
    }

    function submit() {
        console.log('submit');
        var validationResult = this.validate();
        console.log(validationResult);
        if (validationResult.isValid) {
            console.log('ready to send');
            submitBtn.setAttribute('disabled', 'disabled');

            _sendRequest(form.action, _responseResult); // Ajax запрос
        }
    }


    /* private func */

    function _checkFields(result){
        console.log(result);

        var reForm = { // Регулярки для проверки полей
            fio: /^(([A-Za-zА-Яа-я]+)\ ){2}([A-Za-zА-Яа-я]+){1}$/,
            email: /^([a-z0-9_.-]+)@((ya\.ru)|((yandex)\.(ru|ua|by|kz|com)))$/,
            phone: /^\+7\([\d]{3}\)[\d]{3}\-[\d]{2}\-[\d]{2}$/
        };

        for (var i = 0; i < fields.length; i++) { // Проверка полей в массиве fields
            var currentField = fields[i];
            console.log(currentField);

            if (!reForm[currentField.name].test(currentField.value))
                result.errorFields.push(currentField.name);
        }
        if(result.errorFields.indexOf('phone') === -1 && !_checkPhoneDigitsSum(form.phone.value)){
            result.errorFields.push('phone');
        }
    }

    function _setClasses(result){
        for(var i = 0; i < fields.length; i++){
            var currentField = fields[i];
            if(result.errorFields.indexOf(currentField.name) === -1)
                currentField.classList.remove('error');
            else
                currentField.classList.add('error');

            if(result.errorFields.length)
                result.isValid = false;

        }
    }

    function _sendRequest(url, cb){
        console.log('url cb', url, cb);

        var oReq = new XMLHttpRequest();
        oReq.open("GET", url, true);
        oReq.addEventListener('load', function(){
            var response = JSON.parse(this.responseText);
            var query = {
                url: url,
                response: response
            };
            _responseResult(query);
        });
        oReq.send();
    }

    function _responseResult(query){
        console.log('query: ', query);
        switch(query.response.status){
            case 'success':
                resultContainer.classList.remove('error');
                resultContainer.classList.add('success');
                resultContainer.textContent = 'Success';
                submitBtn.removeAttribute('disabled');
                break;
            case 'error':
                resultContainer.classList.add('error');
                resultContainer.textContent = query.response.reason;
                submitBtn.removeAttribute('disabled');
                break;
            case 'progress':
                setTimeout(_sendRequest, query.response.timeout, query.url, _responseResult);
        }
    }

    function _checkPhoneDigitsSum(phoneString){
        var sum = 0;
        var maxSumInc = 30; // Максимальная сумма включительно
        var phoneSymbols = phoneString.split('');
        console.log('checking sum of: ', phoneSymbols);
        for(var i = 0; i < phoneSymbols.length; i++){
            var phoneSymbolAsNum = parseInt(phoneSymbols[i], 10);
            if(!isNaN(phoneSymbolAsNum)){ // Если сифвол число, то прибавить к сумме, иначе пропустить
                sum += phoneSymbolAsNum;
            }
        }
        console.log('sum = ', sum);
        return (sum <= maxSumInc);
    }

    return {
        validate: validate,
        getData: getData,
        setData: setData,
        submit: submit
    }
})();

