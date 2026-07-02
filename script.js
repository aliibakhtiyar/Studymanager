// =============================
// Daily Tasks
// =============================

let tasks = [
  {
    name: "DSA",
    time: 120,
    icon: "fa-solid fa-brain",
    completed: false,
  },
  {
    name: "MERN",
    time: 120,
    icon: "fa-solid fa-code",
    completed: false,
  },
  {
    name: "English",
    time: 60,
    icon: "fa-solid fa-language",
    completed: false,
  },
  {
    name: "Read Book",
    time: 20,
    icon: "fa-solid fa-book-open",
    completed: false,
  },
  {
    name: "Speak",
    time: 20,
    icon: "fa-solid fa-microphone",
    completed: false,
  },
  {
    name: "Listen",
    time: 20,
    icon: "fa-solid fa-headphones",
    completed: false,
  },
  {
    name: "Project",
    time: 60,
    icon: "fa-solid fa-laptop-code",
    completed: false,
  },
  {
    name: "Exercise",
    time: 30,
    icon: "fa-solid fa-dumbbell",
    completed: false,
  },
];

// =============================
// LocalStorage Keys
// =============================

const TASK_KEY = "study_tasks";
const GOAL_KEY = "weekly_goal";
const DATE_KEY = "study_date";

// =============================
// Elements
// =============================

const taskContainer = document.getElementById("taskContainer");
const progressBar = document.getElementById("progressBar");
const progressPercent = document.getElementById("progressPercent");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const remainingTasks = document.getElementById("remainingTasks");
const studyTime = document.getElementById("studyTime");

const weeklyGoal = document.getElementById("weeklyGoal");

const quote = document.getElementById("quote");
const greeting = document.getElementById("greeting");
const todayDate = document.getElementById("todayDate");

// =============================
// Quotes
// =============================

const quotes = [
  "Discipline beats motivation every single day.",
  "Small improvements create big success.",
  "Focus on progress, not perfection.",
  "Your future is built by today's actions.",
  "Consistency is your superpower.",
];

// =============================
// Greeting
// =============================

function setGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) greeting.innerHTML = "Good Morning ☀️";
  else if (hour < 17) greeting.innerHTML = "Good Afternoon 🌤";
  else greeting.innerHTML = "Good Evening 🌙";
}

// =============================
// Date
// =============================

function setDate() {
  todayDate.innerHTML = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// =============================
// Daily Reset
// =============================

function resetDaily() {
  const today = new Date().toDateString();
  const savedDate = localStorage.getItem(DATE_KEY);

  if (savedDate !== today) {
    tasks.forEach((task) => (task.completed = false));

    localStorage.setItem(TASK_KEY, JSON.stringify(tasks));
    localStorage.setItem(DATE_KEY, today);
  }
}

// =============================
// Load Data
// =============================

function loadData() {
  const savedTasks = localStorage.getItem(TASK_KEY);

  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
  }

  weeklyGoal.value = localStorage.getItem(GOAL_KEY) || "";
}

// =============================
// Save
// =============================

function saveTasks() {
  localStorage.setItem(TASK_KEY, JSON.stringify(tasks));
}

weeklyGoal.addEventListener("input", () => {
  localStorage.setItem(GOAL_KEY, weeklyGoal.value);
});

// =============================
// Render Tasks
// =============================

function renderTasks() {
  taskContainer.innerHTML = "";

  tasks.forEach((task, index) => {
    const div = document.createElement("div");

    div.className = "task";

    div.innerHTML = `
    
    <div class="task-left">

        <div class="task-icon">
            <i class="${task.icon}"></i>
        </div>

        <div>

            <h3>${task.name}</h3>

            <span>${task.time} Minutes</span>

        </div>

    </div>

    <input
        type="checkbox"
        ${task.completed ? "checked" : ""}
        onchange="toggleTask(${index})"
    >
    
    `;

    taskContainer.appendChild(div);
  });

  updateAnalytics();
}

// =============================
// Toggle
// =============================

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;

  saveTasks();

  updateAnalytics();
  renderChart();
}

// =============================
// Analytics
// =============================

function updateAnalytics() {
  const total = tasks.length;

  const completed = tasks.filter((t) => t.completed).length;

  const remaining = total - completed;

  const percent = Math.round((completed / total) * 100);

  let minutes = 0;

  tasks.forEach((task) => {
    if (task.completed) minutes += task.time;
  });

  totalTasks.innerHTML = total;
  completedTasks.innerHTML = completed;
  remainingTasks.innerHTML = remaining;

  studyTime.innerHTML =
    minutes >= 60
      ? `${(minutes / 60).toFixed(1)} hrs`
      : `${minutes} min`;

  progressBar.style.width = percent + "%";

  progressPercent.innerHTML = percent + "%";

  quote.innerHTML =
    quotes[Math.min(Math.floor(percent / 20), quotes.length - 1)];
}

// =============================
// Chart
// =============================

const ctx = document.getElementById("taskChart");

const chart = new Chart(ctx, {
  type: "doughnut",

  data: {
    labels: ["Completed", "Remaining"],

    datasets: [
      {
        data: [0, tasks.length],

        backgroundColor: ["#22c55e", "#334155"],

        borderWidth: 0,
      },
    ],
  },

  options: {
    responsive: true,

    plugins: {
      legend: {
        labels: {
          color: "white",
        },
      },
    },
  },
});

function renderChart() {
  const completed = tasks.filter((t) => t.completed).length;

  chart.data.datasets[0].data = [
    completed,
    tasks.length - completed,
  ];

  chart.update();
}

// =============================
// Start
// =============================

setGreeting();

setDate();

resetDaily();

loadData();

renderTasks();

renderChart();