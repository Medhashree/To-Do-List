const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

let draggedItem = null;

//handle add button functionality
function addTask() {
    if (inputBox.value === "") {
        alert("Please write the title of your task to add it.");
    } else {
        //add the tasks as list element
        let li = document.createElement("li");
        li.innerHTML = inputBox.value;
        li.setAttribute("draggable", "true"); //draggable is set to true to enable drag and drop
        listContainer.appendChild(li);

        //add the delete button    
        let deleteButton = document.createElement("button");
        const deleteImg = document.createElement("img");
        deleteImg.src = "https://t4.ftcdn.net/jpg/03/46/38/39/360_F_346383913_JQecl2DhpHy2YakDz1t3h0Tk3Ov8hikq.jpg";
        deleteImg.className = "deleteButton";
        deleteButton.appendChild(deleteImg);
        li.appendChild(deleteButton);

        //add the edit button    
        let editButton = document.createElement("button");
        editButton.className = "editButton";
        const editImg = document.createElement("img");
        editImg.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQ3Enb_l0orCLYG-IXlSgLlkT5ojB_64dwCDktAzk&s";
        editButton.appendChild(editImg);
        li.appendChild(editButton);

        //add the save button
        let saveButton = document.createElement("button");
        saveButton.className = "saveButton";
        const saveImg = document.createElement("img");
        saveImg.src =
            "https://static.vecteezy.com/system/resources/previews/009/362/738/non_2x/tick-icon-accept-approve-sign-design-free-png.png";
        saveButton.appendChild(saveImg);
        li.appendChild(saveButton);

        //show delete all button  
        if (listContainer.children.length > 1) {
            document.querySelector(".deleteAllButton").style.display = "block";
        }
        saveTask();
    }
    inputBox.value = "";
}

listContainer.addEventListener("click", function (e) {
    // get the closest parent list item
    const li = e.target.closest("li");

    // Exit if the clicked element is not inside a list item
    if (!li) return;

    const editButton = li.querySelector(".editButton");
    const saveButton = li.querySelector(".saveButton");
    const deleteButton = li.querySelector(".deleteButton");

    // Check if the closest parent list item is an <li> element
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked"); // toggle check and uncheck
        if (li.classList.contains("checked")) {
            //Disable edit button
            editButton.disabled = true;
        } else {
            //Handle the case when the list item is not checked
            editButton.disabled = false;
        }
        saveTask();
    }

    //handle delete button functionality  
    if (e.target.className === "deleteButton") {
        li.remove();
        saveTask();
        //hide delete all button    
        if (listContainer.children.length < 2) {
            document.querySelector(".deleteAllButton").style.display = "none";
        }
    }
    //handle edit button functionality  
    if (e.target.tagName === "IMG" && e.target.parentElement.className === "editButton") {
        if (editButton.disabled) {
            // Prevent the default click behavior when the button is disabled      
            e.preventDefault();
            return;
        }
        // Replace the list item's content with an input element
        const listItemText = li.textContent.trim();
        const inputElement = document.createElement("input");
        inputElement.type = "text";
        inputElement.value = listItemText;

        //show save button and hide edit and delete buttons
        saveButton.style.display = "block";
        editButton.style.display = "none";
        deleteButton.style.display = "none";

        // Replace the list item with the input element
        li.innerHTML = ""; // Clear existing content
        li.appendChild(inputElement);
        li.appendChild(saveButton);
        li.appendChild(editButton);
        li.appendChild(deleteButton);

        // Focus on the input element so the user can start editing immediately
        inputElement.focus();
    }

    //handle save button functionality
    else if (
        e.target.tagName === "IMG" &&
        e.target.parentElement.className === "saveButton"
    ) {
        saveButton.style.display = "none";
        editButton.style.display = "block";
        deleteButton.style.display = "block";

        // Handle save button click
        const input = li.querySelector("input");
        const text = input.value;

        // Create a new span element to display the updated text
        const span = document.createElement("span");
        span.textContent = text;

        // Replace the input element with the new span element
        li.replaceChild(span, input);

        // Save the task after editing
        saveTask();
    }
});

//handle delete All button functionality
function deleteAllTask() {
    while (listContainer.firstChild) {
        listContainer.removeChild(listContainer.firstChild);
    }
    document.querySelector(".deleteAllButton").style.display = "none";
    // Save the empty list to localStorage
    saveTask();
}

//function to handle the dragStart event
function handleDragStart(event) {
    const targetElement = event.target;
    if (targetElement.tagName === "LI") {
        draggedItem = targetElement;
        event.dataTransfer.effectAllowed = "move";
    }
}

//function to handle the dragOver event
function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
}

//function to handle the drop event 
function handleDrop(event) {
    event.preventDefault();
    const targetItem = event.target;
    if (event.target.tagName === "LI" && draggedItem !== targetItem) {
        const targetIndex = Array.from(listContainer.children).indexOf(targetItem);
        const draggedIndex = Array.from(listContainer.children).indexOf(draggedItem);
        if (draggedIndex < targetIndex) {
            listContainer.insertBefore(draggedItem, targetItem.nextSibling);
        } else {
            listContainer.insertBefore(draggedItem, targetItem);
        }
    }
}

//add event listeners to enable drag and drop
listContainer.addEventListener("dragstart", handleDragStart);
listContainer.addEventListener("dragover", handleDragOver);
listContainer.addEventListener("drop", handleDrop);

//to save the data even after reloading the browser, we use localStorage
function saveTask() {
    localStorage.setItem("data", listContainer.innerHTML);
}
function showTask() {
    listContainer.innerHTML = localStorage.getItem("data");
    //show delete all button after page is refreshed  
    if (listContainer.children.length > 1) {
        document.querySelector(".deleteAllButton").style.display = "block";
    }
}
//calling getTask onLoad to display saved tasks
showTask();