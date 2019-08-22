jQuery.fn.clear = function()
{
    var $form = $(this);
    $form.find('input:text, input:password, input:file, textarea').val('');
    $form.find("input[type=email]").val('');
    $form.find('select option:selected').removeAttr('selected');
    $form.find('input:checkbox, input:radio').removeAttr('checked');
    return this;
};
//Register User
$(".registerBtn").click(function(){
    var rEmail = $("#registerEmail").val();
    var rPass = $("#registerPassword").val();
    var rFirstName = $("#registerFirstName").val();
    var rLastName = $("#registerLastName").val();
    if (rEmail == '' || rPass == '' ){
        alert ("Please fill all fields.");
    } else if ((rPass.length) <8){
        alert("Password should atleast 8 characters in length..")
    } else {
        $.post("http://localhost:4500/posts",{
            "Name": rFirstName +" "+ rLastName,
            "Email":rEmail,
            "Password":rPass,
        },function(){
            $(".form").clear();
            $(".loginFocus").trigger('click');
        }
        )
    }
});
$('.form').find('input, textarea').on('keyup blur focus', function (e) {
  
    var $this = $(this),
        label = $this.prev('label');
  
        if (e.type === 'keyup') {
              if ($this.val() === '') {
            label.removeClass('active highlight');
          } else {
            label.addClass('active highlight');
          }
      } else if (e.type === 'blur') {
          if( $this.val() === '' ) {
              label.removeClass('active highlight'); 
              } else {
              label.removeClass('highlight');   
              }   
      } else if (e.type === 'focus') {
        
        if( $this.val() === '' ) {
              label.removeClass('highlight'); 
              } 
        else if( $this.val() !== '' ) {
              label.addClass('highlight');
              }
      }
  
});
  $('.tab a').on('click', function (e) {
    
    e.preventDefault();
    
    $(this).parent().addClass('active');
    $(this).parent().siblings().removeClass('active');
    
    target = $(this).attr('href');
  
    $('.tab-content > div').not(target).hide();
    
    $(target).fadeIn(600);
});
var hello;
var storedName;
//login
$(".loginBtn").click(function (e){
    var emailId = $("#login-email-id").val();
    var password = $("#login-password").val();
    e.preventDefault();
    $.get({
        async: true,
        url:'http://localhost:4500/posts',
        method: 'GET',
        dataType: 'jsonp',
        success: function(response){
            hello = response;
            storedMail = hello[1].Email;
            storedPassword = hello[1].Password;
            storedName = hello[1].Name;
        },
        error: function(){
            console.log('Something went wrong.');
        }
    }).done(function check(){
        if (emailId == storedMail &&  password == storedPassword) {
            $(".form").clear();
            console.log("logged In");
            $(".form").hide(1000);
            tweetBox();
            setCookie();
            updateName();
        } else {
            $(".form").clear();
            console.log("login Failed");
        }
    });
  });
//set cookies
function setCookie() {
   Cookies.set('name', storedName);    
}
//get cookies
function getCookie(){
    var thisIsUser = Cookies.get('name');
    return thisIsUser;
}
//feed
function feed(){
    $.get({
        async: true,
        url:'http://localhost:4500/comments',
        method: 'GET',
        dataType: 'jsonp',
        success: function(response){
            tweets = response;
            // storedMail = hello[1].Email;
            // storedPassword = hello[1].Password;
        },
        error: function(){
            console.log('Something went wrong fetching comments.');
        }
    }).done(function createBox(response) {
    $.each(response, function(i,val){
        $("#feed").append(
            `
            <div class="card text-white bg-dark mb-3" style="max-width: 20rem;">
            <div class="card-header">Tweeet</div>
            <div class="card-body">
                <h4 class="card-title">${val.title}</h4>
                <p class="card-text">${val.body}</p>
            </div>
            </div>
            `
        );
    });        
    });
    console.log("feed");
}
feed();
function tweetBox() {
    $(".modal").css("display","block");
}
function createPost() {
    
}
//Post tweet to json db on click
$(".submitTweeet").click(function(e){
    var tweeetTitle = $("#inputLarge").val();
    var tweeetBody = $("#exampleTextarea").val();
    
    $.post("http://localhost:4500/comments",{
        "title": tweeetTitle,
        "body": tweeetBody,
    },function(){
        $(".modal").clear();    
    });e.preventDefault();
});
$(".popClose").click(function(){
    $(".modal").css("display","none");    
});
storedName;
//check previous login for auto login
$(document).ready(checkUser());
//update title username on login
function checkUser(){
    thisIsUser = getCookie();
    if (thisIsUser != null) {
    $("#loggedUser").append(
    `<nav class="navbar navbar-expand-md navbar-dark bg-light">
    <a class="navbar-brand title" id="userName" href="#">Welcome back! ${thisIsUser}</a></nav>`);
    $(".loginSignUp").css("display","none");
    tweetBox();
} else {
    $("#loggedUser").append(
        `<nav class="navbar navbar-expand-md navbar-dark bg-light">
        <a class="navbar-brand title" id="userName"href="#">Hello Guest User!</a>
    </nav>`
    )}
};
function updateName(){
    thisIsUser = getCookie();
    $("#userName").replaceWith(`<a class="navbar-brand title" id="userName" href="#">Welcome back! ${thisIsUser}</a>`);
};