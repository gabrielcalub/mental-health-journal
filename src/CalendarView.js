import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Import calendar styles
import "./styles.css"; // Import your styles

const CalendarView = ({ entries, moods }) => {
  const [date, setDate] = React.useState(new Date());

  // Convert a Date object to a formatted string (YYYY-MM-DD)
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2); // Months are zero-based
    const day = `0${date.getDate()}`.slice(-2);
    return `${year}-${month}-${day}`;
  };

  // Get entries for a specific date
  const getEntriesForDate = (date) => {
    const formattedDate = formatDate(date);
    console.log(`Getting entries for date: ${formattedDate}`);
    return entries.filter((entry) => entry.date === formattedDate);
  };

  // Render content on each tile of the calendar
  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const entriesForDate = getEntriesForDate(date);
      console.log(`Entries for date ${formatDate(date)}:`, entriesForDate);
      if (entriesForDate.length === 0) {
        return null;
      }

      // Assuming only one mood per date, get the first entry
      const moodName = entriesForDate[0].mood;
      const mood = moods.find((mood) => mood.name === moodName);

      console.log(`Mood for date ${formatDate(date)}:`, mood);
      return mood ? (
        <div className="calendar-mood">
          <img src={mood.image} alt={moodName} className="calendar-mood-img" />
        </div>
      ) : null;
    }
    return null;
  };

  return (
    <div className="calendar-container">
      <Calendar onChange={setDate} value={date} tileContent={tileContent} />
      <div>
        <h2>Selected Date: {date.toDateString()}</h2>
      </div>
    </div>
  );
};

export default CalendarView;
