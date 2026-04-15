import { useState, useEffect } from "react";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const budgetLimit = 5000;

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await fetch("http://localhost:3000/expenses");
      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const addExpense = async () => {
    const name = expenseName.trim();
    const amount = parseFloat(expenseAmount);

    if (name === "") {
      alert("Please enter a valid expense name");
      return;
    }

    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    if (expenseDate === "") {
      alert("Please select a date");
      return;
    }

    const newExpense = {
      name: name,
      amount: amount,
      date: expenseDate,
    };

    try {
      const response = await fetch("http://localhost:3000/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newExpense),
      });

      if (!response.ok) {
        throw new Error("Failed to add expense");
      }

      await fetchExpenses();
      setExpenseName("");
      setExpenseAmount("");
      setExpenseDate("");
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  const deleteExpense = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/expenses/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete expense");
      }

      await fetchExpenses();
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const filteredExpenses = selectedMonth
    ? expenses.filter((expense) => expense.date.startsWith(selectedMonth))
    : expenses;

  let total = 0;
  for (let i = 0; i < filteredExpenses.length; i++) {
    total = total + filteredExpenses[i].amount;
  }

  let highestAmt = 0;
  for (let i = 0; i < filteredExpenses.length; i++) {
    if (filteredExpenses[i].amount > highestAmt) {
      highestAmt = filteredExpenses[i].amount;
    }
  }

  return (
    <div className="container">
      <h2>PERSONAL EXPENSE TRACKER</h2>

      <div className="formbox">
        <label>Expense Name:</label>
        <input
          type="text"
          placeholder="Enter expense name"
          value={expenseName}
          onChange={(e) => setExpenseName(e.target.value)}
        />

        <label>Amount:</label>
        <input
          type="number"
          placeholder="Enter expense amount"
          value={expenseAmount}
          onChange={(e) => setExpenseAmount(e.target.value)}
        />

        <label>Date:</label>
        <input
          type="date"
          value={expenseDate}
          onChange={(e) => setExpenseDate(e.target.value)}
        />

        <button onClick={addExpense}>Add Expense</button>
      </div>

      <div className="month-filter">
        <label>Select Month:</label>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>Expense Name</th>
            <th>Expense Amount</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredExpenses.map((expense) => (
            <tr
              key={expense._id}
              className={expense.amount === highestAmt ? "highest-row" : "normal-row"}
            >
              <td>{expense.name}</td>
              <td>₹{expense.amount}</td>
              <td>{expense.date}</td>
              <td>
                <button onClick={() => deleteExpense(expense._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p id="totaldisplay">Total Spending: ₹{total}</p>

      <p id="warningmessage">
        {total > budgetLimit ? "Warning: Budget exceeded!" : ""}
      </p>
    </div>
  );
}

export default App;