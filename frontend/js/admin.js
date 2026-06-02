// ===================== بيانات PENDING WORKSPACES =====================
const pendingWorkspaces = [
    {
        id: 1,
        name: "Focus Hub",
        desc: "Modern & quiet space",
        img: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=200",
        ownerName: "Ahmad Owner",
        ownerEmail: "ahmad.owner@email.com",
        ownerImg: "https://i.pravatar.cc/100?img=11",
        city: "Al-Rimal, Gaza",
        submittedAt: "May 10, 2024",
        submittedTime: "10:30 AM",
        status: "Pending"
    },
    {
        id: 2,
        name: "Creative Space",
        desc: "Think. Create. Inspire.",
        img: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=200",
        ownerName: "Sara Ali",
        ownerEmail: "sara.ali@email.com",
        ownerImg: "https://i.pravatar.cc/100?img=20",
        city: "Gaza City",
        submittedAt: "May 9, 2024",
        submittedTime: "3:45 PM",
        status: "Pending"
    },
    {
        id: 3,
        name: "The Desk",
        desc: "Cozy and productive",
        img: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=200",
        ownerName: "Omar Hassan",
        ownerEmail: "omar.hassan@email.com",
        ownerImg: "https://i.pravatar.cc/100?img=33",
        city: "Al-Nuseirat, Gaza",
        submittedAt: "May 9, 2024",
        submittedTime: "11:20 AM",
        status: "Pending"
    },
    {
        id: 4,
        name: "Work Oasis",
        desc: "Spacious & comfortable",
        img: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=200",
        ownerName: "Lina Hamed",
        ownerEmail: "lina.hamed@email.com",
        ownerImg: "https://i.pravatar.cc/100?img=44",
        city: "Al-Maghazi, Gaza",
        submittedAt: "May 8, 2024",
        submittedTime: "9:15 PM",
        status: "Pending"
    },
    {
        id: 5,
        name: "Study Corner",
        desc: "Perfect for students",
        img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=200",
        ownerName: "Yousef Baraka",
        ownerEmail: "yousef.baraka@email.com",
        ownerImg: "https://i.pravatar.cc/100?img=55",
        city: "Gaza City",
        submittedAt: "May 8, 2024",
        submittedTime: "2:10 PM",
        status: "Pending"
    }
];

// ===================== بيانات MANAGE WORKSPACES =====================
const allWorkspaces = [
    {
        id: 1,
        name: "Focus Hub",
        img: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=200",
        ownerName: "Ahmad Owner",
        ownerEmail: "ahmad.owner@example.com",
        ownerImg: "https://i.pravatar.cc/100?img=11",
        city: "Al-Rimal, Gaza",
        status: "Approved",
        createdAt: "May 10, 2024",
        createTime: "10:30 AM"
    },
    {
        id: 2,
        name: "Creative Space",
        img: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=200",
        ownerName: "Sara Ali",
        ownerEmail: "sara.ali@example.com",
        ownerImg: "https://i.pravatar.cc/100?img=20",
        city: "Gaza City",
        status: "Approved",
        createdAt: "May 9, 2024",
        createTime: "04:20 PM"
    },
    {
        id: 3,
        name: "Work Oasis",
        img: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=200",
        ownerName: "Lina Hamad",
        ownerEmail: "lina.hamad@example.com",
        ownerImg: "https://i.pravatar.cc/100?img=44",
        city: "Al-Maghazi, Gaza",
        status: "Pending",
        createdAt: "May 8, 2024",
        createTime: "09:45 AM"
    },
    {
        id: 4,
        name: "Meeting Point",
        img: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=200",
        ownerName: "Mohammed Saleh",
        ownerEmail: "mohammed@example.com",
        ownerImg: "https://i.pravatar.cc/100?img=55",
        city: "Gaza City",
        status: "Rejected",
        createdAt: "May 6, 2024",
        createTime: "02:05 PM"
    },
    {
        id: 5,
        name: "Creative Space",
        img: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=200",
        ownerName: "Sara Ali",
        ownerEmail: "sara.ali@example.com",
        ownerImg: "https://i.pravatar.cc/100?img=20",
        city: "Gaza City",
        status: "Approved",
        createdAt: "May 9, 2024",
        createTime: "04:20 PM"
    }
];

// ===================== بيانات MANAGE REVIEWS (6 مراجعات) =====================
const reviewsData = [
    {
        id: 1,
        userName: "Omar Al-Masri",
        userEmail: "omer@gmail.com",
        userImg: "https://i.pravatar.cc/100?img=12",
        workspace: "Focus Hub",
        workspaceImg: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=200",
        city: "Al-Rimal, Gaza",
        rating: 5.0,
        review: "Amazing place! Very clean and quiet. Highly recommended for remote work.",
        date: "May 10, 2024",
        time: "10:30 AM"
    },
    {
        id: 2,
        userName: "Sara Abu Salim",
        userEmail: "sara@gmail.com",
        userImg: "https://i.pravatar.cc/100?img=20",
        workspace: "The Desk",
        workspaceImg: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=200",
        city: "Al-Nuseirat, Gaza",
        rating: 4.5,
        review: "Great space and good internet. The atmosphere is very productive.",
        date: "May 9, 2024",
        time: "04:20 PM"
    },
    {
        id: 3,
        userName: "Yousef Baraka",
        userEmail: "yousef@gmail.com",
        userImg: "https://i.pravatar.cc/100?img=33",
        workspace: "Creative Space",
        workspaceImg: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=200",
        city: "Gaza City",
        rating: 4.0,
        review: "Very nice coworking space. The staff is friendly and helpful.",
        date: "May 8, 2024",
        time: "09:45 AM"
    },
    {
        id: 4,
        userName: "Omar Al-Masri",
        userEmail: "omer@gmail.com",
        userImg: "https://i.pravatar.cc/100?img=12",
        workspace: "Focus Hub",
        workspaceImg: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=200",
        city: "Al-Rimal, Gaza",
        rating: 5.0,
        review: "Amazing place! Very clean and quiet. Highly recommended for remote work.",
        date: "May 10, 2024",
        time: "10:30 AM"
    },
    {
        id: 5,
        userName: "Sara Abu Salim",
        userEmail: "sara@gmail.com",
        userImg: "https://i.pravatar.cc/100?img=20",
        workspace: "The Desk",
        workspaceImg: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=200",
        city: "Al-Nuseirat, Gaza",
        rating: 4.5,
        review: "Great space and good internet. The atmosphere is very productive.",
        date: "May 9, 2024",
        time: "04:20 PM"
    },
    {
        id: 6,
        userName: "Yousef Baraka",
        userEmail: "yousef@gmail.com",
        userImg: "https://i.pravatar.cc/100?img=33",
        workspace: "Creative Space",
        workspaceImg: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=200",
        city: "Gaza City",
        rating: 4.0,
        review: "Very nice coworking space. The staff is friendly and helpful.",
        date: "May 8, 2024",
        time: "09:45 AM"
    }
];

// ===================== دالة توليد النجوم =====================
function generateStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            stars += '<i class="fa-solid fa-star"></i>';
        } else if (hasHalfStar && i === fullStars + 1) {
            stars += '<i class="fa-solid fa-star-half-stroke"></i>';
        } else {
            stars += '<i class="fa-regular fa-star"></i>';
        }
    }
    return stars;
}

// ===================== عرض PENDING WORKSPACES =====================
function renderPendingWorkspaces() {
    const tbody = document.getElementById("pendingTableBody");
    if (!tbody) return;
    
    let html = "";
    pendingWorkspaces.forEach(w => {
        html += `
            <tr>
                <td class="workspace-cell">
                    <div class="workspace-meta">
                        <img src="${w.img}" class="w-img" alt="${w.name}">
                        <div>
                            <div class="w-name">${w.name}</div>
                            <div class="w-desc">${w.desc}</div>
                        </div>
                    </div>
                  </td>
                  <td>
                    <div class="user-profile">
                        <img src="${w.ownerImg}" class="owner-img" alt="${w.ownerName}">
                        <div>
                            <div class="name">${w.ownerName}</div>
                            <div class="email">${w.ownerEmail}</div>
                        </div>
                    </div>
                  </td>
                  <td>
                    <div class="city">
                        <i class="fa-solid fa-location-dot"></i>
                        ${w.city}
                    </div>
                  </td>
                  <td>
                    <div class="date">${w.submittedAt}</div>
                    <div class="time">${w.submittedTime}</div>
                  </td>
                  <td>
                    <span class="status-badge status-pending">
                        <i class="fa-solid fa-circle"></i> PENDING
                    </span>
                  </td>
                  <td>
                    <div class="actions-cluster">
                        <button class="action-btn" onclick="alert('View workspace ${w.id}')">
                            <i class="fa-solid fa-eye"></i> View
                        </button>
                        <button class="action-btn" onclick="alert('Approved ${w.name}')">
                            <i class="fa-solid fa-check"></i> Approve
                        </button>
                        <button class="action-btn" onclick="alert('Rejected ${w.name}')">
                            <i class="fa-solid fa-xmark"></i> Reject
                        </button>
                    </div>
                  </td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
}

// ===================== عرض MANAGE WORKSPACES =====================
function renderManageWorkspaces() {
    const tbody = document.getElementById("workspacesTableBody");
    if (!tbody) return;
    
    let html = "";
    allWorkspaces.forEach(w => {
        let statusClass = "";
        if (w.status === "Approved") statusClass = "status-approved";
        else if (w.status === "Pending") statusClass = "status-pending";
        else if (w.status === "Rejected") statusClass = "status-rejected";
        
        html += `
            <tr>
                <td class="workspace-cell">
                    <div class="workspace-meta">
                        <img src="${w.img}" class="w-img" alt="${w.name}">
                        <div>
                            <div class="w-name">${w.name}</div>
                        </div>
                    </div>
                  </td>
                  <td>
                    <div class="user-profile">
                        <img src="${w.ownerImg}" class="owner-img" alt="${w.ownerName}">
                        <div>
                            <div class="name">${w.ownerName}</div>
                            <div class="email">${w.ownerEmail}</div>
                        </div>
                    </div>
                  </td>
                  <td>${w.city}</td>
                  <td>
                    <span class="status-badge ${statusClass}">
                        <i class="fa-solid fa-circle"></i> ${w.status}
                    </span>
                  </td>
                  <td>
                    <div class="date">${w.createdAt}</div>
                    <div class="time">${w.createTime}</div>
                  </td>
                  <td>
                    <div class="actions-cluster">
                        <button class="action-btn" onclick="alert('View workspace ${w.id}')">
                            <i class="fa-solid fa-eye"></i> View
                        </button>
                        <button class="action-btn" onclick="alert('Delete workspace ${w.id}')">
                            <i class="fa-solid fa-trash"></i> Delete
                        </button>
                    </div>
                  </td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
}

// ===================== عرض MANAGE REVIEWS =====================
function renderReviews() {
    const tbody = document.getElementById("reviewsTableBody");
    if (!tbody) return;
    
    let html = "";
    reviewsData.forEach(r => {
        html += `
            <tr>
                <td>
                    <div class="user-profile">
                        <img src="${r.userImg}" class="owner-img" alt="${r.userName}">
                        <div>
                            <div class="name">${r.userName}</div>
                            <div class="email">${r.userEmail}</div>
                        </div>
                    </div>
                  </td>
                  <td>
                    <div class="workspace-meta">
                        <img src="${r.workspaceImg}" class="w-img" alt="${r.workspace}">
                        <div>
                            <div class="w-name">${r.workspace}</div>
                            <div class="city">
                                <i class="fa-solid fa-location-dot"></i>
                                ${r.city}
                            </div>
                        </div>
                    </div>
                  </td>
                  <td>
                    <div class="rating-box">
                        <div class="stars">${generateStars(r.rating)}</div>
                        <div class="rating-number">${r.rating}</div>
                    </div>
                  </td>
                  <td>
                    <div class="review-text">${r.review.substring(0, 50)}...</div>
                  </td>
                  <td>
                    <div class="date">${r.date}</div>
                    <div class="time">${r.time}</div>
                  </td>
                  <td>
                    <div class="actions-cluster">
                        <button class="action-btn" onclick="alert('View review ${r.id}')">
                            <i class="fa-solid fa-eye"></i> View
                        </button>
                        <button class="action-btn" onclick="alert('Delete review ${r.id}')">
                            <i class="fa-solid fa-trash"></i> Delete
                        </button>
                    </div>
                  </td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
}

// ===================== تحديث البادج =====================
function updateBadge() {
    const pendingCount = pendingWorkspaces.length;
    document.querySelectorAll('.badge').forEach(badge => {
        badge.textContent = pendingCount;
    });
}

// ===================== التهيئة =====================
document.addEventListener("DOMContentLoaded", () => {
    updateBadge();
    renderPendingWorkspaces();
    renderManageWorkspaces();
    renderReviews();
});