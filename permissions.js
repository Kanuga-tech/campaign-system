// Function to check if user has permission to perform an action
function checkPermission(requiredPermission) {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
        window.location.href = "login.html";
        return false;
    }

    // Admin has all permissions
    if (loggedInUser.permissions.includes("all")) {
        return true;
    }

    // Check specific permission
    return loggedInUser.permissions.includes(requiredPermission);
}

// Function to check if user can view a page
function checkPageAccess(pageName) {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
        window.location.href = "login.html";
        return false;
    }

    // Admin can access all pages
    if (loggedInUser.permissions.includes("all")) {
        return true;
    }

    // Data entry can view all pages but only edit supporters
    if (loggedInUser.permissions.includes("view_all")) {
        return true;
    }

    // Add specific page access rules here
    const pagePermissions = {
        "campaign.html": ["view_all"],
        "supporters.html": ["view_all", "edit_supporters"],
        "team-members.html": ["view_all"],
        "attendance.html": ["view_all"],
        "finance.html": ["view_all"],
        "data-entry.html": ["view_all"]
    };

    return pagePermissions[pageName]?.some(permission => 
        loggedInUser.permissions.includes(permission)
    ) || false;
}

// Function to disable edit controls based on permissions
function updatePagePermissions() {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
        window.location.href = "login.html";
        return;
    }

    // Get current page name
    const currentPage = window.location.pathname.split("/").pop() || "campaign.html";

    // Check if user can edit on this page
    const canEdit = loggedInUser.permissions.includes("all") || 
                   (currentPage === "supporters.html" && loggedInUser.permissions.includes("edit_supporters"));

    // Disable all edit controls if user doesn't have permission
    if (!canEdit) {
        const editControls = document.querySelectorAll('.edit-btn, .delete-btn, .add-btn, .save-btn');
        editControls.forEach(control => {
            control.style.display = 'none';
        });

        // Disable form inputs
        const formInputs = document.querySelectorAll('input, select, textarea');
        formInputs.forEach(input => {
            input.disabled = true;
        });
    }
}

// Check page access on load
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split("/").pop() || "campaign.html";
    
    if (!checkPageAccess(currentPage)) {
        alert("You don't have permission to access this page.");
        window.location.href = "campaign.html";
        return;
    }

    // Update page permissions
    updatePagePermissions();
}); 