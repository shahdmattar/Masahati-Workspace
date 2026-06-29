/* =========================
   HOME PAGE LOADER
========================= */

document.addEventListener("DOMContentLoaded", () => {
    loadHome();
});


/* =========================
   LOAD HOME DATA FROM BACKEND
========================= */

async function loadHome() {
    try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost/Masahati-Workspace/backend/api/workspaces/home.php", {
            headers: token ? { Authorization: "Bearer " + token } : {}
        });

        // If backend returns HTML error -> this will catch it
        const text = await res.text();

        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            console.error("Backend did not return JSON:", text);
            return;
        }

        if (!data.success) {
            console.error("API error:", data.message);
            return;
        }

        renderStats(data.data.stats);
        renderWorkspaces(data.data.top_workspaces);

    } catch (err) {
        console.error("Home error:", err);
    }
}


/* =========================
   STATS RENDER
========================= */

function renderStats(stats) {
    document.getElementById("statWorkspaces").textContent = stats.workspaces + "+";
    document.getElementById("statUsers").textContent = stats.users + "+";
    document.getElementById("statRating").textContent = stats.average_rating;
    document.getElementById("statSatisfaction").textContent = stats.satisfaction + "%";
}


/* =========================
   RENDER WORKSPACE CARDS 
========================= */
function formatTime(time) {
    if (!time) return "";

    let [h, m] = time.split(":");
    h = parseInt(h);
    m = parseInt(m);

    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;

    const minutes = m === 0 ? "" : `:${m.toString().padStart(2, "0")}`;

    return `${h}${minutes} ${ampm}`;
}
function renderWorkspaces(workspaces) {

    const grid = document.getElementById("workspaceGrid");
    const template = document.getElementById("workspaceTemplate");

    grid.innerHTML = "";

    workspaces.forEach((ws) => {

        const clone = template.content.cloneNode(true);

        /* IMAGE */
        const img = ws.images?.[0];

        clone.querySelector("img").src =
            img || "assets/images/work-hub.png";
        /* TITLE */
        clone.querySelector("h3").textContent = ws.workspace_name;

        /* RATING */
        clone.querySelector(".rating span").textContent =
            `${ws.avg_rating || 0} (${ws.total_reviews || 0})`;

        /* LOCATION */
        clone.querySelector(".location").innerHTML =
            `<i class="fa-solid fa-location-dot"></i> ${ws.area}, ${ws.city}`;

        /* STATUS */
        const statusEl = clone.querySelector(".status");

        if (ws.electricity_status === "Not Available") {

            statusEl.classList.add("status-not-available");
            statusEl.innerHTML = `<i class="fa-solid fa-bolt"></i> Not Available`;
        } else {
            statusEl.classList.add("status-available");
            statusEl.innerHTML = `<i class="fa-solid fa-bolt"></i> Available`;
        }

        /* INTERNET */
        clone.querySelector(".internet").innerHTML =
            `<i class="fa-solid fa-wifi"></i> ${ws.internet_quality}`;

        /* SEATS */
        clone.querySelector(".seats").innerHTML =
            `<i class="fa-solid fa-chair"></i> ${ws.seating} Seats`;

        /* HOURS */
        clone.querySelector(".hours").innerHTML =
            `<i class="fa-regular fa-clock"></i> ${formatTime(ws.hours_from)} - ${formatTime(ws.hours_to)}`;

        /* DETAILS LINK */
        clone.querySelector(".details-btn").href =
            `pages/workspace-details.html?workspace_id=${ws.id}`;

        /* FAVORITE */
        const favBtn = clone.querySelector(".favorite-btn");
        const icon = favBtn.querySelector("i");

        favBtn.dataset.id = ws.id;

        if (ws.is_favorite == 1) {
            favBtn.classList.add("is-favorite");
            icon.classList.remove("fa-regular");
            icon.classList.add("fa-solid");
        }

        grid.appendChild(clone);
    });

    attachFavoriteEvents();
}
/* =========================
   FAVORITE TOGGLE
========================= */

function attachFavoriteEvents() {
    document.querySelectorAll(".favorite-btn").forEach((btn) => {

        btn.addEventListener("click", async (e) => {
            e.stopPropagation();

            const id = btn.dataset.id;
            const icon = btn.querySelector("i");
            const token = localStorage.getItem("token");

            if (!token) {
                alert("Please login first");
                return;
            }

            try {
                const res = await fetch(
                    "http://localhost/Masahati-Workspace/backend/api/favorites/toggle.php",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: "Bearer " + token
                        },
                        body: JSON.stringify({ workspace_id: id })
                    }
                );

                const data = await res.json();

                if (data.success) {
                    icon.classList.toggle("fa-solid");
                    icon.classList.toggle("fa-regular");
                    btn.classList.toggle("is-favorite");
                }

            } catch (err) {
                console.error(err);
            }
        });

    });
}
