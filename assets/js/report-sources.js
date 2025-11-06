let currentSourceId = null;
const itemsPerPage = 7;
let currentPage = 1;
let allTopics = [];

// Initialize Bootstrap modals
let topicModal, thankYouModal;
document.addEventListener('DOMContentLoaded', function() {
    topicModal = new bootstrap.Modal(document.getElementById('topicModal'));
    thankYouModal = new bootstrap.Modal(document.getElementById('thankYouModal'));
});

// Handle report link clicks
document.querySelectorAll('.report-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        currentSourceId = this.getAttribute('data-source-id');
        if (typeof gtag !== 'undefined') {
            gtag('event', 'link_report_source', {
                'event_category': 'User Feedback',
                'event_label': currentSourceId,
                'value': 1
            });
        }
        showTopicModal();
    });
});

function showTopicModal() {
    // Collect all news group titles
    allTopics = [];
    let currentGroupIndex = -1;
    
    document.querySelectorAll('.news-group').forEach((group, index) => {
        const groupId = group.getAttribute('id');
        const titleElement = group.querySelector('h3, h6, strong');
        const titleText = titleElement.textContent.trim();
        
        // Extract just the main headline (remove source and tags)
        const headlines = titleText.split(':');
        const mainHeadline = headlines.length > 1 ? headlines.slice(1).join(':').trim() : titleText;
        
        allTopics.push({
            id: groupId,
            title: mainHeadline
        });

        // Check if this group contains the current source link
        if (group.querySelector(`#${currentSourceId}`)) {
            currentGroupIndex = index;
        }
    });

    // Calculate which page the current topic is on
    if (currentGroupIndex >= 0) {
        currentPage = Math.floor(currentGroupIndex / itemsPerPage) + 1;
    } else {
        currentPage = 1;
    }

    renderTopicList();
    topicModal.show();
}

function renderTopicList() {
    const topicList = document.getElementById('topicList');
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageTopics = allTopics.slice(start, end);

    topicList.innerHTML = '';
    pageTopics.forEach(topic => {
        const topicId = `${currentSourceId}_${topic.id}`;
        const div = document.createElement('div');
        div.className = 'topic-item';
        div.setAttribute('data-topic-id', topicId);
        div.textContent = topic.title;
        div.addEventListener('click', function() {
            handleTopicSelection(topicId);
        });
        topicList.appendChild(div);
    });

    renderPagination();
}

function renderPagination() {
    const totalPages = Math.ceil(allTopics.length / itemsPerPage);
    const paginationControls = document.getElementById('paginationControls');

    if (totalPages <= 1) {
        paginationControls.innerHTML = '';
        return;
    }

    let html = '<nav><ul class="pagination pagination-sm justify-content-center">';
    
    // Previous button
    html += `<li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
        <a class="page-link" href="#" data-page="${currentPage - 1}">Previous</a>
    </li>`;

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            html += `<li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>`;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            html += '<li class="page-item disabled"><span class="page-link">...</span></li>';
        }
    }

    // Next button
    html += `<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
        <a class="page-link" href="#" data-page="${currentPage + 1}">Next</a>
    </li>`;

    html += '</ul></nav>';
    paginationControls.innerHTML = html;

    // Add click handlers to pagination links
    paginationControls.querySelectorAll('a.page-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = parseInt(this.getAttribute('data-page'));
            if (page >= 1 && page <= totalPages) {
                currentPage = page;
                renderTopicList();
            }
        });
    });
}

function handleTopicSelection(topicId) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'link_report_topic', {
            'event_category': 'User Feedback',
            'event_label': topicId,
            'value': 1
        });
    }

    // Close topic modal and show thank you
    topicModal.hide();
    thankYouModal.show();

    // Auto-close thank you modal after 1.5 seconds
    setTimeout(() => {
        thankYouModal.hide();
    }, 1500);
}
