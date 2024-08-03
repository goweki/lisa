export default function Reminders({
  reminders,
  onReminderChange,
  onAddReminder,
  onDeleteReminder,
}) {
  return (
    <div className="flex flex-col space-y-2">
      {reminders.map((reminder, index) => (
        <div key={index} className="grid grid-cols-10 gap-2">
          <div className="col-span-4">
            <select
              name={`notification-channel-${index}`}
              id={`notification-channel-${index}`}
              className="bg-slate-300 dark:bg-slate-900 border-transparent dark:border-transparent focus:ring-emerald-800 focus:border-emerald-800 dark:focus:ring-emerald-800 dark:focus:border-emerald-800 border shadow dark:shadow-dak dark:focus:shadow-dpressed focus:shadow-pressed text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:placeholder-gray-400 placeholder:italic dark:text-white"
              value={reminder.channel}
              onChange={(e) =>
                onReminderChange(index, "channel", e.target.value)
              }
            >
              <option value="" className="italic font-light">
                notifications
              </option>
              {[
                { value: "sms", text: "📝 sms" },
                { value: "email", text: "⏲️ email" },
              ].map((option) => (
                <option key={option.value} value={option.value}>
                  {option.text}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-2">
            <input
              name={`notification-count-${index}`}
              id={`notification-count-${index}`}
              type="number"
              className="border-transparent dark:border-transparent focus:ring-emerald-800 focus:border-emerald-800 dark:focus:ring-emerald-800 dark:focus:border-emerald-800 border bg-slate-300 dark:bg-slate-900 shadow dark:shadow-dak dark:focus:shadow-dpressed focus:shadow-pressed text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5 dark:placeholder-gray-400 placeholder:italic dark:text-white"
              value={reminder.count}
              onChange={(e) =>
                onReminderChange(index, "count", parseInt(e.target.value))
              }
            />
          </div>
          <div className="col-span-3">
            <select
              name={`notification-regime-${index}`}
              id={`notification-regime-${index}`}
              className="bg-slate-300 dark:bg-slate-900 border-transparent dark:border-transparent focus:ring-emerald-800 focus:border-emerald-800 dark:focus:ring-emerald-800 dark:focus:border-emerald-800 border shadow dark:shadow-dak dark:focus:shadow-dpressed focus:shadow-pressed text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:placeholder-gray-400 placeholder:italic dark:text-white"
              value={reminder.regime}
              onChange={(e) =>
                onReminderChange(index, "regime", e.target.value)
              }
            >
              <option value="" className="italic font-light">
                unit
              </option>
              {[
                { value: "minutes", text: "📝 minutes" },
                { value: "hours", text: "⏲️ hours" },
                { value: "days", text: "⏲️ days" },
              ].map((option) => (
                <option key={option.value} value={option.value}>
                  {option.text}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-1 flex items-center justify-center">
            <button
              type="button"
              className="text-red-700 dark:text-red-300 font-bold py-2 px-4 rounded"
              onClick={() => onDeleteReminder(index)}
            >
              X
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        className="w-fit m-2 p-2 hover:bg-slate-300 dark:hover:bg-slate-600 text-sm rounded-md"
        onClick={onAddReminder}
      >
        Add reminder
      </button>
    </div>
  );
}
