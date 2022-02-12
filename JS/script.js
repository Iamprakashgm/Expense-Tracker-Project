import {
  editItemForm,
  addItemForm,
  filterForm,
  removeFiltersButton,
  limitsForm,
  monthlyChart,
} from "./uiElements.js";
import Amount from "./Amount.js";
import {
  amounts,
  getNewId,
  addAmount,
  initializeStore,
  editAmount,
  applyFiltrs,
  removeFilters,
  setLimit,
  chartElements,
  getMonthlyData,
} from "./store.js";
import render from "./uiController.js";
export const chartDisplay = new Chart(monthlyChart, chartElements());

initializeStore();

// let currentDay = new Date();
// let currentDate = currentDay.getDate();
// let curretMonth = currentDay.getMonth();
// let currentYear = currentDay.getFullYear();
// amountDateInput.setAttribute(
//   "max",
//   `${currentYear}-${(curretMonth + 1) < 10 ? "0" + curretMonth : curretMonth}-${currentDate < 10 ? "0" + currentDate : currentDate
//   }`
// );
limitsForm.elements.daily_limit.value = amounts.limits.dailyLimit;
limitsForm.elements.monthly_limit.value = amounts.limits.monthlyLimit;

render();
addItemForm.addEventListener("submit", function (event) {
  event.preventDefault();
  let {
    amount,
    amount_type: type,
    amount_category: category,
    amount_date: date,
    amount_description: description,
  } = addItemForm.elements;
  let amountData = new Amount(
    amount.value,
    type.value,
    category.value,
    date.value,
    description.value,
    getNewId()
  );
  addAmount(amountData);
  addItemForm.reset();
  render();
});

editItemForm.addEventListener("submit", function (event) {
  event.preventDefault();
  let {
    edit_amount_id,
    amount,
    amount_type,
    amount_category,
    amount_date,
    amount_description,
  } = editItemForm.elements;
  editAmount(
    edit_amount_id.value,
    amount.value,
    amount_type.value,
    amount_category.value,
    amount_date.value,
    amount_description.value
  );
});
filterForm.addEventListener("submit", function (event) {
  event.preventDefault();
  let {
    filter_date_from: from,
    filter_date_to: to,
    filter_type: type,
    filter_category: category,
    filter_search: search,
  } = filterForm.elements;
  applyFiltrs(
    from.value || null,
    to.value || null,
    type.value || null,
    category.value || null,
    search.value || null
  );
});
removeFiltersButton.addEventListener("click", function () {
  filterForm.reset();
  removeFilters();
});

limitsForm.addEventListener("submit", function (event) {
  event.preventDefault();
  setLimit(
    limitsForm.elements.daily_limit.value,
    limitsForm.elements.monthly_limit.value
  );
});
// console.log(getMonthlyData(1, "expense"));
