// DOM Ready =============================================================
$(document).ready(function() {

    // Add User button click
    $('button').click(function(event){
      event.preventDefault();
      deleteIdea($(this).data('selector'));
    });
  });

// Functions =============================================================

// Add User
function deleteIdea(ididea) {
    var id = ididea;
    console.log(id)

        $.ajax({
            type: 'DELETE',
            url: '/deleteidea/'+id,
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.message === 'Idea deleted') {

                // Clear the form inputs
                window.location.reload();
            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert(err);

            }
        });
    }
