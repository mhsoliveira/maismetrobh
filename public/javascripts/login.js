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
    $('#ger.loading').show();
    $('button#register').text('Só um min...');
    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#reg input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });
    if($('input[name=avatar]:checked').val() === undefined) { errorCount++; }
    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var userReg = {
            picture: $('input[name=avatar]:checked').val(),
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
                $('#ger.loading').hide();
                $('button#register').text('Criar Conta');
                alert("Nome de usuário já cadastrado");
              }}
            }).done(function(response) {
          if (response.message === 'User Registered') {

            // Clear the form inputs
            $('#reg input').val('');
            window.location.href = "/";
        }
        else {
          $('#ger.loading').hide();
          $('button#register').text('Criar Conta');

            // If something goes wrong, alert the error message that our service returned
            alert(err);

        }});
    }
    else {
        // If errorCount is more than 0, error out
        $('#ger.loading').hide();
        $('button#register').text('Criar Conta');
        alert('Verifique se todos os campos estao preenchidos corretamente');
        return false;
    }
};

// Add User
function log(event) {
    event.preventDefault();
    $('button#login').text('Só um min...');
    $('#gol.loading').show();

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
                $('button#login').text('Login');
                $('#gol.loading').hide();
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
          $('button#login').text('Login');
          $('#gol.loading').hide();

            // If something goes wrong, alert the error message that our service returned
            alert(err);

        }});
    }
    else {
        // If errorCount is more than 0, error out
        $('button#login').text('Login');
        $('#gol.loading').hide();
        alert('Verifique se todos os campos estao preenchidos');
        return false;

    }
};
