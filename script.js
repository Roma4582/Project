let tasks = [];


document.querySelector(".add-button").onclick = function() {
    let text = document.querySelector(".text-zone").value;


    if (text != "") {
        tasks.push(text);
        document.querySelector(".text-zone").value = "";


        for (let i = 0; i < 11; i++) {
            document.querySelector(".card" + (i + 1)).innerHTML = "";
        }


        for (let i = 0; i < tasks.length; i++) {
            document.querySelector(".card" + (i + 1)).innerHTML =
                tasks[i] + "<button onclick='deleteTask(" + i + ")'>✕</button>";
        }
    }
};


function deleteTask(i) {
    tasks.splice(i, 1);


    for (let i = 0; i < 11; i++) {
        document.querySelector(".card" + (i + 1)).innerHTML = "";
    }


    for (let i = 0; i < tasks.length; i++) {
        document.querySelector(".card" + (i + 1)).innerHTML =
            tasks[i] + "<button onclick='deleteTask(" + i + ")'>✕</button>";
    }
}
