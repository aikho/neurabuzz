let activeTag = null;

// Handle tag filter button clicks
document.querySelectorAll('.tag-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const tag = this.getAttribute('data-tag');
        
        // If clicking on close icon or already active tag
        if (e.target.classList.contains('close-icon') || this.classList.contains('active')) {
            deactivateFilter();
        } else {
            activateFilter(tag, this);
        }
    });
});

// Handle badge clicks in news items
document.querySelectorAll('.tag-badge').forEach(badge => {
    badge.style.cursor = 'pointer';
    badge.addEventListener('click', function() {
        const tag = this.getAttribute('data-tag');
        const btn = document.querySelector(`.tag-btn[data-tag="${tag}"]`);
        activateFilter(tag, btn);
    });
});

function activateFilter(tag, button) {
    // Deactivate all buttons first
    document.querySelectorAll('.tag-btn').forEach(b => b.classList.remove('active'));
    
    // Activate clicked button
    button.classList.add('active');
    activeTag = tag;
    
    // Filter news groups
    document.querySelectorAll('.news-group').forEach(group => {
        const tags = group.getAttribute('data-tags').split(',');
        if (tags.includes(tag)) {
            group.classList.remove('hidden');
        } else {
            group.classList.add('hidden');
        }
    });
}

function deactivateFilter() {
    // Remove active state from all buttons
    document.querySelectorAll('.tag-btn').forEach(b => b.classList.remove('active'));
    activeTag = null;
    
    // Show all news groups
    document.querySelectorAll('.news-group').forEach(group => {
        group.classList.remove('hidden');
    });
}
