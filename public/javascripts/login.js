// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function() {
    $('button#login').on('click', log);
    // Add User button click
    $('button#register').on('click', reg);

});

// Functions =============================================================

// Add User
function reg(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#reg input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    if($('input#inputNewPass').val()!=$('input#inputConfirmPass').val()) { errorCount++; };

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var userReg = {
            username: $('input#inputNewName').val(),
            email: $('input#inputNewEmail').val(),
            password: $('input#inputNewPass').val(),
          };

        // Use AJAX to post the object to our addProp service
        $.ajax({
            type: 'POST',
            data: userReg,
            url: '/register',
            dataType: 'JSON',
            statusCode: {
              500: function() {
                alert("Nome de usuário já cadastrado");
              }}
            }).done(function(response) {
          if (response.message === 'User Registered') {

            // Clear the form inputs
            $('#reg input').val('');
            window.location.href = "/";
        }
        else {

            // If something goes wrong, alert the error message that our service returned
            alert(err);

        }});
    }
    else {
        // If errorCount is more than 0, error out
        alert('Verifique se todos os campos estao preenchidos corretamente');
        return false;
    }
};

// Add User
function log(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#log input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var userLog = {
            username: $('input#logEmail').val(),
            password: $('input#logPass').val(),
          };

        // Use AJAX to post the object to our addProp service
        $.ajax({
            type: 'POST',
            data: userLog,
            url: '/user/login',
            dataType: 'JSON',
            statusCode: {
              401: function() {
                alert("Nome ou senha inválidos");
              }}
        }).done(function(response) {
          console.log(response)
          if (response.message === 'Logged') {

            // Clear the form inputs
            $('#log input').val('');
            window.location.href = "/";
        }
        else {

            // If something goes wrong, alert the error message that our service returned
            alert(err);

        }});
    }
    else {
        // If errorCount is more than 0, error out
        alert('Verifique se todos os campos estao preenchidos');
        return false;
    }
};
