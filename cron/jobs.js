const cron = require("node-cron");
const RecurringExpense = require("../models/RecurringExpenseModel");
const Expense = require("../models/expenseModel");

exports.startReccuringExpenseJob = () => {
  cron.schedule("50 23 * * *", async () => {
    const now = new Date();

    // Normalize today to 00:00:00
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    const dayOfMonth = today.getDate();
    const dayOfWeek = today.getDay();

    console.log("🕒 Running recurring expense job at", now.toLocaleString());

    try {
      const dueExpenses = await RecurringExpense.find({
        active: true,
        $or: [
          { frequency: "daily" },
          { frequency: "monthly", dayOfMonth },
          { frequency: "weekly", dayOfWeek },
        ],
      });

      for (let exp of dueExpenses) {
        const lastDate = exp.lastGeneratedDate;

        if (lastDate) {
          const last = new Date(lastDate);
          last.setHours(0, 0, 0, 0);

          if (last.getTime() === today.getTime()) {
            console.log(
              `🔁 Already generated for id: ${exp._id}, user: ${exp.user}`
            );
            continue;
          }
        }

        const expDoc = new Expense({
          name: exp.name,
          unitPrice: exp.unitPrice,
          quantity: exp.quantity,
          user: exp.user,
          date: now,
        });

        try {
          await expDoc.save();
          // Update lastGenerateDate
          exp.lastGeneratedDate = now;
          await exp.save();

          console.log(`✅ Created expense for user ${exp.user} (${exp.name})`);
        } catch (error) {
          console.log(
            `❌ Failed to create expense for user ${exp.user}:`,
            error.message
          );
        }
      }
    } catch (error) {
      console.log("❌ Error occurred at recurring expense job:", error.message);
    }
  });
};
