let optionsContainer = document.querySelector(".options-cont");
let toolsContainer = document.querySelector(".tools-cont");
let pencilToolCont = document.querySelector(".pencil-tool-cont");
let eraserToolCont = document.querySelector(".eraser-tool-cont");
let pencil = document.querySelector(".pencil");
let eraser = document.querySelector(".eraser");
let stickyNotes = document.querySelector(".notes");
let upload = document.querySelector(".upload");
let toolsVisible = true;
let pencilToolVisible = false;
let eraserToolVisible = false;

optionsContainer.addEventListener("click", (event) => {
    let iconElement = optionsContainer.children[0];
    toolsVisible = !toolsVisible;
    if(toolsVisible) {
        openTools();
    }
    else {
        closeTools();
    }
})

function openTools() {
    let iconElement = optionsContainer.children[0];
    iconElement.classList.remove("fa-burger");
    iconElement.classList.add("fa-times");
    toolsContainer.style.display = "flex";
}

function closeTools() {
    let iconElement = optionsContainer.children[0];
    iconElement.classList.remove("fa-times");
    iconElement.classList.add("fa-burger");
    toolsContainer.style.display = "none";
    pencilToolCont.style.display = "none";
    eraserToolCont.style.display = "none";
}

pencil.addEventListener("click", (event) => {
    pencilToolVisible = !pencilToolVisible;
    if(pencilToolVisible) {
        pencilToolCont.style.display = "block";
    }
    else {
        pencilToolCont.style.display = "none";
    }
})

eraser.addEventListener("click", (event) => {
    eraserToolVisible = !eraserToolVisible;
    if(eraserToolVisible) {
        eraserToolCont.style.display = "flex";
    }
    else {
        eraserToolCont.style.display = "none";
    }
})

stickyNotes.addEventListener("click", (event) => {
    let innerHtml = `
        <div class="header-cont">
        <div class="minimize"></div>
        <div class="remove"></div>
        </div>
        <div class="note-cont">
            <textarea spellcheck="false"></textarea>
        </div>
    `;
    createSticky(innerHtml);
});

function dragAndDrop(container, event) {
    let shiftX = event.clientX - container.getBoundingClientRect().left;
    let shiftY = event.clientY - container.getBoundingClientRect().top;

    container.style.position = "absolute";
    container.style.zIndex = 1000;

    moveAt(event.pageX, event.pageY);

    function moveAt(pageX, pageY) {
        container.style.left = pageX - shiftX + 'px';
        container.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    document.addEventListener("mousemove", onMouseMove);

    container.onmouseup = function() {
        document.removeEventListener("mousemove", onMouseMove);
        container.onmouseup = null;
    }
}

function noteActions(minimize, remove, stickyContainer) {
    remove.addEventListener("click", (event) => {
        stickyContainer.remove();
    });

    minimize.addEventListener("click", (event) => {
        let noteContainer = stickyContainer.querySelector(".note-cont");
        let display = getComputedStyle(noteContainer).getPropertyValue("display");
        console.log(display);
        if(display == "none")   noteContainer.style.display = "block";
        else    noteContainer.style.display = "none";
    })
}

upload.addEventListener("click", (event) => {
    //take a file input from files
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click();

    //on selecting file
    input.addEventListener("change", (e) => {
        let file = input.files[0];
        let url = URL.createObjectURL(file);

        let stickyTemplateHTML = `
            <div class="header-cont">
            <div class="minimize"></div>
            <div class="remove"></div>
            </div>
            <div class="note-cont">
                <img src="${url}"/>
            </div>
        `;

        createSticky(stickyTemplateHTML);
    })
});

function createSticky(stickyTemplateHTML) {
    let stickyContainer = document.createElement("div");
    stickyContainer.setAttribute("class", "sticky-cont");
    stickyContainer.innerHTML = stickyTemplateHTML;
    document.body.appendChild(stickyContainer);

    stickyContainer.onmousedown = function (event) {
        dragAndDrop(stickyContainer, event);
    }

    stickyContainer.ondragstart = function() {
        return false;
    }
    let minimize = stickyContainer.querySelector(".minimize");
    let remove = stickyContainer.querySelector(".remove");
    noteActions(minimize, remove, stickyContainer);
};
