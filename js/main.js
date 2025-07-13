// Project data - customize this with your actual projects
const projects = [
    {   date: "2022-12-15",
        title: "Distributional Semantics",
        description: "First steps into NLP",
        badge: "Beginner",
        details: {
            overview: "This project taught me the fundamentals of embeddings and semantic vectors in geometric space.",
            outcomes: "Analyzed semantic vectors through a geometrical lens using distributional semantics. Explored semantic vector representations, their geometrical properties, and used distance metrics to evaluate semantic similarity. Conducted visualizations to illustrate relationships between words in high-dimensional space.",
            tech: ["R", "GGPlot2"],
            github: "#",
            demo: "#"
        }
    },
    {
        date: "2023-01-15",
        title: "Analysis of Socio-Economic Indicators in Oklahoma",
        description: "First steps into big data for economics",
        badge: "Beginner",
        details: {
            overview: "Assessed correlations between socio-economic indicators and mobility trends, revealing important insights into the socio-economic indicators of Oklahoma. This project taught me the fundamentals of data cleaning, exploration, and basic visualization.",
            outcomes: "Successfully identified key relationship between upward mobility and access to transport and provided actionable insights that improved retention by 15%.",
            tech: ["R", "GGPlot2"],
            github: "#",
            demo: "#"
        }
    },
 //   {
        // date: "2023-04-22",
        // title: "Machine Learning Classifier",
        //description: "Built my first ML model for prediction tasks",
        //badge: "Intermediate",
        //details: {
          //  overview: "Developed a sophisticated machine learning classifier to predict customer churn using advanced feature engineering and model selection techniques.",
            //outcomes: "Achieved 89% accuracy with ensemble methods and deployed the model to production using Flask API.",
           // tech: ["Scikit-learn", "XGBoost", "Flask", "Docker", "AWS"],
           // github: "#",
           // demo: "#"
     //   }
  //  },
  //  {
    //    date: "2023-07-10",
     //   title: "Deep Learning Neural Network",
//        description: "Explored neural networks for image classification",
  //      badge: "Advanced",
//        details: {
//            overview: "Built a convolutional neural network for image classification using TensorFlow. Implemented data augmentation and transfer learning techniques.",
 //           outcomes: "Achieved 94% accuracy on test set and learned advanced deep learning concepts including regularization and optimization.",
//            tech: ["TensorFlow", "Keras", "OpenCV", "NumPy", "GPU Computing"],
//            github: "#",
  //          demo: "#"
    //    }
   // },
    {
        date: "2024-10-05",
        title: "NLP Sentiment Analysis",
        description: "Natural language processing for text analysis",
        badge: "Advanced",
        details: {
            overview: "Developed a comprehensive sentiment analysis system using transformer models and BERT. Processed over 2000 Japanese university majors.",
            outcomes: "Created real-time sentiment dashboard and improved brand response time by 40%.",
            tech: ["BERT", "spaCy", "Streamlit", "MongoDB"],
            github: "#",
            demo: "#"
        }
    },
    {
        date: "2025-07-10",
        title: "LLM Prompt Engineering",
        description: "Advanced prompt analysis with GPU",
        badge: "Expert",
        details: {
            overview: "Built a sophisticated system for analyzing and optimizing language model prompts using GPU at Kempner. Implemented custom evaluation metrics and automated testing.",
            outcomes: "Improved prompt effectiveness by 60% and created a reusable framework for prompt optimization.",
            tech: ["PyTorch", "CUDA", "Hugging Face", "Llama", "DeepSeek", "Transformers"],
            github: "#",
            demo: "#"
        }
    },
    {
        date: "2024-06-15",
        title: "AI-Powered Analytics Platform",
        description: "Full-stack data science application",
        badge: "Expert",
        details: {
            overview: "Developed a complete analytics platform combining multiple AI models with a React frontend and Python backend. Integrated real-time data processing and visualization.",
            outcomes: "Successfully deployed to production serving 1000+ users daily with 99.9% uptime.",
            tech: ["React", "FastAPI", "PostgreSQL", "Redis", "Kubernetes", "Grafana"],
            github: "#",
            demo: "#"
        }
    }
];

let currentProjectIndex = 0;
let isDragging = false;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize timeline
    initTimeline();
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Project exhibit buttons
    document.querySelectorAll('.view-project').forEach(button => {
        button.addEventListener('click', function() {
            const projectCard = this.closest('.project-card');
            const projectName = projectCard.dataset.project;
            openProjectExhibit(projectName);
        });
    });

    // LLM Analysis buttons
    const runAnalysisBtn = document.getElementById('run-analysis');
    const viewResultsBtn = document.getElementById('view-results');
    
    if (runAnalysisBtn) runAnalysisBtn.addEventListener('click', runLLMAnalysis);
    if (viewResultsBtn) viewResultsBtn.addEventListener('click', viewAnalysisResults);

    // GPU status indicator
    updateGPUStatus();
    setInterval(updateGPUStatus, 5000); // Update every 5 seconds
});

// Timeline Functions
function initTimeline() {
    const markersContainer = document.getElementById('timelineMarkers');
    const slider = document.getElementById('timelineSlider');
    const handle = document.getElementById('timelineHandle');
    
    if (!markersContainer || !slider || !handle) return; // Timeline not on this page

    // Create markers
    markersContainer.innerHTML = '';
    projects.forEach((project, index) => {
        const marker = document.createElement('div');
        marker.className = `timeline-marker ${index === 0 ? 'active' : ''}`;
        marker.innerHTML = `
            <div class="marker-dot"></div>
            <div class="marker-date">${formatDate(project.date)}</div>
            <div class="marker-title">${project.title}</div>
            <div class="marker-description">${project.description}</div>
        `;
        markersContainer.appendChild(marker);
    });

    // Add event listeners
    handle.addEventListener('mousedown', startDrag);
    slider.addEventListener('click', handleSliderClick);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);

    // Touch events for mobile
    handle.addEventListener('touchstart', startDrag);
    document.addEventListener('touchmove', drag);
    document.addEventListener('touchend', stopDrag);

    updateTimeline(0);
}

function startDrag(e) {
    isDragging = true;
    e.preventDefault();
    const dateDisplay = document.getElementById('dateDisplay');
    if (dateDisplay) dateDisplay.classList.add('show');
}

function drag(e) {
    if (!isDragging) return;
    
    const slider = document.getElementById('timelineSlider');
    if (!slider) return;
    
    const rect = slider.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    
    updateTimelinePosition(percentage);
}

function stopDrag() {
    isDragging = false;
    const dateDisplay = document.getElementById('dateDisplay');
    if (dateDisplay) dateDisplay.classList.remove('show');
}

function handleSliderClick(e) {
    if (isDragging) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    
    updateTimelinePosition(percentage);
}

function updateTimelinePosition(percentage) {
    const handle = document.getElementById('timelineHandle');
    const progress = document.getElementById('timelineProgress');
    const dateDisplay = document.getElementById('dateDisplay');
    
    if (!handle || !progress) return;
    
    handle.style.left = `${percentage}%`;
    progress.style.width = `${percentage}%`;
    
    // Calculate which project to show
    const projectIndex = Math.floor((percentage / 100) * projects.length);
    const clampedIndex = Math.max(0, Math.min(projects.length - 1, projectIndex));
    
    if (clampedIndex !== currentProjectIndex) {
        currentProjectIndex = clampedIndex;
        updateProjectDisplay();
        updateMarkers();
    }
    
    // Update date display
    if (dateDisplay) {
        const currentProject = projects[currentProjectIndex];
        dateDisplay.textContent = formatDate(currentProject.date);
    }
}

function updateProjectDisplay() {
    const project = projects[currentProjectIndex];
    const content = document.getElementById('projectContent');
    
    if (!content) return;
    
    content.classList.remove('active');
    
    setTimeout(() => {
        content.innerHTML = `
            <div class="project-title">
                <span>${project.title}</span>
                <div class="project-badge">${project.badge}</div>
            </div>
            <p>${project.description# Complete Guide: GitHub Data Science Portfolio with Interactive Exhibits

