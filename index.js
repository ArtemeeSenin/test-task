/*Validation*/

var MyForm = {
    validate: function() {
        return {isValid: false, error: ['hello']}
    },
    getData: function(data){
        return this[data];
    },
    setData: function(){},
    submit: function(){}
};