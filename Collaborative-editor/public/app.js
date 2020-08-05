const socket = io('http://localhost:5000')
var testarea = document.getElementById("testing-area");

const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')


const name = prompt('What is your name?')
appendMessage('You joined')
socket.emit('new-user', name)

socket.on('user-connected', name => {
    appendMessage(`${name} connected`)
  })

socket.on('chat-message', data => {
  appendMessage(`${data.name}: ${data.message}`)
})



socket.on('user-disconnected', name => {
  appendMessage(`${name} disconnected`)
})

messageForm.addEventListener('submit', e => {
  e.preventDefault()
  const message = messageInput.value
  appendMessage(`You: ${message}`)
  socket.emit('send-chat-message', message)
  messageInput.value = ''
})

function appendMessage(message) {
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messageContainer.append(messageElement)
}

function input_update_callback() {
    socket.emit('myInputUpdate', {
        contents:testarea.value
    });
}

(function() {
    socket.on('myInputUpdate', function (data) {
        testarea.value = data.contents;
    });
})();
var file = document.getElementById("myFile").files[0];
var reader = new FileReader();
reader.onload = function (e) {
    var textArea = document.getElementById("testing-area");
    textArea.value = e.target.result;
};
reader.readAsText(file);

var exeApp = angular.module('serverExe', [])
.directive('onReadFile', function ($parse) {
    return {
        restrict: 'A',
        scope: false,
        link: function(scope, element, attrs) {
            element.bind('change', function(e) {
                
                var onFileReadFn = $parse(attrs.onReadFile);
                var reader = new FileReader();
                
                reader.onload = function() {
                    var fileContents = reader.result;
                    
                    scope.$apply(function() {
                        onFileReadFn(scope, {
                            'contents' : fileContents
                        });
                    });
                };
                reader.readAsText(element[0].files[0]);
            });
        }
    };
})
.controller('someCtrl', function($scope){

    $scope.displayFileContents = function(contents) {
        console.log(contents);
        $scope.results = contents;
    };

});

