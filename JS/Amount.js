//
import { deleteAmount, editAmount } from "./store.js";
import { initializeEditForm } from "./uiController.js";
export default class Amount {
  constructor(amount, type, category, date, description, id) {
    this.amount = parseInt(amount);
    this.type = type;
    this.category = category;
    this.date = new Date(date);
    this.description = description;
    this.id = id;
  }
  getTableRow() {
    let tableRow = document.createElement("tr");
    tableRow.classList.add(["text-light", "text-xl"]);
    if (this.type === "income") {
      tableRow.classList.add("bg-success");
    } else {
      tableRow.classList.add("bg-danger");
    }
    tableRow.innerHTML = `
      <td scope="row">${this.id}.</td>
      <td>${this.description}</td>
      <td>${this.category}</td>
      <td>${this.date.toDateString()}</td>
      <td>Nrs ${this.amount}</td>
       `;

    let tableDataEdit = document.createElement("td");
    let editButton = document.createElement("button");
    editButton.classList.add("btn", "btn-outline-primary");
    editButton.innerText = "Edit";
    tableDataEdit.appendChild(editButton);
    tableRow.appendChild(tableDataEdit);
    editButton.addEventListener("click", () => {
      initializeEditForm(this.id);
    });
    let deleteButton = document.createElement("button");
    let tableData = document.createElement("td");
    deleteButton.classList.add("btn", "btn-outline-light");
    deleteButton.innerText = "Delete";
    deleteButton.addEventListener("click", () => {
      deleteAmount(this.id);
    });
    tableData.appendChild(deleteButton);
    tableRow.appendChild(tableData);
    return tableRow;
  }
}
/**
* 
* Only for reference to write above getTableRow() blocks code
<tr class="bg-success text-light text-xl">
    <td scope="row">1.</td>
    <td>This is a description</td>
    <td>2019 February 3</td>
    <td>Something</td>
    <td>Nrs 5000</td>
    <td><button type="button" class="btn btn-outline-light">Delete</button></td>
</tr>                           
* 
*/
