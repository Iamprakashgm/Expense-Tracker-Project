import Amount from "./Amount.js";
import render from "./uiController.js";
import { editModal } from "./uiElements.js";
export const amounts = {
  data: [],
  filters: {
    from: null,
    to: null,
    type: null,
    category: null,
    search: null,
  },
  limits: {
    dailyLimit: 5000,
    monthlyLimit: 10000,
  },
  getData() {
    let finalData = this.data;
    if (this.filters.from) {
      finalData = finalData.filter((value) => {
        return value.date.getTime() >= this.filters.from.getTime();
      });
    }
    if (this.filters.to) {
      finalData = finalData.filter((value) => {
        return value.date.getTime() <= this.filters.to.getTime();
      });
    }
    if (this.filters.type) {
      finalData = finalData.filter((value) => {
        return value.type == this.filters.type;
      });
    }
    if (this.filters.category) {
      finalData = finalData.filter((value) => {
        return value.category == this.filters.category;
      });
    }
    if (this.filters.search) {
      finalData = finalData.filter((value) => {
        let description = value.description.toLowerCase();
        return description.includes(this.filters.search.toLowerCase());
      });
    }
    return finalData;
  },
  getTotalIncome() {
    let incomeData = this.getData().filter((value) => {
      return value.type === "income";
    });
    let totalIncome = 0;
    incomeData.forEach((income) => {
      totalIncome += income.amount;
    });
    return totalIncome;
  },
  getTotalExpense() {
    let expenseData = this.getData().filter((value) => {
      return value.type !== "income";
    });
    let totalExpense = 0;
    expenseData.forEach((expense) => {
      totalExpense += expense.amount;
    });
    return totalExpense;
  },
  getTotal() {
    return this.getTotalIncome() - this.getTotalExpense();
  },
  isDailyLimitExceeded() {
    let currentDay = new Date();
    let currentDate = currentDay.getDate();
    let curretMonth = currentDay.getMonth();
    let currentYear = currentDay.getFullYear();
    let todaysDate = new Date(
      `${currentYear}-${curretMonth + 1}-${currentDate}`
    );
    let data = this.data.filter((value) => {
      return value.date.getTime() >= todaysDate.getTime();
    });
    let expenseData = this.data.filter((value) => {
      return value.type !== "income";
    });
    let totalExpense = 0;
    expenseData.forEach((expense) => {
      totalExpense += expense.amount;
    });
    // console.log(totalExpense > this.limits.dailyLimit);
    return [
      totalExpense > this.limits.dailyLimit,
      totalExpense - this.limits.dailyLimit,
    ];
  },
  isMonthlyLimitExceeded() {
    let currentDay = new Date();
    let curretMonth = currentDay.getMonth();
    let currentYear = currentDay.getFullYear();
    let oneMonthBeforeDate = new Date(`${currentYear}-${curretMonth + 1}-01`);
    let data = this.data.filter((value) => {
      return value.date.getTime() >= oneMonthBeforeDate.getTime();
    });
    let expenseData = this.data.filter((value) => {
      return value.type !== "income";
    });
    let totalExpense = 0;
    expenseData.forEach((expense) => {
      totalExpense += expense.amount;
    });
    return [
      totalExpense > this.limits.monthlyLimit,
      totalExpense - this.limits.monthlyLimit,
    ];
  },
};

export function getNewId() {
  // let lastId = parseInt(localStorage.lastId) || 0;
  let lastId = 0;
  if (localStorage.lastId) {
    lastId = parseInt(localStorage.lastId);
  }
  lastId++;
  localStorage.lastId = lastId;
  return lastId;
}

export function addAmount(amountData) {
  amounts.data.push(amountData);
  localStorage.amounts = JSON.stringify(amounts.data);
}

export function initializeStore() {
  let data = [];
  if (localStorage.amounts) {
    data = JSON.parse(localStorage.amounts);
  }
  if (localStorage.limits) {
    amounts.limits = JSON.parse(localStorage.limits);
  }
  data.forEach((element) => {
    let { amount, type, category, date, description, id } = element;
    amounts.data.push(
      new Amount(amount, type, category, date, description, id)
    );
  });
}

export function deleteAmount(id) {
  amounts.data = amounts.data.filter((value) => {
    return value.id !== id;
  });
  localStorage.amounts = JSON.stringify(amounts.data);
  render();
}

export function editAmount(id, amount, type, category, date, description) {
  let index = amounts.data.findIndex((value) => {
    return value.id == id;
  });
  if (index !== -1) {
    amounts.data[index].amount = amount;
    amounts.data[index].type = type;
    amounts.data[index].category = category;
    amounts.data[index].date = new Date(date);
    amounts.data[index].description = description;
  }
  localStorage.amounts = JSON.stringify(amounts.data);
  render();
}

export function applyFiltrs(from, to, type, category, search) {
  if (from) {
    amounts.filters.from = new Date(from);
  }
  if (to) {
    amounts.filters.to = new Date(to);
  }
  amounts.filters.type = type;
  amounts.filters.category = category;
  amounts.filters.search = search;
  render();
}

export function removeFilters() {
  amounts.filters = {
    from: null,
    to: null,
    type: null,
    category: null,
    search: null,
  };
  render();
}

export function setLimit(dailyLimit, monthlyLimit) {
  amounts.limits.dailyLimit = dailyLimit;
  amounts.limits.monthlyLimit = monthlyLimit;
  localStorage.limits = JSON.stringify(amounts.limits);
}

export function getMonthlyData(month, type) {
  let currentYear = new Date().getFullYear();
  let monthStart = new Date(`${currentYear}-${month}-01`);
  let monthEnd = new Date(`${currentYear}-${month + 1}-01`);
  let data = amounts.data.filter((value) => {
    return (
      value.date.getTime() >= monthStart.getTime() &&
      value.date.getTime() < monthEnd.getTime()
    );
  });
  data = data.filter((value) => {
    return value.type == type;
  });
  let total = 0;
  data.forEach((income) => {
    total += income.amount;
  });
  return total;
}
export function chartElements() {
  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "November",
    "December",
  ];

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Expense",
        backgroundColor: "rgb(255, 0, 0)",
        borderColor: "rgb(255, 0, 0)",
        data: [25, 10, 5, 2, 20, 30, 45, 10, 5, 2, 20, 30],
      },
      {
        label: "Income",
        backgroundColor: "rgb(0, 255, 0)",
        borderColor: "rgb(0, 255, 0)",
        data: [20, 10, 25, 2, 30, 15, 35, 10, 25, 2, 30],
      },
    ],
  };
  const config = {
    type: "bar",
    data: data,
    options: {},
  };
  return config;
}
