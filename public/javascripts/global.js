// Userlist data array for filling in info box
var newIdea = Object;
window.fbAsyncInit = function() {
  FB.init({
    appId      : '1714538908820335',
    xfbml      : true,
    version    : 'v2.8'
  });
};

(function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "//connect.facebook.net/en_US/sdk.js";
   fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));

// DOM Ready =============================================================
$(document).ready(function() {
    $('#firstPop').bPopup({
      follow:[false,false],
       onClose: function(){
         $('#secondPop').bPopup({
           appendTo: '#map',
           follow:[false,false],
           position: [95,22],
           modal: false
         });
       }
     });
    // Add User button click
    $('button#btnAddIdea').click(function(){
      if (typeof userId !== 'undefined') {
        userConfig(user,userId);
      }
      else {
        $('#loginPop').bPopup({
          follow:[false,false],
          onClose: function(){
            alert('Sua proposta não foi salva');
            window.location.href = "/addidea/";
          }
        });
      }
    });

    $('.reff').focus(function() {
      if($(this).val() == ''){$(this).val('#');
    }});

    $('#addProp input').keyup(function() {
      str = $(this).val();
      str = str.replace(/\s/g,'');
      $(this).val(str);
    });

    $('button#register').on('click', reg);
    $('a#fbutton').on('click', fbreg);

});

// Functions =============================================================

//post registration

function newPost(res) {
  //Userfind index
  console.log(res);
  var monthNames = [
    "Jan", "Fev", "Mar",
    "Abr", "Mai", "Jun", "Jul",
    "Ago", "Set", "Out",
    "Nov", "Dez"
  ];

  var date = new Date();
  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  var dateN = day+"/"+monthNames[monthIndex]+"/"+year;
  var sPicture = {
    url: res.picture.data.url,
    name: res.id
  };
  var refs = []
  refs.push($('#addProp input#inputIdeaRef1').val(),$('#addProp input#inputIdeaRef2').val(),$('#addProp input#inputIdeaRef3').val());
  // If it is, compile all user info into one object
  newIdea = {
      desc: $('#inputIdeaDesc').val(),
      user: {
        email: res.email,
        username: res.name,
        picture: '/avatars/'+res.id+'.jpg'
      },
      date: dateN,
      refs: refs,
      type: newDes.type,
      coordinates: newDes.coordinates,
    };
    $.ajax({
        type: 'POST',
        data: sPicture,
        url: '/profile',
        dataType: 'JSON'
    }).done($.ajax({
        type: 'POST',
        data: newIdea,
        url: '/newidea',
        dataType: 'JSON'
    }).done(function( response ) {
        // Check for successful (blank) response
        if (response.message === 'You have got an idea!') {
          $('#addProp input').val('');
          window.location.href = "/ideas/"+response.data._id;
        }
        else {
            // If something goes wrong, alert the error message that our service returned
            $('.loading').hide();
            $('#btnAddIdea').text('Nova Proposta');
            alert(err);
          }
        }));
};

function fbreg(event) {
  event.preventDefault();
  $('.loading').show();
  $('#btnAddIdea').text('Só um min...');
  FB.getLoginStatus(function(response) {
    if (response.status === 'connected') {
      FB.api('/me', {fields: 'id,name,email,picture'}, function(response) {
        newPost(response);
      });
    }
      else {
      FB.login(function(response) {
        if (response.authResponse) {
          FB.api('/me', {fields: 'id,name,email,picture'}, function(response) {
            $('.loading').show();
            $('#btnAddIdea').text('Só um min...');
            var monthNames = [
              "Jan", "Fev", "Mar",
              "Abr", "Mai", "Jun", "Jul",
              "Ago", "Set", "Out",
              "Nov", "Dez"
            ];

            var date = new Date();
            var day = date.getDate();
            var monthIndex = date.getMonth();
            var year = date.getFullYear();

            var dateN = day+"/"+monthNames[monthIndex]+"/"+year;
            // If it is, compile all user info into one object
            var newIdea = {
                desc: $('#inputIdeaDesc').val(),
                user: {
                  email: response.email,
                  username: response.name,
                  picture: response.picture.data.url
                },
                date: dateN,
                refs: refs,
                type: newDes.type,
                coordinates: newDes.coordinates,
              };
            // Use AJAX to post the object to our addProp service
            $.ajax({
                type: 'POST',
                data: newIdea,
                url: '/newidea',
                dataType: 'JSON'
            }).done(function( response ) {

                // Check for successful (blank) response
                if (response.message === 'You have got an idea!') {
                  $('#addProp input').val('');
                  window.location.href = "/ideas/"+response.data._id;
                }
                else {

                    // If something goes wrong, alert the error message that our service returned
                    $('.loading').hide();
                    $('#btnAddIdea').text('Nova Proposta');
                    alert(err);

                }
                });
          });
        } else {
          console.log('User cancelled login or did not fully authorize.');
        }
      }, {scope: 'email, gender, link, locale, name, picture'});
    }
  });
};

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
        userPic=$('input[name=avatar]:checked').val();
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
            userConfig(response.user._id,response.user.username);
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

function userConfig(id,name) {
  userId = name;
  user = id;
  addIdea();
};

// Add linha
function addIdea() {
    //Userfind index
    $('.loading').show();
    $('#btnAddIdea').text('Só um min...');
    var monthNames = [
      "Jan", "Fev", "Mar",
      "Abr", "Mai", "Jun", "Jul",
      "Ago", "Set", "Out",
      "Nov", "Dez"
    ];

    var date = new Date();
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    var dateN = day+"/"+monthNames[monthIndex]+"/"+year;

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addProp input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });
    var refs = []
    refs.push($('#addProp input#inputIdeaRef1').val(),$('#addProp input#inputIdeaRef2').val(),$('#addProp input#inputIdeaRef3').val());
    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newIdea = {
            desc: $('#inputIdeaDesc').val(),
            judger: user,
            user: {
              username: userId,
              picture: userPic
            },
            date: dateN,
            refs: refs,
            type: newDes.type,
            coordinates: newDes.coordinates,
          };
        console.log(newIdea);
        // Use AJAX to post the object to our addProp service
        $.ajax({
            type: 'POST',
            data: newIdea,
            url: '/newidea',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.message === 'You have got an idea!') {
              $('#addProp input').val('');
              window.location.href = "/ideas/"+response.data._id;
            }
            else {

                // If something goes wrong, alert the error message that our service returned
                $('.loading').hide();
                $('#btnAddIdea').text('Nova Proposta');
                alert(err);

            }
        });
    }
    else {
        $('.loading').hide();
        $('#btnAddIdea').text('Nova Proposta');
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};
