const table = this.document.querySelector("#passwordsHistoryContent");

window.addEventListener("load", function () {
    if (localStorage.getItem("passwordsHistory") !== null) {
        loadPasswords();
    }
});

function loadPasswords() {
    table.innerHTML = "<tr><th>Пароль</th><th>Описание</th></tr>";
    const passwords = JSON.parse(localStorage.getItem("passwordsHistory"));
    passwords.forEach((password, index) => {
        table.innerHTML += `<tr><td>${password.password}</td><td>${
            password.hint.length > 0
                ? password.hint
                : `<button class='hint' id='${index}'>Добавить описание</button>`
        }</td></tr>`;
    });
    //Обработка ситуации, когда пользователь хочет добавить описание к паролю
    const hintsBtns = document.querySelectorAll(".hint");
    hintsBtns.forEach((hintBtn) => {
        hintBtn.addEventListener("click", function (e) {
            let passwords = JSON.parse(
                localStorage.getItem("passwordsHistory")
            );
            const hintPhrase = window.prompt(
                "Введите описание для данного пароля"
            );
            if (hintPhrase === null) {
                passwords[e.target.id].hint = "";
            } else {
                passwords[e.target.id].hint = hintPhrase;
            }
            localStorage.setItem("passwordsHistory", JSON.stringify(passwords));
            loadPasswords();
        });
    });
}

//Обработка нажатия по иконке "Удалить всю историю паролей"
const deleteHistoryIcon = document.querySelector("#trashCanImg");
deleteHistoryIcon.addEventListener("click", function () {
    if (window.confirm("Вы точно хотите очистить всю историю паролей?")) {
        localStorage.setItem("passwordsHistory", JSON.stringify([]));
        loadPasswords();
    }
});
