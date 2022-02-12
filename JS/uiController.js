import { amounts, chartElements, getMonthlyData } from "./store.js";
import { chartDisplay } from "./script.js";
import {
  dataTableBody,
  totalIncome,
  totalExpense,
  totalBanner,
  editItemForm,
  alerts,
} from "./uiElements.js";
export default function render() {
  dataTableBody.innerHTML = "";
  let MonthlyLimitExceeded = amounts.isMonthlyLimitExceeded()[0];
  let DailyLimitExceeded = amounts.isDailyLimitExceeded()[0];

  // console.log(MonthlyLimitExceeded, DailyLimitExceeded);

  if (MonthlyLimitExceeded) {
    let alertBadge = document.createElement("div");
    alertBadge.classList.add("alert", "alert-danger");
    alertBadge.innerText = `Monthly limit exceeded by Nrs. ${
      amounts.isMonthlyLimitExceeded()[1]
    }`;
    alerts.appendChild(alertBadge);
  }
  if (DailyLimitExceeded) {
    let alertBadge = document.createElement("div");
    alertBadge.classList.add("alert", "alert-danger");
    alertBadge.innerText = `Daily limit exceeded by Nrs. ${
      amounts.isDailyLimitExceeded()[1]
    }`;
    alerts.appendChild(alertBadge);
  }
  if (!MonthlyLimitExceeded && !DailyLimitExceeded) {
    let alertBadge = document.createElement("div");
    alertBadge.classList.add("alert", "alert-success");
    alertBadge.innerText = `No Limit Exceeded`;
    alerts.appendChild(alertBadge);
  }
  amounts.getData().forEach((amount) => {
    dataTableBody.appendChild(amount.getTableRow());
  });
  totalIncome.innerText = `Nrs. ${amounts.getTotalIncome()}`;
  totalExpense.innerText = `Nrs. ${amounts.getTotalExpense()}`;
  totalBanner.innerText = `Nrs. ${amounts.getTotal()}`;

  let monthArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  let expensedata = monthArray.map((month) => getMonthlyData(month, "expense"));
  let incomedata = monthArray.map((month) => getMonthlyData(month, "income"));
  chartDisplay.data.datasets = [
    {
      label: "Expense",
      backgroundColor: "rgb(255, 0, 0)",
      borderColor: "rgb(255, 0, 0)",
      data: expensedata,
    },
    {
      label: "Income",
      backgroundColor: "rgb(0, 255, 0)",
      borderColor: "rgb(0, 255, 0)",
      data: incomedata,
    },
  ];
  chartDisplay.update();
}

export function initializeEditForm(id) {
  $("#edit_modal_id").modal("toggle");
  let amount = amounts.data.find((value) => {
    return value.id == id;
  });
  editItemForm.elements.amount.value = amount.amount;
  editItemForm.elements.edit_amount_id.value = amount.id;
  editItemForm.elements.amount_type.value = amount.type;
  editItemForm.elements.amount_description.value = amount.description;
  editItemForm.elements.amount_category.value = amount.category;
  let month = amount.date.getMonth() + 1;
  let date = amount.date.getDate(); //Gives Day of that month
  editItemForm.elements.amount_date.value = `${amount.date.getFullYear()}-${
    month < 10 ? "0" + month : month
  }-${date < 10 ? "0" + date : date}`;
}
