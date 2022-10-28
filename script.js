let table = document.querySelector("tbody");
let count = 0;
let today = new Date();
let data = [
  // {
  //   id: 0,
  //   name: "sp1",
  //   date: "2022-10-27",
  //   quantity: "2",
  //   color: "",
  // },
  // {
  //   id: 1,
  //   name: "sp2",
  //   date: "2022-10-29",
  //   quantity: "0",
  //   color: "",
  // },
  // {
  //   id: 2,
  //   name: "sp3",
  //   date: "2022-11-27",
  //   quantity: "2",
  //   color: "",
  // },
];
function generateDOM(data) {
  // console.log(data);
  table.innerHTML = `                    <tr>
  <th>id</th>
  <th>name</th>
  <th>date</th>
  <th>quantity</th>
  <th>action
      <!-- <div>
          <button class="update-btn">Update </button>
          <button class="del-btn">Delete</button>
      </div> -->
  </th>
</tr> `;
  for (let i in data) {
    var row = table.insertRow(-1);
    var cell0 = row.insertCell(0);
    var cell1 = row.insertCell(1);
    var cell2 = row.insertCell(2);
    var cell3 = row.insertCell(3);
    var cell4 = row.insertCell(4);
    cell0.style.background = `${data[i].color}`;
    cell1.style.background = `${data[i].color}`;
    cell2.style.background = `${data[i].color}`;
    cell3.style.background = `${data[i].color}`;
    cell4.style.background = `${data[i].color}`;
    cell0.innerHTML = `${data[i].id}`;
    cell1.innerHTML = `${data[i].name}`;
    cell2.innerHTML = `${data[i].date}`;
    cell3.innerHTML = `${data[i].quantity}`;
    cell4.innerHTML = `<div class ="action-cell">
        <button class="update-btn">Update</button>
        <button class="del-btn">Delete</button>
    </div>`;
  }
}

function saveToLocal(data) {
  localStorage.clear();
  for (let i in data) {
    // let id = String(data[i.id]);
    let key = `product${data[i].id}`;
    localStorage.setItem(key, JSON.stringify(data[i]));
  }
}

function checkEmpty(data) {
  if (data.length == 0) {
    document.querySelector(".msg").innerText = "There is no Data";
  } else {
    document.querySelector(".msg").innerText = "";
  }
}

function getData() {
  data = [];
  for (let key in localStorage) {
    if (key.includes("product")) {
      data.push(JSON.parse(localStorage.getItem(key)));
    }
  }
}
function loadData() {
  checkEmpty(data);
  for (let i in data) {
    // let id = String(data[i.id]);
    let key = `product${data[i].id}`;
    localStorage.setItem(key, JSON.stringify(data[i]));
  }
  getData();
  checkEmpty(data);
  saveToLocal(data);
  generateDOM(data);
  // let xhr = new XMLHttpRequest();
  // xhr.open("GET", "data.json", true);
  // xhr.onload = function () {
  //   if (this.status === 200) {
  //     console.log(this.responseText);
  //     try {
  //       data = JSON.parse(this.responseText);
  //     } catch (e) {
  //       table.append("there is no product");
  //       return;
  //     }
  //     generateDOM(data);
  //   }
  // };
  // xhr.send();
}

loadData();
$(".addBtn").click(() => {
  if (count != 0) {
    table.deleteRow(0);
    count = 0;
    return;
  }
  count = 1;
  var row = table.insertRow(0);
  var cell0 = row.insertCell(0);
  var cell1 = row.insertCell(1);
  var cell2 = row.insertCell(2);
  var cell3 = row.insertCell(3);
  var cell4 = row.insertCell(4);
  cell0.innerHTML = `<input class="id" type="number">`;
  cell1.innerHTML = `<input class="name" type="text">`;
  cell2.innerHTML = `<input class="date" type="date">`;
  cell3.innerHTML = `<input class="quantity" type="number">`;
  cell4.innerHTML = `<button class="add-btn">add</button>`;
});

$(document).on("click", ".add-btn", function () {
  count = 0;
  let id = $(".id").val();
  let name = $(".name").val();
  let date = $(".date").val();
  let quantity = $(".quantity").val();
  if (id === "" || name === "" || date === "" || quantity === "") {
    alert("data must not be blank");
  } else if (name.length < 6) {
    alert("name must have length bigger than 6");
  } else if (quantity < 0) {
    alert("quantity must be bigger than 0");
  } else {
    let addedProduct = {
      id: Number(id),
      name: name.trim(),
      date: date,
      quantity: quantity,
      color: "",
    };
    for (let i in data) {
      if (data[i].id === addedProduct.id) {
        alert("id must be unique");
        count = 0;
        return;
      }
    }
    data.push(addedProduct);
    saveToLocal(data);
    generateDOM(data);
    checkEmpty(data);
  }
});

$(document).on("click", ".sort-by-date", function () {
  data.sort(function (a, b) {
    // console.log(new Date(b.date) - new Date(a.date));
    // Turn your strings into dates, and then subtract them
    // to get a value that is either negative, positive, or zero.
    return new Date(a.date) - new Date(b.date);
  });
  generateDOM(data);
});

$(document).on("click", ".sort-by-name", function () {
  data.sort(function (a, b) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });
  generateDOM(data);
});

$(document).on("click", ".quantity-color", function () {
  for (let i in data) {
    data[i].color = "";
    if (data[i].quantity == 0) {
      data[i].color = "red";
    }
    if (data[i].quantity != 0) {
      data[i].color = "green";
    }
  }
  generateDOM(data);
});

$(document).on("click", ".date-color", function () {
  for (let i in data) {
    data[i].color = "";
    diffTime = Math.abs(new Date(data[i].date) - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 1) {
      data[i].color = "orange";
    }
  }
  generateDOM(data);
});

$(document).on("click", ".filter-finished ", function () {
  getData();
  let filteredData = data.filter((data) => {
    return new Date(data.date) < today;
  });
  data = filteredData;
  checkEmpty(data);
  generateDOM(data);
});
$(document).on("click", ".filter-unfinished ", function () {
  getData();
  let filtereddata = data.filter((data) => {
    return new Date(data.date) >= today;
  });
  data = filtereddata;
  checkEmpty(data);
  generateDOM(data);
});

$(document).on("click", ".show-all", function () {
  getData();
  checkEmpty(data);
  for (let i in data) {
    data[i].color = "";
  }
  generateDOM(data);
});

$(document).on("click", ".update-btn", function () {
  let updateId = $("td:first", $(this).parents("tr")).text();
  let check = true;
  let checkedData = data.filter((data) => {
    return data.id != updateId;
  });
  for (let i in data) {
    if (data[i].id == updateId) {
      $(".oldId").text(`${data[i].id}`);
      $(".oldName").text(`${data[i].name}`);
      $(".oldDate").text(`${data[i].date}`);
      $(".oldQuantity").text(`${data[i].quantity}`);
    }
  }
  $(".updateModal").css("display", "block");
  $(".close2").on("click", () => {
    $(".updateModal").css("display", "none");
  });
  $(".confirm-update").on("click", () => {
    let newId = parseInt($(".newId").val());
    let newName = $(".newName").val();
    let newDate = $(".newDate").val();
    let newQuantity = parseInt($(".newQuantity").val());
    // console.log(typeof newId);
    for (let i in checkedData) {
      if (newId == checkedData[i].id) {
        check = false;
      }
    }
    if (
      newId === "" ||
      newName === "" ||
      newDate === "" ||
      newQuantity === ""
    ) {
      alert("data must not be blank");
      return;
    } else if (newName.length < 6) {
      alert("name must have length bigger than 6");
      return;
    } else if (newQuantity < 0) {
      alert("quantity must be bigger than 0");
      return;
    } else if (check == false) {
      alert("New id must be unique");
      check = true;
      return;
    } else {
      for (let i in data) {
        if (data[i].id == updateId) {
          data[i].id = newId;
          data[i].name = newName;
          data[i].date = newDate;
          data[i].quantity = newQuantity;
          data[i].color = "";
        }
      }
    }
    saveToLocal(data);
    checkEmpty(data);
    generateDOM(data);
    $(".updateModal").css("display", "none");
  });
  // This will work!
});

$(document).on("click", ".del-btn", function () {
  let delId = $("td:first", $(this).parents("tr")).text();
  $(".delModal").css("display", "block");
  $(".close1").on("click", () => {
    $(".delModal").css("display", "none");
  });
  $(".confirm-del").on("click", () => {
    for (let i in data) {
      if (data[i].id == delId) {
        data.splice(i, 1);
      }
    }
    saveToLocal(data);
    checkEmpty(data);
    generateDOM(data);
    $(".delModal").css("display", "none");
  });
});
