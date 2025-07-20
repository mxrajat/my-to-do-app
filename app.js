class TodoApp {
    constructor() {
        this.tasks = [];
        this.taskIdCounter = 1;
        this.initElements();
        this.bindEvents();
        this.updateUI();
    }

    initElements() {
        this.taskInput = document.getElementById('taskInput');
        this.addTaskBtn = document.getElementById('addTaskBtn');
        this.taskList = document.getElementById('taskList');
        this.emptyState = document.getElementById('emptyState');
        this.totalTasksElement = document.getElementById('totalTasks');
        this.completedTasksElement = document.getElementById('completedTasks');
        this.pendingTasksElement = document.getElementById('pendingTasks');
        this.clearCompletedBtn = document.getElementById('clearCompleted');
    }

    bindEvents() {
        // Add task events
        this.addTaskBtn.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTask();
            }
        });

        // Clear completed tasks
        this.clearCompletedBtn.addEventListener('click', () => this.clearCompletedTasks());

        // Focus on input when page loads
        this.taskInput.focus();
    }

    addTask() {
        const taskText = this.taskInput.value.trim();
        
        if (!taskText) {
            this.showNotification('कृपया कार्य का नाम लिखें!', 'warning');
            this.taskInput.focus();
            return;
        }

        if (taskText.length > 200) {
            this.showNotification('कार्य का नाम बहुत लंबा है!', 'warning');
            return;
        }

        const task = {
            id: this.taskIdCounter++,
            text: taskText,
            completed: false,
            createdAt: new Date()
        };

        this.tasks.unshift(task); // Add to beginning of array
        this.taskInput.value = '';
        this.updateUI();
        this.showNotification('कार्य जोड़ा गया!', 'success');
    }

    toggleTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.updateUI();
            
            if (task.completed) {
                this.showNotification('कार्य पूर्ण किया गया!', 'success');
            } else {
                this.showNotification('कार्य अधूरा किया गया!', 'info');
            }
        }
    }

    deleteTask(taskId) {
        const taskIndex = this.tasks.findIndex(t => t.id === taskId);
        if (taskIndex > -1) {
            this.tasks.splice(taskIndex, 1);
            this.updateUI();
            this.showNotification('कार्य हटा दिया गया!', 'info');
        }
    }

    clearCompletedTasks() {
        const completedCount = this.tasks.filter(t => t.completed).length;
        this.tasks = this.tasks.filter(t => !t.completed);
        this.updateUI();
        this.showNotification(`${completedCount} पूर्ण कार्य हटा दिए गए!`, 'info');
    }

    updateUI() {
        this.renderTasks();
        this.updateStats();
        this.updateEmptyState();
        this.updateClearButton();
    }

    renderTasks() {
        this.taskList.innerHTML = '';

        this.tasks.forEach(task => {
            const taskElement = this.createTaskElement(task);
            this.taskList.appendChild(taskElement);
        });
    }

    createTaskElement(task) {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.setAttribute('data-task-id', task.id);

        li.innerHTML = `
            <input 
                type="checkbox" 
                class="task-checkbox" 
                ${task.completed ? 'checked' : ''}
                onclick="todoApp.toggleTask(${task.id})"
            >
            <span class="task-text">${this.escapeHtml(task.text)}</span>
            <div class="task-actions">
                <button 
                    class="delete-btn" 
                    onclick="todoApp.deleteTask(${task.id})"
                    title="कार्य हटाएं"
                >
                    ✕
                </button>
            </div>
        `;

        return li;
    }

    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const pending = total - completed;

        this.totalTasksElement.textContent = total;
        this.completedTasksElement.textContent = completed;
        this.pendingTasksElement.textContent = pending;
    }

    updateEmptyState() {
        if (this.tasks.length === 0) {
            this.emptyState.style.display = 'block';
            this.taskList.style.display = 'none';
        } else {
            this.emptyState.style.display = 'none';
            this.taskList.style.display = 'block';
        }
    }

    updateClearButton() {
        const hasCompletedTasks = this.tasks.some(t => t.completed);
        this.clearCompletedBtn.style.display = hasCompletedTasks ? 'inline-flex' : 'none';
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            fontSize: '14px',
            zIndex: '1000',
            opacity: '0',
            transform: 'translateX(100%)',
            transition: 'all 0.3s ease',
            maxWidth: '300px',
            wordWrap: 'break-word'
        });

        // Set background color based on type
        const colors = {
            success: '#10B981',
            warning: '#F59E0B',
            error: '#EF4444',
            info: '#3B82F6'
        };
        notification.style.backgroundColor = colors[type] || colors.info;

        // Add to page
        document.body.appendChild(notification);

        // Animate in
        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        });

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Initialize sample tasks for demonstration
    loadSampleTasks() {
        const sampleTasks = [
            'किराने की खरीदारी करें',
            'डॉक्टर से मिलने जाएं',
            'प्रोजेक्ट रिपोर्ट पूरी करें',
            '30 मिनट व्यायाम करें'
        ];

        sampleTasks.forEach((taskText, index) => {
            const task = {
                id: this.taskIdCounter++,
                text: taskText,
                completed: index === 1, // Mark second task as completed
                createdAt: new Date()
            };
            this.tasks.push(task);
        });

        this.updateUI();
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.todoApp = new TodoApp();
    
    // Uncomment the line below to load sample tasks for demonstration
    // todoApp.loadSampleTasks();
});

// Add some keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + / to focus on input
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        document.getElementById('taskInput').focus();
    }
});

// Add some animations and interactions
document.addEventListener('click', (e) => {
    // Add ripple effect to buttons
    if (e.target.classList.contains('btn')) {
        createRipple(e);
    }
});

function createRipple(event) {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    const rect = button.getBoundingClientRect();
    circle.style.width = circle.style.height = diameter + 'px';
    circle.style.left = (event.clientX - rect.left - radius) + 'px';
    circle.style.top = (event.clientY - rect.top - radius) + 'px';
    circle.classList.add('ripple');

    // Add ripple styles
    Object.assign(circle.style, {
        position: 'absolute',
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        transform: 'scale(0)',
        animation: 'ripple-animation 0.6s linear',
        pointerEvents: 'none'
    });

    // Add animation keyframes
    if (!document.querySelector('#ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            @keyframes ripple-animation {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            .btn {
                position: relative;
                overflow: hidden;
            }
        `;
        document.head.appendChild(style);
    }

    const ripple = button.querySelector('.ripple');
    if (ripple) {
        ripple.remove();
    }

    button.appendChild(circle);
}