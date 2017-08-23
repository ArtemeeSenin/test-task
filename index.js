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
        var result = {
            isValid: true,
            errorFields: []
        };

        _checkFields(result);
        _setClasses(result);

        if(result.errorFields.length) {
            result.isValid = false;
            resultContainer.classList.remove('success');
        }

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
        var validationResult = this.validate();
        if (validationResult.isValid) {
            submitBtn.setAttribute('disabled', 'disabled');
            _sendRequest(form.action, _responseResult); // Ajax запрос
        }
    }


    /* private func */

    function _checkFields(result){
        var reForm = { // Регулярки для проверки полей
            fio: /^(([A-Za-zА-Яа-я]+)\ ){2}([A-Za-zА-Яа-я]+){1}$/,
            email: /^([a-z0-9_.-]+)@((ya\.ru)|((yandex)\.(ru|ua|by|kz|com)))$/,
            phone: /^\+7\([\d]{3}\)[\d]{3}\-[\d]{2}\-[\d]{2}$/
        };

        for (var i = 0; i < fields.length; i++) { // Проверка полей в массиве fields
            var currentField = fields[i];

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
        }
    }

    function _sendRequest(url, cb){
        var oReq = new XMLHttpRequest();
        oReq.open("GET", url, true);
        oReq.addEventListener('load', function(){
            var query = {
                url: url,
                response: JSON.parse(this.responseText),
                callback: cb
            };
            cb(query);
        });
        oReq.send();
    }

    function _responseResult(query){
        switch(query.response.status){
            case 'success':
                resultContainer.classList.remove('error');
                resultContainer.classList.remove('progress');
                resultContainer.classList.add('success');
                resultContainer.textContent = 'Success';
                submitBtn.removeAttribute('disabled');
                break;
            case 'error':
                resultContainer.classList.remove('success');
                resultContainer.classList.remove('progress');
                resultContainer.classList.add('error');
                resultContainer.textContent = query.response.reason;
                submitBtn.removeAttribute('disabled');
                break;
            case 'progress':
                resultContainer.classList.add('progress');
                setTimeout(_sendRequest, query.response.timeout, query.url, query.callback);
        }
    }

    function _checkPhoneDigitsSum(phoneString){
        var sum = 0;
        var maxSumInc = 30; // Максимальная сумма включительно
        var phoneSymbols = phoneString.split('');
        for(var i = 0; i < phoneSymbols.length; i++){
            var phoneSymbolAsNum = parseInt(phoneSymbols[i], 10);
            if(!isNaN(phoneSymbolAsNum)){ // Если символ число, то прибавить к сумме, иначе пропустить
                sum += phoneSymbolAsNum;
            }
        }
        return (sum <= maxSumInc);
    }

    return {
        validate: validate,
        getData: getData,
        setData: setData,
        submit: submit
    }
})();

