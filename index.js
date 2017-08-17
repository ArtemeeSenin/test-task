var MyForm = {
    validate: function() {
        console.log('validate');
        var result = {
            isValid: true,
            errorFields: []
        }
        var fields = Array.from(form.querySelectorAll('input'));
        var reForm = {
            fio: /^(([A-Za-zА-Яа-я]+)\ ){2}([A-Za-zА-Яа-я]+){1}$/,
            email: /^([a-z0-9_.-]+)@((ya\.ru)|((yandex)\.(ru|ua|by|kz|com)))$/,
            phone: /^\+7\([\d]{3}\)[\d]{3}\-[\d]{2}\-[\d]{2}$/
        }

        for(var i = 0; i < fields.length; i++){
            console.log(fields[i]);
            if(!reForm[fields[i].name].test(fields[i].value)){
                fields[i].classList.add('error');
                result.isValid = false;
                result.errorFields.push(fields[i].name);
            } else{
                fields[i].classList.remove('error');
            }
            if(fields[i].name === 'phone' && result.errorFields.indexOf('phone') === -1) {
                console.log('phone numbers check', result.errorFields);
                if (!checkPhoneDigitsSum(fields[i].value)) {
                    fields[i].classList.add('error');
                    result.isValid = false;
                    result.errorFields.push(fields[i].name);
                }
            }
        }

        return result;
    },
    getData: function(){
        var fieldsData = {};
        var fields = Array.from(form.querySelectorAll('input'));
        for(var i = 0; i < fields.length; i++){
            fieldsData[fields[i].name] = fields[i].value;
        }
        return fieldsData;
    },
    setData: function(data){
        var acceptedFieldNames = ['phone', 'fio', 'email'];

        for(var k in data){
            if(acceptedFieldNames.indexOf(k) !== -1){
                form[k].value = data[k];
            }
        }
    },
    submit: function(){
        console.log('submit');
        var response = this.validate();
        console.log(response);
        if(response.isValid){
            console.log('ready to send');
            submitBtn.setAttribute('disabled', 'disabled');

            getResponse(form.action, responseAction);
        }
    }
};

function getResponse(url, cb){
    console.log('url cb', url, cb);
    var oReq = new XMLHttpRequest();
    oReq.open("GET", url, true);
    oReq.addEventListener('load', function(){
        var response = JSON.parse(this.responseText);
        if (response.status === 'progress'){
            console.log('progress ', response);
            setTimeout(getResponse, response.timeout, url, cb);
            return;
        } else {
            console.log('ready ', response);
            cb(response);
            return;
        }
    })
    oReq.send();
}

function responseAction(response){
    console.log('response: ', response);
    if(response.status === 'success'){
        resultContainer.classList.remove('error');
        resultContainer.classList.add('success');
        resultContainer.textContent = 'Success';
    } else if(response.status === 'error'){
        resultContainer.classList.add('error');
        resultContainer.textContent = response.reason;
    }
    submitBtn.removeAttribute('disabled');
}

var form = document.forms.myForm;
var submitBtn = form.querySelector('#submitButton');
var resultContainer = document.querySelector('#resultContainer');
form.addEventListener('submit', function(e){
    e.preventDefault();
    resultContainer.textContent = '';
    MyForm.submit();
});

function checkPhoneDigitsSum(phoneString){
    var sum = 0;
    var maxSumInc = 30;
    var phoneSymbols = phoneString.split('');
    console.log('checking sum of: ', phoneSymbols);
    for(var i = 0; i < phoneSymbols.length; i++){
        if(parseInt(phoneSymbols[i])){
            sum += parseInt(phoneSymbols[i]);
        }
    }
    console.log('sum = ', sum);
    if(sum > maxSumInc){
        return false;
    } else{
        return true;
    }
}