document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            target.scrollIntoView({ behavior: 'smooth' });
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
    document.getElementById('run-analysis').addEventListener('click', runLLMAnalysis);
    document.getElementById('view-results').addEventListener('click', viewAnalysisResults);

    // GPU status indicator
    updateGPUStatus();
    setInterval(updateGPUStatus, 5000); // Update every 5 seconds
});

function openProjectExhibit(projectName) {
    // Create modal or navigate to project page
    window.open(`projects/${projectName}/index.html`, '_blank');
}

function runLLMAnalysis() {
    // Simulate GPU analysis
    const indicator = document.getElementById('gpu-indicator');
    indicator.className = 'gpu-active';
    
    // You would replace this with actual API calls to your GPU analysis
    console.log('Running LLM prompt analysis...');
    
    // Simulate analysis completion
    setTimeout(() => {
        alert('Analysis complete! Check the results section.');
        indicator.className = 'gpu-inactive';
    }, 3000);
}

function viewAnalysisResults() {
    window.open('projects/llm-prompt-analysis/index.html', '_blank');
}

function updateGPUStatus() {
    // You would replace this with actual GPU status checking
    const indicator = document.getElementById('gpu-indicator');
    const isGPUActive = Math.random() > 0.5; // Simulate random status
    
    indicator.className = isGPUActive ? 'gpu-active' : 'gpu-inactive';
}
