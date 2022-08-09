var height = 100

$(document).ready(function () {
    userData = {}
    userData['count'] = 0
//    console.log('userData Created!', userData)
    document.cookie = 'userData=' + JSON.stringify(userData) + ";domain=;path=/"
});

navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function (stream) {
//        console.log('You let me use your mic!')
    })
    .catch(function (err) {
//        console.log('No mic for you!')
    });

jQuery(document).ready(function () {
    jQuery(".toggle-btn, .close-icon").click(function () {
        jQuery("body").toggleClass("show");
    });
});

function scrollToBottom() {
    height += 100
    $('.chat-box-des-main').scrollTop(height);
}


function getBotResponse() {
    var rawText = $("#textInput").val();
    var userHtml = '<div class="right-chat"><p class="chat-word">' + rawText + '</p></div> ';
    $("#textInput").val("");
    $("#chatbox").append(userHtml);
    scrollToBottom();
    $.get("/self-train", { msg: rawText }).done(function (data) {
        var botHtml = '<div class="left-chat"><p class="chat-word">' + data['message'] + '</p></div> ';
//        console.log('Done', userData);
        if (userData['count'] == 0 && data['status'] == 200) {
//            console.log("!111111")
            userData = JSON.parse(getCookie('userData'))
            userData['count'] = 1;
            document.cookie = 'userData=' + JSON.stringify(userData) + ";domain=;path=/"
//            console.log("IF count 1", userData);
            $("#chatbox").append(botHtml);
            var user = JSON.parse(getCookie('user'));
            if (!user) {
                $("#chatbox").append(`<div class="left-chat">
                  <p class="chat-word">Let's quick signup</p>
                </div>
                <div class="left-chat">
                  <p class="chat-word">What is you name?</p>
                </div>`)
            }
            scrollToBottom();
            return false
        }
        if (userData['count'] == 1 && data['status'] == 200) {
//            console.log("!111111")
            userData = JSON.parse(getCookie('userData'))
            userData['count'] = 2;
            userData['username'] = data['value'];
            document.cookie = 'userData=' + JSON.stringify(userData) + ";domain=;path=/"
//            console.log("IF count 1", userData);
            $("#chatbox").append(botHtml);
            scrollToBottom();
            return false
        }
        if (userData['count'] == 2 && data['status'] == 200) {
//            console.log("!222222", data['value'])
            userData = JSON.parse(getCookie('userData'))
            userData['count'] = 3;
            userData['email'] = data['value'];
//            console.log(userData);
            document.cookie = 'userData=' + JSON.stringify(userData) + ";domain=;path=/"
            $("#chatbox").append(botHtml);
            scrollToBottom();
            return false
        }
        if (userData['count'] == 3 && data['status'] == 200) {
            userData = JSON.parse(getCookie('userData'))
            userData['count'] = 4;
            userData['age'] = data['value'];
            $("#chatbox").append(botHtml);
            scrollToBottom();
            return false
        }
        if (userData['count'] == 4 && data['status'] == 200) {
            userData = {}
            document.cookie = 'userData=' + JSON.stringify(userData) + ";domain=;path=/"
            $("#chatbox").append(botHtml);
            scrollToBottom();
            return false
        }
        $("#chatbox").append(botHtml);
        scrollToBottom();
    });

}
$("#textInput").keypress(function (e) {
    if (e.which == 13 && $("#textInput").val().length != 0) {
        getBotResponse();
    }
});
$("#buttonInput").click(function () {
    if ($("#textInput").val().length != 0) {
        getBotResponse();
    }
})

var language = 'en-US';
var final_transcript = '';
var recognizing = false;
var ignore_onend;
var start_timestamp;

var recognition;

function setUp() {
    if (!('webkitSpeechRecognition' in window)) {
        upgrade();
    } else {
        //        start_button.style.display = 'inline-block';
        recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onstart = function () {
//            console.log("onstart")
            recognizing = true;
                start_img.style.display = 'none'
            audio_img.style.display = 'inline-block'

        };

        recognition.onerror = function (event) {
            if (event.error == 'no-speech') {
                start_img.style.display = 'none'
                stop_img.style.display = 'inline-block'
                ignore_onend = true;
            }
            if (event.error == 'audio-capture') {
                start_img.style.display = 'none'
                stop_img.style.display = 'inline-block'
                ignore_onend = true;
            }
            if (event.error == 'not-allowed') {
                start_img.style.display = 'none'
                stop_img.style.display = 'inline-block'
                if (event.timeStamp - start_timestamp < 100) {
                } else {
                }
                ignore_onend = true;
            }
        };

        recognition.onend = function () {
//            console.log("onend")
            recognizing = false;
            if (ignore_onend) {
                return;
            }
            start_img.style.display = 'inline-block'
            audio_img.style.display = 'none'
//            console.log(final_transcript);
            if (!final_transcript) {
                return;
            }
            if (window.getSelection) {
                window.getSelection().removeAllRanges();
                var range = document.createRange();
                window.getSelection().addRange(range);
            }
            $.get("/self-train", { msg: final_transcript }).done(function (data) {
                var botHtml = '<div class="left-chat"><p class="chat-word">' + data['message'] + '</p></div> ';
//                console.log("data", data['message'])
                if (userData['count'] == 0 && data['status'] == 200) {
//                    console.log("!111111")
                    userData = JSON.parse(getCookie('userData'))
                    userData['count'] = 1;
                    document.cookie = 'userData=' + JSON.stringify(userData) + ";domain=;path=/"
//                    console.log("IF count 1", userData);
                    $("#chatbox").append(botHtml);
                    scrollToBottom();
                    if (!user) {
                        $("#chatbox").append(`<div class="left-chat">
                            <p class="chat-word">Let's quick signup</p>
                            </div>
                            <div class="left-chat">
                            <p class="chat-word">What is you name?</p>
                            </div>`)
                    }
                    var msg = new SpeechSynthesisUtterance();
                    msg.text = data['message'];
                    window.speechSynthesis.speak(msg);
                    return false
                }
                if (userData['count'] == 1 && data['status'] == 200) {
//                    console.log("!111111")
                    userData = JSON.parse(getCookie('userData'))
                    userData['count'] = 2;
                    userData['username'] = data['value'];
                    document.cookie = 'userData=' + JSON.stringify(userData) + ";domain=;path=/"
//                    console.log("IF count 1", userData);
                    $("#chatbox").append(botHtml);
                    scrollToBottom();
                    var msg = new SpeechSynthesisUtterance();
                    msg.text = data['message'];
                    window.speechSynthesis.speak(msg);
                    return false
                }
                if (userData['count'] == 2 && data['status'] == 200) {
//                    console.log("!222222", data['value'])
                    userData = JSON.parse(getCookie('userData'))
                    userData['count'] = 3;
                    userData['email'] = data['value'];
//                    console.log(userData);
                    document.cookie = 'userData=' + JSON.stringify(userData) + ";domain=;path=/"
                    $("#chatbox").append(botHtml);
                    scrollToBottom();
                    var msg = new SpeechSynthesisUtterance();
                    msg.text = data['message'];
                    window.speechSynthesis.speak(msg);
                    return false
                }
                if (userData['count'] == 3 && data['status'] == 200) {
                    userData = JSON.parse(getCookie('userData'))
                    userData['count'] = 4;
                    userData['age'] = data['value'];
                    document.cookie = 'userData=' + JSON.stringify(userData) + ";domain=;path=/"
                    $("#chatbox").append(botHtml);
                    scrollToBottom();
                    var msg = new SpeechSynthesisUtterance();
                    msg.text = data['message'];
                    window.speechSynthesis.speak(msg);
                    return false
                }
                if (userData['count'] == 4 && data['status'] == 200) {
                    userData = {}
                    document.cookie = 'userData=' + JSON.stringify(userData) + ";domain=;path=/"
                    $("#chatbox").append(botHtml);
                    scrollToBottom();
                    var msg = new SpeechSynthesisUtterance();
                    msg.text = data['message'];
                    window.speechSynthesis.speak(msg);
                    return false
                }
                $("#chatbox").append(botHtml);
                scrollToBottom();
                var msg = new SpeechSynthesisUtterance();
                msg.text = data['message'];
                window.speechSynthesis.speak(msg);
            });

        };

        recognition.onresult = function (event) {
//            console.log("onresult")
            var interim_transcript = '';
            if (typeof (event.results) == 'undefined') {
                recognition.onend = null;
                recognition.stop();
                upgrade();
                return;
            }
            for (var i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    final_transcript += event.results[i][0].transcript;
                } else {
                    interim_transcript += event.results[i][0].transcript;
                }
            }
        };
    }
}

function upgrade() { // tell user to upgrade &/or use Chrome
    start_button.style.visibility = 'hidden';
}

function startButton(event) {
//    console.log(recognizing)
    if (recognizing) {
//        console.log("startButton", recognizing)
        recognition.stop();
        return;
    }
//    console.log("startButton", recognizing)
    final_transcript = '';
    recognition.lang = language;
    recognition.start();
    ignore_onend = false;
    start_img.style.display = 'none'
}

setUp();

// Cookie initialization

function getCookie(name) {
    // Split cookie string and get all individual name=value pairs in an array
    var cookieArr = document.cookie.split(";");

    // Loop through the array elements
    for (var i = 0; i < cookieArr.length; i++) {
        var cookiePair = cookieArr[i].split("=");

        /* Removing whitespace at the beginning of the cookie name
        and compare it with the given string */
        if (name == cookiePair[0].trim()) {
            // Decode the cookie value and return
            return decodeURIComponent(cookiePair[1]);
        }
    }

    // Return null if not found
    return null;
}
var userData = JSON.parse(getCookie('userData'));


if (userData == undefined) {
    userData = {}
    userData['count'] = 0
//    console.log('userData Created!', userData)
    document.cookie = 'userData=' + JSON.stringify(userData) + ";domain=;path=/"
}
//console.log('on refresh userData:', userData)