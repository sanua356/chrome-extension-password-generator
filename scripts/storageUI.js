const table = document.querySelector("#passwordsHistoryContent");

window.addEventListener("load", async function () {
    if ((await getStorageValue("passwordsHistory")) !== null) {
        loadPasswords();
    }
});

async function loadPasswords() {
    const passwords = JSON.parse(await getStorageValue("passwordsHistory"));
    const secretKey = await getStorageValue("secretKey");
    if (passwords.length > 0) {
        table.innerHTML = `
            <div class="passwordsHistoryTable-item passwordsHistoryTable-title">
                <p>Пароль</p>
                <p>Описание</p>
            </div>`;

        passwords.forEach(({ password, hint }, index) => {
            table.innerHTML += `
        <div class="passwordsHistoryTable-item 
        ${index % 2 === 0 ? "gray-item" : ""}">
        <p>${decryptString(password, secretKey)}</p>
            <p>${
                hint.length > 0
                    ? `${hint} <img src="./images/cancelation.png" class="deletePasswordBtn" />`
                    : `<img src="./images/contract.png" class="addHintPasswordBtn" id='${index}' />
                        <img src="./images/cancelation.png" class="deletePasswordBtn" id='${index}' />
            </p>
        </div>`
            }`;
        });
    } else {
        table.innerHTML = `
            <div class="passwordsHistoryTable-noPasswords">
                <img src="./images/nopasswords.png" />
                <span>Вы не сгенерировали ещё ни одного пароля</span>
            </div>`;
    }
}

//Обработка ситуации, когда пользователь хочет добавить описание к паролю
const hintsBtns = document.querySelector("#passwordsHistoryContent");
hintsBtns.addEventListener("click", async function (e) {
    if (e.srcElement.classList.contains("addHintPasswordBtn")) {
        inputValueModal("Введите описание для пароля", async function (value) {
            let passwords = JSON.parse(
                await getStorageValue("passwordsHistory")
            );
            passwords[e.srcElement.id].hint = value || "";
            setStorageValue({
                passwordsHistory: JSON.stringify(passwords),
            }).then(loadPasswords);
        });
    } else if (e.srcElement.classList.contains("deletePasswordBtn")) {
        let passwords = JSON.parse(await getStorageValue("passwordsHistory"));
        passwords.splice(e.srcElement.id, 1);
        setStorageValue({
            passwordsHistory: JSON.stringify(passwords),
        });
        hintsBtns.removeChild(hintsBtns.children[+e.srcElement.id + 1]);
        reloadIDsList();
    }
});

//Перезагрузка всех ID после удаления пароля в середине или начале списка
function reloadIDsList() {
    const deleteBtns = document.querySelectorAll(".deletePasswordBtn"),
        addHintBtns = document.querySelectorAll(".addHintPasswordBtn");
    if (addHintBtns.length > 0) {
        for (let i = 0; i < deleteBtns.length; i++) {
            deleteBtns[i].id = i;
            addHintBtns[i].id = i;
        }
    } else {
        table.innerHTML = `
            <div class="passwordsHistoryTable-noPasswords">
                <img src="./images/nopasswords.png" />
                <span>Вы не сгенерировали ещё ни одного пароля</span>
            </div>`;
    }
}

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
