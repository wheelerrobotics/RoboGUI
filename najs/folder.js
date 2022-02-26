

function revealNameChange(container){
    console.log(container)
    container.getElementsByClassName("hidden-rename")[0].style.display = "flex";
}
function rehideNameChange(container){
    container.style.display = "none"
}
function changeName(name, container){
    for(let title of document.getElementsByClassName("title")){
        let tname = title.getElementsByTagName("h1")[0].innerHTML;
        if (name == tname) {
            dispError("invalid name", "this name is already being used by another move", 2000)
            return;
        }
    }
    container.getElementsByClassName("title")[0].getElementsByTagName("h1")[0].innerHTML = name;
}
function fold(element, button){
    //let elem = document.getElementById("ee")
    let elementData = JSON.parse(element.getElementsByClassName("data").item(0).innerHTML)
    
    if (button.innerHTML == "▶"){
        button.innerHTML = "▼"
    }else{
        button.innerHTML = "▶"
    }
    if(elementData.folded == false){
        elementData.folded = true
        element.getElementsByClassName("data").item(0).innerHTML = JSON.stringify(elementData)
        for(tohide of element.childNodes){
            if (tohide.className == "panel-header"){
                
            }else{
                tohide.hidden=true;
            }
        }
    }else{
        elementData.folded = false;
        element.getElementsByClassName("data").item(0).innerHTML = JSON.stringify(elementData)
        for(tohide of element.childNodes){
            if(tohide.className != "data")
                tohide.hidden = false
        }

    }

}
function switchOrder(element, place){
    // need a list of elements according to their order in flexbox
    let elems = document.getElementsByClassName('move');

    let order = element.style.order; // 2

    let success = true
    console.log(elems[order], elems[order - place])
    if(document.querySelector('div[style*="order: ' + order + ';"]') != null && document.querySelector('div[style*="order: ' + (order-place) + ';"]') != null){
        console.log('keepin it real')
        var t = document.querySelector('div[style*="order: ' + order + ';"]');
        document.querySelector('div[style*="order: ' + (order-place) + ';"]').style.order = order;
        t.style.order = order-place;
    }else success = false

    if (!success) dispError("cannot move further in this direction", "", 1000);
}
function dispError(title, description, time){

    let err = document.createElement("div")
    err.id = "err"
    err.style.right = Math.random * 200 + "%"
    err.style.top = Math.random * 200 + "%"
    let erTitle = document.createElement("h1")
    erTitle.innerHTML = title;
    let erDesc = document.createElement("p")
    erDesc.innerHTML = description;
    err.appendChild(erTitle);
    err.appendChild(erDesc)

    document.body.append(err);

    err.getElementsByTagName("h1")[0].innerHTML = title;
    err.getElementsByTagName("p")[0].innerHTML = description;
    err.style.display = "block"
    setTimeout(()=>{
        let s = err.style
    s.opacity = 1;
    (function fade(){(s.opacity-=.1)<0?document.body.removeChild(err):setTimeout(fade,40)})();
    }, time)
    
}
function addMove(movetype, title){
    for(let t of document.getElementsByClassName("title")){
        let tname = t.getElementsByTagName("h1")[0].innerHTML;
        if (title == tname) {
            dispError("invalid name", "this name is already being used by another move", 2000)
            return;
        }
    }
    let moveDiv = document.createElement('div')
    moveDiv.className = 'move'
    moveDiv.style.order = document.getElementById('moves-window').childElementCount;
    
    let dataJSON = {
        "folded": false,
        "order": moveDiv.style.order,
        "type": movetype
    }
    let dataJsonElement = document.createElement("p")
    dataJsonElement.innerHTML = JSON.stringify(dataJSON)
    dataJsonElement.hidden = true
    dataJsonElement.className = 'data'

    let titleDiv = document.createElement('div')
    titleDiv.className = "title"

    let titleHeader = document.createElement("h1")
    titleHeader.innerHTML = title

    let foldButton = document.createElement("button")
    foldButton.setAttribute("onclick", "fold(this.parentElement.parentElement, this)")
    foldButton.innerHTML = "▼"

    let orderDiv = document.createElement('div')
    orderDiv.className = 'move-order'

    let upButton = document.createElement('button')
    upButton.setAttribute("onclick", "switchOrder(this.parentElement.parentElement.parentElement, 1)")
    upButton.innerHTML = "up"

    let downButton = document.createElement('button')
    downButton.setAttribute("onclick", "switchOrder(this.parentElement.parentElement.parentElement, -1)")
    downButton.innerHTML = "down"

    let delButton = document.createElement('button')
    delButton.innerHTML = "-"
    delButton.setAttribute('onclick', 'deleteMove(this.parentElement.parentElement)')

    orderDiv.appendChild(upButton)
    orderDiv.appendChild(downButton)

    titleDiv.appendChild(titleHeader)
    titleDiv.appendChild(foldButton)
    titleDiv.appendChild(delButton)
    titleDiv.appendChild(orderDiv)
    
    let paramsDiv = document.createElement('div')
    paramsDiv.className = "params"
    paramsDiv.setAttribute("onchange", "changedParam(this)")

    moveDiv.appendChild(dataJsonElement)
    moveDiv.appendChild(titleDiv)

    switch (movetype) {
        case MoveTypes.LINE:
            paramsDiv.appendChild(createSliderParameter("speed", 0, 1, 0.01))
            //paramsDiv.appendChild(createSliderParameter("direction", 0, 360, 1))
            paramsDiv.appendChild(createDirectionParameter("direction"))
            paramsDiv.appendChild(createNumberParameter("distance", 0, undefined, 1))
            break;
        case MoveTypes.TURN:
            paramsDiv.appendChild(createSliderParameter("degrees", 0, 180, 1))
            paramsDiv.appendChild(createTwoDirectionParameter("direction"))
            paramsDiv.appendChild(createSliderParameter("speed", 0, 1, 0.01))
            break;
        case MoveTypes.SPINNER:
            paramsDiv.appendChild(createSliderParameter("speed", 0, 1, 0.01))
            paramsDiv.appendChild(createNumberParameter("time", 0, undefined, 1))
            createRedBlueDirectionParameter('red/blue')
            break;
        case MoveTypes.ARM:
            paramsDiv.appendChild(createSliderParameter("speed", 0, 1, 0.01))
            paramsDiv.appendChild(createNumberParameter("time", 0, undefined, 1))
            break;
        case MoveTypes.CLAW:
            paramsDiv.appendChild(createSliderParameter("speed", 0, 1, 0.01))
            paramsDiv.appendChild(createOpenCloseDirectionParameter("open/close"))
            break;
        case MoveTypes.DELAY:
            paramsDiv.appendChild(createNumberParameter("time", 0, undefined, 1))
            break;
    }
    let nameChangeDiv = document.createElement('div')
    nameChangeDiv.className = "name-change"

    let questionText = document.createElement('p')
    questionText.setAttribute("onclick", "revealNameChange(this.parentElement)")
    questionText.innerHTML = "change name?"

    let hiddenNameDiv = document.createElement('div')
    hiddenNameDiv.className = "hidden-rename"
    hiddenNameDiv.hidden = true

    let nameLabel = document.createElement('p')
    nameLabel.innerHTML = "name: "

    let nameInput = document.createElement('input')
    nameInput.type = "text"

    let submitNameButton = document.createElement('button')
    submitNameButton.setAttribute("onclick", "rehideNameChange(this.parentElement); changeName(this.parentElement.getElementsByTagName('input')[0].value, this.parentElement.parentElement.parentElement.parentElement)")
    submitNameButton.innerHTML = "submit"

    hiddenNameDiv.appendChild(nameLabel)
    hiddenNameDiv.appendChild(nameInput)
    hiddenNameDiv.appendChild(submitNameButton)

    nameChangeDiv.appendChild(questionText)
    nameChangeDiv.appendChild(hiddenNameDiv)
    
    paramsDiv.appendChild(nameChangeDiv)

    moveDiv.appendChild(paramsDiv)
    changedParam(paramsDiv)

    document.getElementById('moves-window').appendChild(moveDiv)
}
function createSliderParameter(name, min, max, step){
    let paramDiv = document.createElement('div')
    paramDiv.className = "param"

    let labelText = document.createElement('p')
    labelText.innerHTML = name

    let inputRange = document.createElement('input')
    inputRange.type = "range"
    inputRange.setAttribute('onchange', "this.parentElement.getElementsByTagName('input')[1].value = this.value")
    inputRange.min = min
    inputRange.max = max
    inputRange.step = step
    inputRange.value = 0.2

    let inputNum = document.createElement('input')
    inputNum.className = "special"
    inputNum.setAttribute('onchange', "this.parentElement.getElementsByTagName('input')[0].value = this.value")
    inputNum.type = "number"
    inputNum.min = min
    inputNum.max = max
    inputNum.step = step
    inputNum.value = 0.2

    paramDiv.appendChild(labelText)
    paramDiv.appendChild(inputRange)
    paramDiv.appendChild(inputNum)

    return paramDiv;
}
function createDirectionParameter(name){
    let paramDiv = document.createElement('div')
    paramDiv.className = "param"

    let labelText = document.createElement('p')
    labelText.innerHTML = name

    let inputSelection = document.createElement('select')
    
    let backwardOption = document.createElement('option')
    backwardOption.innerHTML = "backward"
    let forwardOption = document.createElement('option')
    forwardOption.innerHTML = "forward"
    let rightOption = document.createElement('option')
    rightOption.innerHTML = "right"
    let leftOption = document.createElement('option')
    leftOption.innerHTML = "left"

    inputSelection.appendChild(backwardOption)
    inputSelection.appendChild(forwardOption)
    inputSelection.appendChild(rightOption)
    inputSelection.appendChild(leftOption)

    paramDiv.appendChild(labelText)
    paramDiv.appendChild(inputSelection)

    return paramDiv;
}
function createTwoDirectionParameter(name){
    let paramDiv = document.createElement('div')
    paramDiv.className = "param"

    let labelText = document.createElement('p')
    labelText.innerHTML = name

    let inputSelection = document.createElement('select')
    
    let rightOption = document.createElement('option')
    rightOption.innerHTML = "right"
    let leftOption = document.createElement('option')
    leftOption.innerHTML = "left"

    inputSelection.appendChild(rightOption)
    inputSelection.appendChild(leftOption)

    paramDiv.appendChild(labelText)
    paramDiv.appendChild(inputSelection)

    return paramDiv;
}
function createRedBlueDirectionParameter(name){
    let paramDiv = document.createElement('div')
    paramDiv.className = "param"

    let labelText = document.createElement('p')
    labelText.innerHTML = name

    let inputSelection = document.createElement('select')
    
    let redOption = document.createElement('option')
    redOption.innerHTML = "red"
    let blueOption = document.createElement('option')
    blueOption.innerHTML = "blue"

    inputSelection.appendChild(redOption)
    inputSelection.appendChild(blueOption)

    paramDiv.appendChild(labelText)
    paramDiv.appendChild(inputSelection)

    return paramDiv;
}
function createOpenCloseDirectionParameter(name){
    let paramDiv = document.createElement('div')
    paramDiv.className = "param"

    let labelText = document.createElement('p')
    labelText.innerHTML = name

    let inputSelection = document.createElement('select')
    
    let openOption = document.createElement('option')
    openOption.innerHTML = "open"
    let closeOption = document.createElement('option')
    closeOption.innerHTML = "close"

    inputSelection.appendChild(openOption)
    inputSelection.appendChild(closeOption)

    paramDiv.appendChild(labelText)
    paramDiv.appendChild(inputSelection)

    return paramDiv;
}
function createCheckboxParameter(name){
    let paramDiv = document.createElement('div')
    paramDiv.className = "param"

    let labelText = document.createElement('p')
    labelText.innerHTML = name

    let inputBox = document.createElement('input')
    inputBox.type = "checkbox"

    paramDiv.appendChild(labelText)
    paramDiv.appendChild(inputNumber)

    return paramDiv;
}
function createNumberParameter(name, min, max, step){
    let paramDiv = document.createElement('div')
    paramDiv.className = "param"

    let labelText = document.createElement('p')
    labelText.innerHTML = name

    let inputNumber = document.createElement('input')
    inputNumber.type = "number"
    inputNumber.min = min
    inputNumber.max = max
    inputNumber.step = step
    inputNumber.value = 333;

    paramDiv.appendChild(labelText)
    paramDiv.appendChild(inputNumber)

    return paramDiv;
}
function newMoveButton(paren){
    let name = paren.getElementsByTagName('input')[0].value
    for(let title of document.getElementsByClassName("title")){
        let tname = title.getElementsByTagName("h1")[0].innerHTML;
        if (name == tname) {
            dispError("invalid name", "this name is already being used by another move", 2000)
            return;
        }
    }
    let movetype = MoveTypes[paren.getElementsByTagName('select')[0].value.toUpperCase()]

    addMove(movetype, name)
    paren.getElementsByTagName('input')[0].value = ''

}
function compileCode(){
    let moveWindow = document.getElementsByClassName('move')
    let theCode = ""
    for(let m of moveWindow){
        let data = JSON.parse(m.getElementsByClassName('data')[0].innerHTML)
        let movetype = data.type
        let lbreak = "\n"
        let direction,speed,degrees,distance,close
        switch (movetype) {
            case MoveTypes.LINE:
                if(!data.direction || !data.speed || !data.distance) break;
                direction = data.direction.toString().charAt(0).toUpperCase() + data.direction.substring(1).toLowerCase();
                speed = data.speed.toString()
                distance = data.distance.toString()
                theCode += lbreak+"meccanum.motorDrive" + direction + "Encoded(" + speed + ", " + distance + "); "+lbreak
                break;
            case MoveTypes.TURN:
                if(!data.speed || !data.degrees) break;
                degrees = (direction == 'right' ? -data.degrees : data.degrees).toString()
                speed = data.speed.toString();
                theCode += lbreak+"meccanum.turnDeg(" + degrees + ", " + speed + ", telemetry); "+lbreak
                break;
            case MoveTypes.CLAW:
                if(!data['open/close']) break;
                theCode += (data['open/close'] == 'open' ? lbreak+'meccanum.openServoFull(); '+lbreak: lbreak+'meccanum.closeServoFull(); '+lbreak)
                break;
            case MoveTypes.SPINNER:
                if(!data.time || !data.speed) break;
                time = data.time.toString()
                speed = (data['red/blue'] == 'red' ? -data.speed : data.speed).toString();
                theCode += lbreak+"meccanum.spinnySpinTime(" + speed + ", " + time + "); "+lbreak
                break;
            case MoveTypes.DELAY:
                if(!data.time) break;
                time = data.time.toString()
                theCode += "delay(" + time + "); "+lbreak
                break;
            case MoveTypes.ARM:
                if(!data.time || !data.speed) break;
                time = data.time.toString()
                speed = data.speed.toString()
                theCode += lbreak+"meccanum.moveArmTime(" + speed + ", " + time + "); "+lbreak
                break;
        }
    }
    document.getElementById("the-code").innerHTML = theCode
}
function updateDataOrder(){
    for(let d of document.getElementsByClassName("move")){
        let data = JSON.parse(d.getElementsByClassName("data")[0].innerHTML)
        data.order = d.style.order
        d.getElementsByClassName("data")[0].innerHTML = JSON.stringify(data)
    }
}
function changedParam(params){
    let move = params.parentElement
    
    let data = JSON.parse(move.getElementsByClassName('data')[0].innerHTML)
    for(let p of params.getElementsByClassName('param')){
        console.log(p.getElementsByTagName('p')[0].innerHTML)
        if(p.getElementsByTagName('input').length == 0) data[p.getElementsByTagName('p')[0].innerHTML] = p.getElementsByTagName('select')[0].value 
        else data[p.getElementsByTagName('p')[0].innerHTML] = p.getElementsByTagName('input')[0].value 
    }
    console.log(data)
    move.getElementsByClassName('data')[0].innerHTML = JSON.stringify(data)
}
function deleteMove(move){
    let data = JSON.parse(move.getElementsByClassName('data')[0].innerHTML)
    document.getElementById('moves-window').removeChild(move)
    for(let m of document.getElementsByClassName('move')){
        if(m.style.order>data.order){
            console.log(m.style.order)
            m.style.order = parseInt(m.style.order) -1
            console.log(m.style.order)
        }
    }
}
function copyString(string, spam){
        navigator.clipboard.writeText(string).then(function() {
          spam.innerHTML = 'copied';
          window.setTimeout(()=>{spam.innerHTML = 'copy'}, 2000)
        }, function() {
          dispError("clipboard copy failed", "this is likely a browser compatibility issue (your fault, not mine!)")
        });
      
}
window.setInterval(updateDataOrder, 40)
window.setInterval(compileCode, 40)
