let statusSquares = JSON.parse(localStorage.getItem("todo_squares_data")) || [];
let activeSquareIndex = statusSquares.length > 0 ? 0 : null;

let modalMode = "add"; 

function saveToLocalStorage() {
    localStorage.setItem("todo_squares_data", JSON.stringify(statusSquares));
}

// --- РОЗУМНА ЛОГІКА ОНОНОВЛЕННЯ РЯДКІВ (ЗАВЖДИ МІНІМУМ 11) ---

document.querySelector(".add-button").onclick = function() {
    if (activeSquareIndex === null) {
        alert("Спочатку додайте хоча б один статус (прозорий квадрат із плюсом зліва)!");
        return;
    }

    let text = document.querySelector(".text-zone").value;

    if (text != "") {
        statusSquares[activeSquareIndex].tasks.push(text);
        document.querySelector(".text-zone").value = "";

        saveToLocalStorage();
        renderCards();
    }
};

function renderCards() {
    const cardsContainer = document.getElementById("cardsList");
    cardsContainer.innerHTML = ""; // Повністю очищуємо робочу зону

    // Отримуємо масив завдань для поточної активної вкладки (якщо вона є)
    let currentTasks = (activeSquareIndex !== null) ? statusSquares[activeSquareIndex].tasks : [];

    // 1. Спочатку виводимо всі реальні завдання, які існують у масиві
    currentTasks.forEach((taskText, index) => {
        const card = document.createElement("div");
        card.className = "todo-card";
        card.innerHTML = `
            <div class="card-text">${taskText}</div>
            <button class="delete-btn" onclick="deleteTask(${index})">✕</button>
        `;
        cardsContainer.appendChild(card);
    });

    // 2. Рахуємо, скільки порожніх рядків потрібно відобразити, щоб сумарно ЗАВЖДИ було мінімум 11
    let emptyRowsCount = 11 - currentTasks.length;

    // Якщо порожні рядки потрібні, циклом створюємо їх на екрані
    if (emptyRowsCount > 0) {
        for (let i = 0; i < emptyRowsCount; i++) {
            const emptyCard = document.createElement("div");
            emptyCard.className = "todo-card empty"; // Клас без хрестика видалення
            emptyCard.innerHTML = `<div class="card-text"></div>`; // Просто порожній сірий рядок
            cardsContainer.appendChild(emptyCard);
        }
    }
}

function deleteTask(i) {
    if (activeSquareIndex !== null) {
        statusSquares[activeSquareIndex].tasks.splice(i, 1);
        saveToLocalStorage();
        renderCards();
    }
}

document.querySelector(".text-zone").addEventListener("keypress", function(e) {
    if (e.key === "Enter" && this.value !== "") {
        document.querySelector(".add-button").click();
    }
});


// ======================================================== 
// КЕРУВАННЯ МЕНЮ СТАТУСІВ
// ======================================================== 

function openAddMenu() {
    modalMode = "add";
    document.getElementById("modalTitle").innerText = "Оберіть статус завдання:";
    document.getElementById("deleteTabBtn").style.display = "none";
    document.getElementById("statusModal").style.display = "flex";
}

function openEditMenu() {
    modalMode = "edit";
    document.getElementById("modalTitle").innerText = "Редагувати статус або колір:";
    document.getElementById("deleteTabBtn").style.display = "block";
    document.getElementById("statusModal").style.display = "flex";
}

function closeStatusMenu() {
    document.getElementById("statusModal").style.display = "none";
}

function addSquareByStatus(colorHex) {
    if (modalMode === "add") {
        if (statusSquares.length >= 8) return;
        
        statusSquares.push({
            color: colorHex,
            tasks: []
        });
        activeSquareIndex = statusSquares.length - 1;
    } else if (modalMode === "edit") {
        if (activeSquareIndex !== null) {
            statusSquares[activeSquareIndex].color = colorHex;
        }
    }
    
    closeStatusMenu();
    saveToLocalStorage();
    renderSquares();
    renderCards();
}

function removeSquare() {
    if (activeSquareIndex !== null) {
        statusSquares.splice(activeSquareIndex, 1);
        
        if (statusSquares.length === 0) {
            activeSquareIndex = null;
        } else if (activeSquareIndex >= statusSquares.length) {
            activeSquareIndex = statusSquares.length - 1;
        }
        
        closeStatusMenu();
        saveToLocalStorage();
        renderSquares();
        renderCards();
    }
}

function renderSquares() {
    const container = document.getElementById("squaresContainer");
    container.innerHTML = ""; 
    
    statusSquares.forEach((squareData, index) => {
        const square = document.createElement("div");
        square.className = "status-square";
        square.style.backgroundColor = squareData.color;
        
        if (index === activeSquareIndex) {
            square.classList.add("active");
        }
        
        square.onclick = function() {
            if (activeSquareIndex === index) {
                openEditMenu();
            } else {
                activeSquareIndex = index;
                renderSquares();
                renderCards();
            }
        };
        
        container.appendChild(square);
    });
    
    if (statusSquares.length < 8) {
        const plusBtn = document.createElement("button");
        plusBtn.className = "square-plus-btn";
        plusBtn.innerText = "+";
        plusBtn.onclick = openAddMenu;
        
        container.appendChild(plusBtn);
    }
}

renderSquares();
renderCards();
