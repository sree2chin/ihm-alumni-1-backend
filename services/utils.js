module.exports = new function(){
    this.validateEmail = function(email){
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };
    this.validatePhoneNumber = function(phoneNumber) {
        var regex = /^[2-9]{2}[0-9]{8}$/;
        return regex.test(String(phoneNumber));
    }
    this.validatePassword = (password) => {
        const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
        return regex.test(password);
    }
};