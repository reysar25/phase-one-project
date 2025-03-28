//          DOM
const enter = document.getElementById("enter");
const nameover = document.getElementById("nameoverhere");
const artPrice = document.getElementById("artPrice");

//          server
const server = "http://localhost:3000";

//          turn on the uploadGUI and off
function toggleUploadGUI() {
    let uploadGUI = document.getElementById("uploadGUI");
    uploadGUI.style.display = (uploadGUI.style.display === "none" || uploadGUI.style.display === "") ? "block" : "none";
}

//          upload image func
function uploadImage(username) {
    const fileInput = document.getElementById("imageUpload");
    const titleInput = document.getElementById("artTitle").value;
    const descInput = document.getElementById("artDesc").value;
    const gallery = document.getElementById("gallery");
    const price = parseFloat(artPrice.value);

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = function(event) { 
            let newArt =  `
            <h2>${username || "Untitled user"}</h3>
            <h3>${titleInput || "Untitled Art"}</h3>
            
            <a href="${event.target.result}"><img src="${event.target.result}" alt="User Art"></a>
            <p>${descInput || "No description provided."}</p>
            <p style="color:green">${price || "No price provided."} USD</p>
        `
            

            let nart = {
                newArt: newArt,
            }

            
            fetch(`${server}/arts`, {
                method:"POST",
                headers: {"Content-Type":"application/json"},
                body:JSON.stringify(nart)
            })
        };

        reader.readAsDataURL(file);
        toggleUploadGUI(); 
    } else {
        alert("Please select an image to upload.");
    }
}

fetch(`${server}/arts`)
.then(J=>J.json())
.then(allarts=>{
    
    for (key of allarts) {
        
        const gallery = document.getElementById("gallery");
        const imgContainer = document.createElement("div");
        imgContainer.classList.add("art-item");
        imgContainer.innerHTML += key.newArt;
        
        gallery.prepend(imgContainer);
    }
})