const bookmarkNameInput = document.getElementById("bookmarkName");
const bookmarkUrlInput = document.getElementById("bookmarkURL");
const addBookmarkBtn = document.getElementById("addBookmarkBtn");
const updateBookmarkBtn = document.getElementById("updateBookmarkBtn");

var bookmarksList = [];
var updatedIndex;
if (localStorage.getItem("bookmarks")) {
  bookmarksList = JSON.parse(localStorage.getItem("bookmarks"));
  displayBookmarks();
}

function addBookmark() {
  if (validateInputs(bookmarkNameInput) && validateInputs(bookmarkUrlInput)) {
    const bookmark = {
      name: bookmarkNameInput.value,
      url: bookmarkUrlInput.value,
    };
    if (bookmarksList.find((b) => b.name === bookmark.name)) {
      displayErrorMessage("duplication");
      return;
    } else {
      bookmarksList.push(bookmark);
      localStorage.setItem("bookmarks", JSON.stringify(bookmarksList));
      displayBookmarks();
      clearInputs();
    }
  } else {
    displayErrorMessage("Validation");
  }
}

function editBookmark(index) {
  updatedIndex = index;
  bookmarkNameInput.value = bookmarksList[index].name;
  bookmarkUrlInput.value = bookmarksList[index].url;
  addBookmarkBtn.classList.add("d-none");
  updateBookmarkBtn.classList.remove("d-none");
}

function updateBookmark() {
  if (validateInputs(bookmarkNameInput) && validateInputs(bookmarkUrlInput)) {
    const bookmark = {
      name: bookmarkNameInput.value,
      url: bookmarkUrlInput.value,
    };
    bookmarksList[updatedIndex] = bookmark;
    addBookmarkBtn.classList.remove("d-none");
    updateBookmarkBtn.classList.add("d-none");
    bookmarkNameInput.classList.remove("is-valid", "is-invalid");
    localStorage.setItem("bookmarks", JSON.stringify(bookmarksList));
    displayBookmarks();
    clearInputs();
  } else {
    displayErrorMessage("Validation");
  }
}

function deleteBookmark(index) {
  bookmarksList.splice(index, 1);
  localStorage.setItem("bookmarks", JSON.stringify(bookmarksList));
  displayBookmarks();
}

function clearInputs() {
  bookmarkNameInput.value = "";
  bookmarkUrlInput.value = "";
  bookmarkNameInput.classList.remove("is-valid", "is-invalid");
  bookmarkUrlInput.classList.remove("is-valid", "is-invalid");
}

function displayBookmarks() {
  var BlackBox = ``;
  for (let i = 0; i < bookmarksList.length; i++) {
    BlackBox += `<tr class="align-middle">
                <td>${i + 1}</td>
                <td>${bookmarksList[i].name}</td>
                <td><a href="${
                  bookmarksList[i].url
                }" target="_blank" class="btn btn-visit"><i class="fa-solid fa-eye"></i> Visit</a></td>
                <td><button onclick="editBookmark(${i})" class="btn btn-edit"><i class="fa-solid fa-pen-to-square"></i> Edit</button></td>
                <td><button onclick="deleteBookmark(${i})" class="btn btn-delete"><i class="fa-solid fa-trash-can"></i> Delete</button></td>
              </tr>`;
  }
  document.getElementById("bookmarkTableBody").innerHTML = BlackBox;
}

function validateInputs(input) {
  var regex = {
    bookmarkName: /^[a-zA-Z0-9]{3,15}$/,
    bookmarkURL:
      /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)$/,
  };
  var isValid = regex[input.id].test(input.value);
  if (isValid) {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
  } else {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
  }
  return isValid;
}

function displayErrorMessage(type) {
  if (type === "duplication") {
    var errorMessage = `<h2 class="fs-5">Bookmark with this name already exists.</h2>`;
  } else {
    var errorMessage = `<h2 class="fs-5">Site Name or Url is not valid, Please follow the rules below :</h2>
                <ul class="list-unstyled mt-3 d-flex flex-column gap-2 ms-2">
                  <li><i class="fa-regular fa-circle-right text-danger me-2"></i> Site name must contain at least 3 characters</li>
                  <li><i class="fa-regular fa-circle-right text-danger me-2"></i> Site URL must be a valid one</li>
                </ul>`;
  }
  var BlackBox = `<div
          class="modal fade"
          id="errorModal"
          tabindex="-1"
          aria-labelledby="errorModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header p-4 pb-2">
                <div class="dots d-flex align-items-center gap-2">
                  <div class="bg-opacity-75 bg-danger rounded-circle"></div>
                  <div class="bg-opacity-75 bg-warning rounded-circle"></div>
                  <div class="bg-opacity-75 bg-success rounded-circle"></div>
                </div>
                <button
                  type="button"
                  class="btn text-black fs-4 ms-auto py-0"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ><i class="fa-solid fa-xmark"></i>
                </button>
              </div>
              <div class="modal-body p-4">
                ${errorMessage}
              </div>
            </div>
          </div>
        </div>`;
  document.getElementById("modal").innerHTML = BlackBox;
  var errorModal = new bootstrap.Modal(document.getElementById("errorModal"));
  errorModal.show();
}
