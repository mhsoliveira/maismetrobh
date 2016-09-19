// Userlist data array for filling in info box
var userPic=String;

window.fbAsyncInit = function() {
    FB.init({
      appId      : '1137108536365807',
      xfbml      : true,
      version    : 'v2.7'
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
      position: [280,215],
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
    $('button#btnAddIdea').on('click', addIdea);

    //Userfind index

    $.getJSON('/userfind/'+user, function(data) {
    userPic=data.picture;
    console.log(userPic);
    });

    // Text Input functions

    $('input').focus(function() {
      if($(this).val() != 'NULL'){$(this).val('#');
    }});

    $('#addProp input').keyup(function() {
      str = $(this).val();
      str = str.replace(/\s/g,'');
      $(this).val(str);
    });

});

// Functions =============================================================

// Add User
function addIdea(event) {
    event.preventDefault();
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
              FB.ui({
                method: 'feed',
                link: "www.maismetrobh.com.br/ideas/"+response.data._id,
                caption: 'An example caption',
              });
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
