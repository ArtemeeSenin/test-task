/*Validation*/

var MyForm = {
    validate: function() {
        console.log('validate');
        var result = {
            isValid: false,
            errorFields: []
        }
        var fields = Array.from(form.querySelectorAll('input'));
        var reForm = {
            fio: /^(([A-Za-zА-Яа-я]+)\ ){2}([A-Za-zА-Яа-я]+){1}$/,
            email: /^([a-z0-9_.-]+)@((ya\.ru)|(yandex)\.(ru|ua|by|kz|com))$/,
            phone: /^\+7\([\d]{3}\)[\d]{3}\-[\d]{2}\-[\d]{2}$/
        }

        return result;
    },
    getData: function(){},
    setData: function(){},
    submit: function(){
        console.log('submit');
        var response = this.validate();
        console.log(response);
    }
};

var form = document.forms.myForm;

form.addEventListener('submit', function(e){
    e.preventDefault();
    MyForm.submit();
});