const table = document.querySelector("#passwordsHistoryContent");

window.addEventListener("load", async function () {
    if ((await getStorageValue("passwordsHistory")) !== null) {
        loadPasswords();
    }
});

async function loadPasswords() {
    table.innerHTML = "<tr><th>Пароль</th><th>Описание</th></tr>";
    console.log(table);
    const passwords = JSON.parse(await getStorageValue("passwordsHistory"));
    passwords.forEach(({ password, hint }, index) => {
        table.innerHTML += `
        <tr><td>${password}</td><td>${
            hint.length > 0
                ? hint
                : `<button class='hint' id='${index}'>Добавить описание</button>`
        }</td></tr>`;
    });
}

//Обработка ситуации, когда пользователь хочет добавить описание к паролю
const hintsBtns = document.querySelector("#passwordsHistoryContent");
hintsBtns.addEventListener("click", function (e) {
    if (e.srcElement.nodeName === "BUTTON") {
        inputValueModal("Введите описание для пароля", async function (value) {
            let passwords = JSON.parse(
                await getStorageValue("passwordsHistory")
            );
            passwords[e.srcElement.id].hint = value || "";
            setStorageValue({
                passwordsHistory: JSON.stringify(passwords),
            }).then(loadPasswords);
        });
    }
});

//Обработка нажатия по иконке "Удалить всю историю паролей"
const deleteHistoryIcon = document.querySelector("#trashCanImg");
deleteHistoryIcon.addEventListener("click", function () {
    confirmActionModal(
        "Вы точно хотите очистить всю историю паролей?",
        function () {
            setStorageValue({ passwordsHistory: JSON.stringify([]) });
            loadPasswords();
        }
    );
});
