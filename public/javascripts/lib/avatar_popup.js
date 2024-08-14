
function closePopupAWin() {
    document.querySelector("#popup_avatar").style.display = "none";
}
function closePopupEsc(event) {
    const popup = document.querySelector("#popup_avatar");
    if (event.key === "Escape") {
        closePopupAWin();
        popup.removeEventListener("keydown", closePopupEsc);
    }
}

function openPopupAWin() {
    const popup = document.querySelector("#popup_avatar");
    const popupWin = document.querySelector("#ava_content");
    popup.style.display = "block";
    popupWin.focus();
    popup.addEventListener("keydown", closePopupEsc);
}


function choosePic() {
    const avatarInput = document.querySelector('#avatar-input');
    avatarInput.click();
}
