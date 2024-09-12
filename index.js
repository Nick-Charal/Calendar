let monthsArray = new Array(12).fill("");
let daysArray = new Array(7).fill("");
let datesArray = new Array(31).fill().map((_, index) => index + 1);

monthsArray.forEach((month, index) => {
    monthsArray[index] = new Date(0, index).toLocaleString('en-US', {month: 'long'});
})

daysArray.forEach((day, index) => {
    daysArray[index] = new Date(0, 0, index).toLocaleString('en-US', {weekday: 'short'});
})

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let currentDay = new Date().getDay();
let currentDate = new Date().getDate();

let dates = document.querySelector("#dates ul");

let markedDate;

document.getElementById("month").innerHTML = monthsArray[currentMonth];
document.getElementById("year").innerHTML = currentYear + `<span id="down">&#x2B9F</span>`;

function createCalendar(currentYear, currentMonth) {
    let firstDay = new Date(currentYear, currentMonth, 1).getDay();
    let lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();
    let lastDay = new Date(currentYear, currentMonth, lastDate).getDay();
    let lastDateOfPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
    
    dates.innerHTML = "";

    for(i = firstDay; i > 0; i--) {
        dates.innerHTML += `<li class="previous_month">${lastDateOfPrevMonth -i + 1}</li>`
    }

    for(i = 1; i <= lastDate; i++) {
        if(i == currentDate && currentYear == new Date().getFullYear() && currentMonth == new Date().getMonth()) {
            dates.innerHTML += `<li class="active_date">${i}</li>`
            continue;
        }
        dates.innerHTML += `<li>${i}</li>`;
    }

    for(i = lastDay; i < 6; i++) {
        dates.innerHTML += `<li class="next_month">${i + 1 - lastDay}</li>`
    }

    document.querySelectorAll("#dates li").forEach(each => {
        if(document.querySelectorAll(`.${generateClass(each)}`).length > 0) {
            each.style.color = "red";
        }
    })

}

createCalendar(currentYear, currentMonth);

let previousMonth = document.getElementById("previous_month");
let nextMonth = document.getElementById("next_month");

previousMonth.addEventListener("click", () => {
    if(currentMonth > 0) {
        currentMonth--;
    }
    else {
        currentYear--;
        currentMonth = 11;
        document.getElementById("year").innerHTML = currentYear + `<span id="down">&#x2B9F</span>`;
    }
    document.getElementById("month").innerHTML = monthsArray[currentMonth];
    createCalendar(currentYear, currentMonth);
})

nextMonth.addEventListener("click", () => {
    if(currentMonth < 11) {
        currentMonth++;
    }
    else {
        currentYear++;
        currentMonth = 0;
        document.getElementById("year").innerHTML = currentYear + `<span id="down">&#x2B9F</span>`;
    }
    document.getElementById("month").innerHTML = monthsArray[currentMonth];
    createCalendar(currentYear, currentMonth);
})

let changeYear = document.getElementById("year");
let inputYear = document.querySelector("#target_year input");
let flag = 0;

changeYear.addEventListener("click", () => {
    if(!flag) {
        document.getElementById("target_year").style.display = "block";
        flag = 1;
        inputYear.addEventListener("keypress", (e) => {
            if(e.key === "Enter") {
                if(Number(inputYear.value) >= 1980 && Number(inputYear.value) <= 2080){
                    currentYear = Number(inputYear.value);
                    createCalendar(currentYear, currentMonth);
                    document.getElementById("year").innerHTML = currentYear + `<span id="down">&#x2B9F</span>`;
                    document.getElementById("target_year").style.display = "none";
                }
                else {
                    alert("Choose a year between 1980-2080");
                }
            }
        })
    }
    else {
        document.getElementById("target_year").style.display = "none";
        flag = 0;
    }
})

let markedDiv;

document.getElementById("dates").addEventListener("click", (e) => {
    if(markedDate) {
        if(document.querySelectorAll(`.${markedDiv}`).length > 0) {
            document.querySelectorAll(`.${markedDiv}`).forEach(each => {
                each.style.display = "none";
            })
        }
        markedDate.classList.remove("marked_date");
    }
    else {
        document.querySelectorAll(`.${generateClass(document.querySelector(".active_date"))}`).forEach(each => {
            each.style.display = "none";
        })
    }
    if(!e.target.classList.contains("marked_date") && e.target.matches("li")) {
        e.target.classList.add("marked_date");
        markedDate = e.target;
    }

    markedDiv = generateClass(markedDate);
    if(document.querySelectorAll(`.${markedDiv}`).length > 0) {
        document.querySelectorAll(`.${markedDiv}`).forEach(each => {
            each.style.display = "flex";
        })
    }
})

let createEvent = document.getElementById("create");
let deleteEvent = document.getElementById("delete");
let markEvent = document.getElementById("mark");

createEvent.addEventListener("click", () => {
    document.getElementById("event_info").style.display = "flex";
    if(document.getElementById("event_container").childNodes.length > 0) {
        document.querySelector("form").reset();
    }
})

let selectHour = document.getElementById("hours");
let selectMinute = document.getElementById("minutes");

selectHour.addEventListener("keypress", (e) => {
    if(e.target.value.length == 0 && e.key > 2) {
        e.target.value = '0';
    }
    if(e.target.value.length == 1 && e.target.value[0] == '2' && e.key > 3) {
        e.preventDefault();
    }
    if(e.target.value.length == 2 || e.key == '+' || e.key == '-') {
        e.preventDefault();
    }
})

selectHour.addEventListener("keydown", (e) => {
    if(e.key === "Backspace") {
        e.target.value = '';
    }
})

selectMinute.addEventListener("keypress", (e) => {
    if(e.target.value.length == 0 && e.key > 5) {
        e.target.value = '0';
    }
    if(e.target.value.length == 2) {
        e.preventDefault();
    }
})

selectMinute.addEventListener("keydown", (e) => {
    if(e.key === "Backspace") {
        e.target.value = '';
    }
})

let addEvent = document.getElementById("add");
let cancelEvent = document.getElementById("cancel");

addEvent.addEventListener("click", (e) => {
    let eventName = document.getElementById("event_name");
    let eventDetails = document.getElementById("event_details");
    let eventTime = document.querySelectorAll("#event_time input");

    let newDiv = document.createElement("div");
    newDiv.setAttribute("class", "event")
    let newDivClass;

    newDivClass = generateClass(markedDate);

    newDiv.classList.add(newDivClass);

    let newPName = document.createElement("p");
    let newPDetails = document.createElement("p");
    let newPTime = document.createElement("p");
    let newBr = document.createElement("br");

    if(eventName.value == "") {
        newPName.textContent = "_blank_"
    }
    else {
        newPName.textContent = eventName.value;
    }

    if(eventDetails.value == "") {
        newPDetails.textContent = "_blank_"
    }
    else {
        newPDetails.textContent = eventDetails.value;
    }

    if(eventTime[0].value == "" && eventTime[1].value != "") {
        if(eventTime[1].value.length == 1) {
            eventTime[1].value = '0' + eventTime[1].value;
        }
        newPTime.textContent = ("00" + ":" + eventTime[1].value);
    }
    else if(eventTime[0].value != "" && eventTime[1].value == "") {
        if(eventTime[0].value.length == 1) {
            eventTime[0].value = '0' + eventTime[0].value;
        }
        newPTime.textContent = (eventTime[0].value + ":" + "00");
    }
    else if(eventTime[0].value == "" && eventTime[1].value == "") {
        newPTime.textContent = "All Day";
    }
    else {
        if(eventTime[0].value.length == 1) {
            eventTime[0].value = '0' + eventTime[0].value;
        }
        if(eventTime[1].value.length == 1) {
            eventTime[1].value = '0' + eventTime[1].value;
        }
        newPTime.textContent = (eventTime[0].value + ":" + eventTime[1].value);
    }

    if(newPTime.textContent != "All Day") {
        newDiv.setAttribute("data-sort", Number(newPTime.textContent.replace(':', '')));
    }
    else {
        newDiv.setAttribute("data-sort", "-1");

    }
    newDiv.append(newPName, newPDetails, newPTime);

    if(document.querySelectorAll(`.${generateClass(document.querySelector(".active_date"))}`).length > 0) {
        try {
            document.querySelectorAll(`.${generateClass(document.querySelector(".active_date"))}`).forEach(each => {
                if(Number(each.getAttribute("data-sort")) > Number(newDiv.getAttribute("data-sort"))) {
                    document.getElementById("event_container").insertBefore(newDiv, each);
                    throw new Error();
                }
                else {
                    each.parentNode.insertBefore(newDiv, each.nextSibling);
                }
            })
        }
        catch(e) {}
    }
    else {
        document.getElementById("event_container").appendChild(newDiv);
    }
    
    if(document.querySelectorAll(`.${generateClass(document.querySelector(".marked_date"))}`).length > 0) {
        try {
            document.querySelectorAll(`.${generateClass(document.querySelector(".marked_date"))}`).forEach(each => {
                if(Number(each.getAttribute("data-sort")) > Number(newDiv.getAttribute("data-sort"))) {
                    document.getElementById("event_container").insertBefore(newDiv, each);
                    throw new Error();
                }
                else {
                    each.parentNode.insertBefore(newDiv, each.nextSibling);
                }
            })
        }
        catch(e) {}
    }
    else {
        document.getElementById("event_container").appendChild(newDiv);
    }

    document.getElementById("event_info").style.display = "none";

    if(markedDate) {
        document.querySelector(".marked_date").style.color = "red";
    }
    else {
        document.querySelector(".active_date").style.color = "red";
    }

    if(document.querySelectorAll(`.${markedDiv}`).length > 0) {
        document.querySelectorAll(`.${markedDiv}`).forEach(each => {
            each.style.display = "flex";
        })
    }
    if(!markedDate) {
        document.querySelectorAll(`.${generateClass(document.querySelector(".active_date"))}`).forEach(each => {
            each.style.display = "flex";
        })
    }

    e.preventDefault();
})

cancelEvent.addEventListener("click", () => {
    document.getElementsByTagName("form").reset();
    document.getElementById("event_info").style.display = "none";
})

let markedEvent;

document.getElementById("event_container").addEventListener("click", (e) => {
    if(e.target.matches(".event *")) {
        if(markedEvent) {
            markedEvent.parentNode.classList.remove("marked_event");
        }
        if(!e.target.parentNode.classList.contains("marked_event")) {
            e.target.parentNode.classList.add("marked_event");
            markedEvent = e.target;
        }
    }
})

deleteEvent.addEventListener("click", () => {
    if(markedEvent) {
        document.querySelector(".marked_event").remove();
        markedEvent = null;
    }
    if(markedDate) {
        if(document.querySelectorAll(`.${generateClass(markedDate)}`).length == 0) {
            document.querySelector(".marked_date").style.color = "white";
        }
    }
    else {
        if(document.querySelectorAll(`.${generateClass(document.querySelector(".active_date"))}`).length == 0) {
            document.querySelector(".active_date").style.color = "white";
        }
    }
})

let markFlag = 0;

markEvent.addEventListener("click", () => {
    if(markedEvent) {
        if(markFlag) {
            document.querySelector(".marked_event").style.textDecoration = "none";
            markFlag = 0;
        }
        else {
            document.querySelector(".marked_event").style.textDecoration = "line-through";
            markFlag = 1;
        }
    }
})

function generateClass(markedDate) {
    if(markedDate) {
        if(markedDate.classList.contains("previous_month")) {
            if(currentMonth == 0) {
                return('e' + markedDate.innerHTML + String(11) + String(currentYear - 1));
            }
            else {
                return('e' + markedDate.innerHTML + String(currentMonth - 1) + String(currentYear));
            }
        }
        else if(markedDate.classList.contains("next_month")) {
            if(currentMonth == 11) {
                return('e' + markedDate.innerHTML + String(0) + String(currentYear + 1));
            }
            else {
                return('e' + markedDate.innerHTML + String(currentMonth + 1) + String(currentYear));
            }
        }
        else {
            return('e' + markedDate.innerHTML + String(currentMonth) + String(currentYear));
        }
    }
    else {
        return('e' + String(currentDate) + String(currentMonth) + String(currentYear));
    }
}