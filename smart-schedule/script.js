// ==========================================
// 🕒 SMART SCHEDULE TIMELINE ENGINE
// ==========================================
const scheduleForm = document.getElementById('scheduleForm');
const timelineContainer = document.getElementById('timelineContainer');

let scheduleItems = JSON.parse(localStorage.getItem('smartSchedule')) || [];

// Form Submission Event Entry Interceptor
scheduleForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newItem = {
        id: Date.now().toString(),
        title: document.getElementById('taskName').value.trim(),
        start: document.getElementById('startTime').value,
        end: document.getElementById('endTime').value,
        category: document.getElementById('taskCategory').value,
        isCompleted: false
    };

    scheduleItems.push(newItem);
    saveAndRenderTimeline();
    scheduleForm.reset();
});

// Calculate Active Real-Time Temporal States (Passed vs Active vs Upcoming)
function determineTimeState(startTimeStr, endTimeStr) {
    const now = new Date();
    const currentMinutes = (now.getHours() * 60) + now.getMinutes();

    const [startHours, startMins] = startTimeStr.split(':').map(Number);
    const [endHours, endMins] = endTimeStr.split(':').map(Number);

    const startMinutes = (startHours * 60) + startMins;
    const endMinutes = (endHours * 60) + endMins;

    if (currentMinutes > endMinutes) {
        return 'passed';
    } else if (currentMinutes >= startMinutes && currentMinutes <= endMinutes) {
        return 'active';
    } else {
        return 'upcoming';
    }
}

// Global Core Sync & Matrix Renderer Loop
function renderTimeline() {
    timelineContainer.innerHTML = '';
    
    if (scheduleItems.length === 0) {
        timelineContainer.innerHTML = `<p style="text-align:center; color:var(--text-secondary); margin-top:2rem;">No items scheduled for today. Add tasks to start tracking!</p>`;
        updateMetrics();
        return;
    }

    // Sort items chronologically by their scheduled start time strings
    scheduleItems.sort((a, b) => a.start.localeCompare(b.start));

    scheduleItems.forEach(item => {
        const timeState = determineTimeState(item.start, item.end);
        
        const cardNode = document.createElement('div');
        cardNode.className = `schedule-card cat-${item.category} state-${timeState} ${item.isCompleted ? 'completed' : ''}`;
        
        cardNode.innerHTML = `
            <div class="card-details">
                <h4>${item.title} <span class="status-pill pill-${timeState}">${timeState}</span></h4>
                <span class="time-badge">⏱️ ${item.start} - ${item.end}</span>
                <span style="font-size:0.85rem; margin-left:0.5rem; color:var(--text-secondary)">| ${item.category}</span>
            </div>
            <div class="card-actions">
                <input type="checkbox" class="check-box-action" ${item.isCompleted ? 'checked' : ''} onclick="toggleBlockCompletion('${item.id}')">
                <button class="delete-block-btn" onclick="deleteScheduleBlock('${item.id}')">🗑️</button>
            </div>
        `;
        
        timelineContainer.appendChild(cardNode);
    });

    updateMetrics();
}

// Toggle Checkbox Status 
window.toggleBlockCompletion = (id) => {
    scheduleItems = scheduleItems.map(item => {
        if (item.id === id) item.isCompleted = !item.isCompleted;
        return item;
    });
    saveAndRenderTimeline();
};

// Remove Task Item Block Configuration 
window.deleteScheduleBlock = (id) => {
    scheduleItems = scheduleItems.filter(item => item.id !== id);
    saveAndRenderTimeline();
};

// Global App Metrics Calculations Panel Tracker
function updateMetrics() {
    const total = scheduleItems.length;
    const completed = scheduleItems.filter(item => item.isCompleted).length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;

    document.getElementById('totalBlocksCount').textContent = total;
    document.getElementById('completedCount').textContent = completed;
    document.getElementById('scheduleProgress').style.width = `${percentage}%`;
}

function saveAndRenderTimeline() {
    localStorage.setItem('smartSchedule', JSON.stringify(scheduleItems));
    renderTimeline();
}

// Auto-evaluate timelines clock frames every 60 seconds natively to shift task states live
setInterval(renderTimeline, 60000);

// Run core instance loop on standard file lifecycle execution load
document.addEventListener("DOMContentLoaded", () => {
    renderTimeline();
});

