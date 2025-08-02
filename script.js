const taskInput = document.getElementById('taskInput');
const reminderTime = document.getElementById('reminderTime');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

// حفظ وتحديث المهام
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// عرض المهام
function displayTasks() {
  taskList.innerHTML = '';
  tasks.forEach((task, index) => {
    const taskBox = document.createElement('div');
    taskBox.className = 'task-box';
    if (task.done) taskBox.classList.add('done');

    const taskText = document.createElement('div');
    taskText.innerHTML = `<strong>${task.text}</strong><div class="task-date">${formatDate(task.time)}</div>`;

    const buttons = document.createElement('div');
    const checkBtn = document.createElement('button');
    checkBtn.innerText = '✔️';
    checkBtn.onclick = () => {
      task.done = !task.done;
      saveTasks();
      displayTasks();
    };

    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = '🗑️';
    deleteBtn.onclick = () => {
      tasks.splice(index, 1);
      saveTasks();
      displayTasks();
    };

    buttons.appendChild(checkBtn);
    buttons.appendChild(deleteBtn);

    taskBox.appendChild(taskText);
    taskBox.appendChild(buttons);
    taskList.appendChild(taskBox);
  });
}

function formatDate(datetime) {
  const d = new Date(datetime);
  return `${d.toLocaleDateString('ar-SA')} ${d.toLocaleTimeString('ar-SA', {hour: '2-digit', minute:'2-digit'})}`;
}

// إضافة مهمة جديدة
addTaskBtn.onclick = () => {
  const text = taskInput.value.trim();
  const time = reminderTime.value;
  if (!text || !time) return alert("يرجى إدخال المهمة وتحديد وقت التذكير");

  tasks.push({ text, time, done: false });
  saveTasks();
  displayTasks();
  taskInput.value = '';
  reminderTime.value = '';
};

// التنبيهات
function checkReminders() {
  const now = new Date().getTime();
  tasks.forEach(task => {
    if (!task.notified && new Date(task.time).getTime() <= now) {
      showNotification(task.text);
      task.notified = true;
      saveTasks();
    }
  });
}

function showNotification(text) {
  if (Notification.permission === "granted") {
    new Notification("📌 تذكير بمهمة:", { body: text });
  }
}

// طلب الإذن للتنبيهات
if (Notification.permission !== "granted") {
  Notification.requestPermission();
}

setInterval(checkReminders, 60000); // تحقق كل دقيقة

displayTasks();
    