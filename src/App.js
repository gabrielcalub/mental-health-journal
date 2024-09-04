import React, { useState, useEffect } from "react";
import "./styles.css";
import { Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Import local mood images
import calmImg from "./calm.jpg";
import sadImg from "./sad.jpg";
import okImg from "./ok.jpeg";
import coolImg from "./cutesy.jpg";
import confusedImg from "./confused.jpg";

// Import Calendar component
import CalendarView from "./CalendarView";

// Import title image
import titleImage from "./MindfulPages.png";

//Import BG image
import MPBG from "./MPBG.png"; // Import the image

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

// Mood options
const moods = [
  { name: "Calm", image: calmImg },
  { name: "Sad", image: sadImg },
  { name: "Okay", image: okImg },
  { name: "Cool", image: coolImg },
  { name: "Confused", image: confusedImg },
];

const App = () => {
  const [entry, setEntry] = useState("");
  const [selectedMood, setSelectedMood] = useState(null);
  const [sleepHours, setSleepHours] = useState("");
  const [moodRating, setMoodRating] = useState("");
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState("");
  const [view, setView] = useState("journal");
  const [entryDate, setEntryDate] = useState(new Date().toLocaleDateString());

  // Inline style for background image
  const backgroundStyle = {
    backgroundImage: `url(${MPBG})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
  };

  // Load saved entries from localStorage
  useEffect(() => {
    const savedEntries = JSON.parse(localStorage.getItem("entries")) || [];
    setEntries(savedEntries);
  }, []);

  // Handle form submission to add a new journal entry
  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedMood === null || moodRating < 1 || moodRating > 10) {
      setError("Please select a mood and provide a rating between 1 and 10.");
      return;
    }
    const newEntry = {
      text: entry,
      mood: selectedMood,
      sleepHours,
      moodRating,
      date: entryDate,
    };
    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    setEntry("");
    setSelectedMood(null);
    setSleepHours("");
    setMoodRating("");
    setEntryDate(new Date().toLocaleDateString());
    localStorage.setItem("entries", JSON.stringify(updatedEntries));
    setError("");
  };

  // Handle deletion of a journal entry
  const handleDelete = (index) => {
    const updatedEntries = entries.filter((_, i) => i !== index);
    setEntries(updatedEntries);
    localStorage.setItem("entries", JSON.stringify(updatedEntries));
  };

  // Prepare data for sleep and mood correlation scatter plot
  const sleepMoodCorrelationData = {
    datasets: [
      {
        label: "Sleep vs Mood",
        data: entries.map((entry) => ({
          x: parseFloat(entry.sleepHours) || 0,
          y: parseFloat(entry.moodRating) || 0,
        })),
        backgroundColor: "#4a90e2", // Color for data points
        borderColor: "#4a90e2",
        borderWidth: 1,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `Sleep Hours: ${tooltipItem.raw.x}, Mood Rating: ${tooltipItem.raw.y}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Hours of Sleep",
        },
        beginAtZero: true,
      },
      y: {
        title: {
          display: true,
          text: "Mood Rating",
        },
        beginAtZero: true,
        suggestedMax: 10,
      },
    },
  };

  return (
    <div style={backgroundStyle} className="container">
      <header className="header">
        <img
          src={titleImage}
          alt="Mental Health Journal"
          className="title-image"
        />
      </header>
      <div className="tabs">
        <button
          onClick={() => setView("journal")}
          className={view === "journal" ? "active" : ""}
        >
          Journal
        </button>
        <button
          onClick={() => setView("dashboard")}
          className={view === "dashboard" ? "active" : ""}
        >
          Dashboard
        </button>
      </div>

      {view === "journal" && (
        <div>
          <form className="journal-form" onSubmit={handleSubmit}>
            <textarea
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              placeholder="Write your thoughts here..."
              required
            />
            <div className="mood-section">
              <h3>Mood</h3>
              <div className="mood-selector">
                {moods.map((mood, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`mood-button ${
                      selectedMood === mood.name ? "selected" : ""
                    }`}
                    onClick={() => setSelectedMood(mood.name)}
                  >
                    <img src={mood.image} alt={mood.name} />
                  </button>
                ))}
              </div>
              {selectedMood && (
                <div className="selected-mood">
                  <h3>Selected Mood</h3>
                  <img
                    src={
                      moods.find((mood) => mood.name === selectedMood)?.image
                    }
                    alt={selectedMood}
                  />
                </div>
              )}
            </div>
            <div className="sleep-hours">
              <label>Hours of Sleep:</label>
              <input
                type="number"
                value={sleepHours}
                onChange={(e) => setSleepHours(e.target.value)}
                placeholder="Enter hours"
                min="0"
                step="0.1"
                required
              />
            </div>
            <div className="mood-rating">
              <label>Mood Rating (1-10):</label>
              <input
                type="number"
                value={moodRating}
                onChange={(e) => setMoodRating(e.target.value)}
                placeholder="Enter rating"
                min="1"
                max="10"
                step="1"
                required
              />
            </div>
            <div className="entry-date">
              <label>Date:</label>
              <input
                type="date"
                value={new Date(entryDate).toISOString().split("T")[0]}
                onChange={(e) => setEntryDate(e.target.value)}
                required
              />
            </div>
            {error && <p className="error">{error}</p>}
            <button type="submit">Save Entry</button>
          </form>
          <div className="entries">
            <h2>Your Entries</h2>
            <ul>
              {entries.map((entry, index) => (
                <li key={index}>
                  <p>{entry.text}</p>
                  <small>{entry.date}</small>
                  <div className="mood-display">
                    <img
                      src={
                        moods.find((mood) => mood.name === entry.mood)?.image
                      }
                      alt={entry.mood}
                    />
                  </div>
                  <p>
                    <strong>Hours of Sleep:</strong> {entry.sleepHours}
                  </p>
                  <p>
                    <strong>Mood Rating:</strong> {entry.moodRating}
                  </p>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(index)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {view === "dashboard" && (
        <div className="dashboard">
          <CalendarView entries={entries} moods={moods} />
          <h2>Sleep and Mood Correlation</h2>
          <div className="chart-container">
            <Scatter data={sleepMoodCorrelationData} options={options} />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
