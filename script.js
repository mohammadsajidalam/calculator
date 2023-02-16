let first_number = "0";
let second_number = "0";
let result = "0";
let current_operator;
let evaluation = [];
const screen = document.querySelector(".screen");
const keyboard = document.querySelector(".keyboard");

keyboard.addEventListener('click', function(e) {
    e.stopImmediatePropagation()
    onButtonPress(e);
});

function onButtonPress (e) {
    switch(e.target.getAttribute('data-button-type')) {
        case "digit":
            AssignNumber(e)
            break;
        case "operator":
            AssignOperation(e)
            break;
    }

    Render(e);
}

function AssignNumber(e) {

    if(evaluation.length <= 1) {
        first_number = first_number == "0" 
            ? e.target.getAttribute("data-value")
            : first_number + e.target.getAttribute("data-value")

        if(evaluation.length == 1) evaluation.shift();
        evaluation.push(first_number)
        result = first_number;
        return;
    }

    if (evaluation.length >= 2) {
        second_number = second_number == "0"
            ? e.target.getAttribute("data-value")
            : second_number + e.target.getAttribute("data-value");

        if(evaluation.length == 3) evaluation.pop();
        evaluation.push(second_number);
        result = second_number;

    }
}

function AssignOperation(e) {
    current_operator = e.target.getAttribute('data-value');

    // Exclusive operations that can be performed with one number, in the case of clear it can be executed even when the evaluation array is empty
    if(current_operator == "%" || current_operator == "+/-" || current_operator == "clear" || current_operator == "=") return Operate();

    if(evaluation.length == 3) Operate();
    if(evaluation.length == 2) evaluation.pop();
    evaluation.splice(1, 1, current_operator);
}

function Operate() { 
    if(current_operator == "%" && evaluation.length) {
        let number = parseInt(evaluation[evaluation.length - 1])
        result =  (number / 100).toString();
        evaluation.splice(evaluation.length - 1, 1, result);
        return;
    }

    if(current_operator == "+/-" && evaluation.length) {
        result = (evaluation[evaluation.length - 1] * -1).toString();
        evaluation.splice(evaluation.length - 1, 1, result);
        return;
    }

    if(current_operator == "clear") {
        
        if(evaluation.length <= 2) {
            first_number = "0";
            evaluation = [];
            result = "0";
            return;
        }
    
        if(evaluation.length == 3) {
            second_number = "0";
            evaluation = [first_number.toString()]
            result = first_number.toString();
            return;
        }

    }

    if(evaluation.length == 3) {
        result = (eval(evaluation.join().replace(/,/g, ""))).toString();
        first_number = result;
        second_number = "0";
        evaluation = [first_number]
    }
}

function Render(e) {
    const clear_button = document.querySelector('div[data-value="clear"]');

    let new_operator_button = e.target;

    let last_operator_button = document.querySelector('.selected_operation');

    last_operator_button ? last_operator_button.classList.remove('selected_operation') : null;
    new_operator_button ? new_operator_button.classList.add('selected_operation') : null;

    // change screen's font-size
    switch(result.toString().length) {
        case 7:
            screen.style.fontSize = "4.7rem"
            break;
        case 8:
            screen.style.fontSize = "4.1rem"
            break;
        case 9: 
            screen.style.fontSize = "3.65rem"
            break
    }

    if(result.toString().length > 9) {
        screen.textContent = parseFloat(result).toPrecision(3);
    } else {
        screen.textContent = result;
    }

    evaluation.length == "0"
        ? clear_button.textContent = 'AC'
        : clear_button.textContent = 'C'

    
}