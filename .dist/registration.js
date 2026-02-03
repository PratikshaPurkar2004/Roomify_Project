document.addEventListener("DOMContentLoaded", function () {

    const nameInput = document.querySelector('.row input[type="text"]');
    const selects = document.querySelectorAll('.row select');
    const roleSelect = selects[0];
    const citySelect = selects[1];
    const genderButtons = document.querySelectorAll('.gender-btns button');
    const uploadBox = document.querySelector('.upload-box');
    const avatars = document.querySelectorAll('.avatar');
    const registerBtn = document.querySelector('.register');

    let selectedGender = "";
    let selectedImage = "";

    genderButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            genderButtons.forEach(b => {
                b.style.background = "#fff";
                b.style.color = "#000";
            });
            btn.style.background = "green";
            btn.style.color = "#fff";
            selectedGender = btn.innerText;
        });
    });

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/png, image/jpeg";
    fileInput.style.display = "none";
    document.body.appendChild(fileInput);

    uploadBox.addEventListener("click", () => {
        fileInput.click();
    });

    fileInput.addEventListener("change", () => {
        const file = fileInput.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            uploadBox.innerHTML = `<img src="${reader.result}" width="70" style="border-radius:50%">`;
            selectedImage = "uploaded";
        };
        reader.readAsDataURL(file);
    });

    avatars.forEach((avatar, index) => {
        avatar.addEventListener("click", () => {
            avatars.forEach(a => a.style.border = "none");
            avatar.style.border = "2px solid green";
            selectedImage = "avatar_" + index;
        });
    });

    registerBtn.addEventListener("click", () => {
        if (nameInput.value.trim() === "") {
            alert("Please enter your name");
            return;
        }

        if (roleSelect.selectedIndex === 0) {
            alert("Please select role");
            return;
        }

        if (selectedGender === "") {
            alert("Please select gender");
            return;
        }

        if (citySelect.selectedIndex === 0) {
            alert("Please select city");
            return;
        }

        if (selectedImage === "") {
            alert("Please upload image or select avatar");
            return;
        }

        alert("Registration Successful ✅");
    });

});
