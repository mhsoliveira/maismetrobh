$(document).ready(function(){
    var from,to,subject,text;
    $("#send_email").click(function(){
        replyTo=$("#replyTo").val();
        subject=$("#subject").val();
        text=$("#content").val();
        $.get("/send",{replyTo:replyTo,subject:subject,text:text}).done(function( response ) {
          console.log(response);
          // Clear the form inputs
          if(response.message==="Nice") {
            $("#replyTo").val('');
            $("#subject").val('');
            $("#content").val('');
            alert('Mensagem Enviada');
          }
          else{
            alert('Erro: Envie um email para maismetro@gmail.com');
          }

        });;
    });
});
