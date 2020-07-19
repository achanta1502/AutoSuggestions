
var inputData = new Set();
var auto = null;

window.onload = function() {
    if(auto == null) {
    auto = new AutoComplete();
    }

    document.getElementById("button").addEventListener("click", viewData);
    document.getElementById("add").addEventListener("click", addData);
    document.getElementById("word").addEventListener("keyup", autoGuess);
    
}

function autoGuess() {
    var success = document.getElementById("success");
    var error = document.getElementById("error");
    success.style.display = "none";
    error.style.display = "none";
    var data = document.getElementById("word").value.toLowerCase();
    let temp = data.replace(/[^a-zA-Z]/g, "");
    
    if(data.trim().length !== temp.trim().length) {
        error.style.display = "block";
        error.innerHTML = "No Special characters included";
        return;
    }

    var suggestions = auto.autoComplete(temp);
    
    if(inputData.size === 0 || suggestions.size === 0) {
        success.style.display = "block";
        success.innerHTML = "No Suggestions";
        return;
    }

    success.style.display = "block";
    success.innerHTML = "Suggested Words: " + getData(suggestions);
    
}

function addData() {
var word = document.getElementById("word");
var data = word.value.toLowerCase();
var error = document.getElementById("error");

if(data == null || data.trim().length === 0) {
    error.style.display = "block";
    error.innerHTML = "Input should not be empty";
    disappear();
    return;
}

let temp = data.replace(/[^a-zA-Z]/g, "");

if(temp.length !== data.length) {
    error.style.display = "block";
    error.innerHTML = "only words without any special characters";
    disappear();
    return;
}

inputData.add(temp);
auto.insertIfNotPresent(temp);
success.style.display = "block";
success.innerHTML = temp + " is added successfully";
word.value = "";
disappear();
}

function disappear() {
    setTimeout(() => {
        error.style.display = "none";
        success.style.display = "none";
    }, 1000);
}

function viewData() {
    var success = document.getElementById("success");
    var error = document.getElementById("error");
    var button = document.getElementById("button");

    success.style.display = "none";
    error.style.display = "none";

    if(button.value === "show") {
        show(success, error, button)
    } else {
        hide(success, error, button)
    }
}

function show(success, error, button) {
    if(inputData.size === 0) {
        error.style.display = "block";
        error.innerHTML = "There are no words entered till now";
        setTimeout(() => {
            hide(success, error, button);
        }, 1000);
    } else {
    error.style.display = "none";
    success.style.display = "block";
    success.innerText = getData(inputData);
    button.innerText = "Hide Words";
    button.value = "hide";
    }
}

function hide(success, error, button) {
    error.style.display = "none";
    success.style.display = "none";
    success.innerText = "";
    button.innerText = "Show Words";
    button.value = "show";
}

function getData(input) {
    let temp = "";
    for(let str of input) {
        temp = temp + str + ", "
    }
    return temp.substring(0, temp.length - 2);
}

class Trie {
    constructor() {
        this.isEnd = false;
        this.children = new Array(5);
        for(let i = 0; i < 26; i++) {
            this.children[i] = null;
        }
    }
}

class AutoComplete {
    constructor() {
        this.root = new Trie();
    }

     search(data) {
        var trie = this.root;
        for(let i = 0; i < data.length; i++) {
            let index = data.charCodeAt(i) - 97;
            if(trie.children[index] == null) {
                return null;
            }
            trie = trie.children[index];
        }
        return trie;
    }

    insertMultiple(inputs) {
        for(let str of inputs) {
            this.insert(str);
        }
    }

    insertIfNotPresent(input) {
        if(!inputData.has([input])) {
            auto.insert(input);     
        }
    }

    insert(input) {
        var trie = this.root;

        for(let i = 0; i < input.length; i++) {
            let index = input.charCodeAt(i) - 97;
            if(trie.children[index] == null) {
                trie.children[index] = new Trie();
            }
            trie = trie.children[index];
        }
        trie.isEnd = true;
    }

    guessRec(set, trie, temp, input) {
        if(trie == null) {
            return;
        }

        if(trie.isEnd) {
            set.add(input + temp);
        }

        var children = trie.children;

        for(let i = 0; i < children.length; i++) {
            if(children[i] == null) {
                continue;
            }
            this.guessRec(set, children[i], temp + String.fromCharCode(97 + i), input);
        }
    }

    autoComplete(input) {
        var set = new Set();
        var trie = this.search(input);
        this.guessRec(set, trie, "", input);
        return set;
    }
}