var userPhoto=String;

window.fbAsyncInit = function() {
    FB.init({
      appId      : '1714538908820335',
      xfbml      : true,
      version    : 'v2.7'
    });
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/pt_BR/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));

// DOM Ready =============================================================
$(document).ready(function() {

    $("#countRate").text('('+rating.length+')');
    $(".tot5").text('('+cnt5+')');
    $(".tot4").text('('+cnt4+')');
    $(".tot3").text('('+cnt3+')');
    $(".tot2").text('('+cnt2+')');
    $(".tot1").text('('+cnt1+')');

    $(".per5").text(' - '+Math.round(cnt5*100/rating.length)+'%');
    $(".per4").text(' - '+Math.round(cnt4*100/rating.length)+'%');
    $(".per3").text(' - '+Math.round(cnt3*100/rating.length)+'%');
    $(".per2").text(' - '+Math.round(cnt2*100/rating.length)+'%');
    $(".per1").text(' - '+Math.round(cnt1*100/rating.length)+'%');


    $("#rate").rateYo(idearating);
    // Add User button click
    $('#btnAddComment').on('click', addComment);

    //Userfind index


    $.getJSON('/userfind/'+user, function(data) {
    userPhoto=data.picture;
    });

});

// Functions =============================================================

//ajax call

var idearating = {
    rating: avg,
    starWidth: "16px",
    normalFill: "#e8f8fb",
    ratedFill: "#ec6655",
    fullStar: true,
    onSet: function (rating, rateYoInstance) {
      if(typeof user !== 'undefined'){
      var rate = {
        rating: rating,
        judger: user
      };
      if(judgers.search(user)<0){$.ajax({
        type: 'PUT',
        data: rate,
        url: '/rate/'+ideaId,
        dataType: 'JSON',
        success:function(html){
                    location.reload();
                }
      });}
      else{alert("Você já avaliou essa proposta. Avalie outra.");};
    }
    else{window.location.replace("/login");}
  }
}

// Comment
function addComment(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    if ($('input#inputNewComment').val() === '') { errorCount++; };

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newcomment = {ncomment: { body: $('input#inputNewComment').val(), user: userId, photo: userPhoto, uid:user }};
        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'PUT',
            data: newcomment,
            url: '/addcomment/'+ideaId,
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.message === 'Idea updated') {

                // Clear the form inputs
                $('#addcomment input').val('');
                window.location.href = '/ideas/'+ideaId;
            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert(err);

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Escreva primeiro o seu comentario');
        return false;
    }
};
