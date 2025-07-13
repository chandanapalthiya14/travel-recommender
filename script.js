document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("recommender-form");
    const resultsDiv = document.getElementById("destination-cards");

    // Populate dropdowns
    fetch('/get_options')
        .then(res => res.json())
        .then(data => {
            data.countries.forEach(c => {
                const opt = document.createElement("option");
                opt.value = c;
                opt.text = c;
                document.getElementById("country").appendChild(opt);
            });
            data.categories.forEach(c => {
                const opt = document.createElement("option");
                opt.value = c;
                opt.text = c;
                document.getElementById("category").appendChild(opt);
            });
            data.ratings.forEach(c => {
                const opt = document.createElement("option");
                opt.value = c;
                opt.text = c;
                document.getElementById("rating").appendChild(opt);
            });
        })
        .catch(err => {
            console.error("Failed to fetch options:", err);
        });

    // Handle form submission
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const formData = new FormData(form);

        fetch("/recommend", {
            method: "POST",
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                resultsDiv.innerHTML = "";
                if (data.length === 0) {
                    resultsDiv.innerHTML = "<p>No results found. Try changing filters.</p>";
                }
                data.forEach(dest => {
                    const card = document.createElement("div");
                    card.className = "card";
                    card.innerHTML = `
                       <img src="https://source.unsplash.com/300x150/?${dest.Category},${dest.Country}" alt="">

                        <div class="info">
                            <h3>${dest.Country}</h3>
                            <p><strong>Category:</strong> ${dest.Category}</p>
                            <p><strong>Visitors:</strong> ${dest.Visitors}</p>
                            <p><strong>Revenue:</strong> $${parseFloat(dest.Revenue).toLocaleString()}</p>
                            <p><strong>Rating:</strong> ${dest.Rating}</p>
                            <p><strong>Accommodation:</strong> ${dest.Accommodation_Available}</p>
                        </div>`;
                    resultsDiv.appendChild(card);
                });
            })
            .catch(err => {
                console.error("Error in recommendation:", err);
            });
    });
});
