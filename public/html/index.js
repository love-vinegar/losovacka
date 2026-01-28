const people = [];

const list = document.getElementById("list");
const button = document.getElementById("shuffleBtn");

function render(data, disappearing) {
    list.innerHTML = "";

    data.forEach((p, index) => {
        const row = document.createElement("div");
        row.className = "row";

        const nameInput = document.createElement("input");
        nameInput.value = p.name;
        nameInput.placeholder = "Name";
        nameInput.oninput = e => data[index].name = e.target.value;

        const giftCell = document.createElement("div");
        giftCell.className = "gift-cell";
        if(disappearing) {
            giftCell.className += " disappearing";
        }

        function renderGift(value) {
            giftCell.innerHTML = "";

            if (!value) {
                renderGiftInput("");
                return;
            }

            const link = document.createElement("a");
            link.href = `https://jira-agile.oskarmobil.cz/browse/${value}`;
            link.textContent = value;

            link.onclick = e => {
                e.preventDefault();
                renderGiftInput(value);
            };

            giftCell.appendChild(link);
        }

        function renderGiftInput(value) {
            giftCell.innerHTML = "";

            const input = document.createElement("input");

            input.href = `https://jira-agile.oskarmobil.cz/browse/${value}`;
            input.textContent = value;

            input.onchange = e => {
                const val = e.target.value.toUpperCase().trim();
                data[index].giftId = val;
                renderGift(val);
            };

            giftCell.appendChild(input);
            input.focus();
        }

        if (p.giftId) renderGift(p.giftId);
        else renderGiftInput("");

        row.appendChild(nameInput);
        row.appendChild(giftCell);
        list.appendChild(row);
    });
}

document.getElementById("addBtn").addEventListener("click", () => {
    people.push({
        name: "",
        giftId: ""
    });
    render(people, false);
});

function derangedShuffle(array) {
    let shuffled;
    do {
        shuffled = [...array].sort(() => Math.random() - 0.5);
    } while (shuffled.some((v, i) => v === array[i]));
    return shuffled;
}

button.addEventListener("click", () => {
    button.disabled = true;

    const gifts = [...document.querySelectorAll(".gift-cell")];
    const firstRects = new Map();

    gifts.forEach(g => {
        firstRects.set(g, g.getBoundingClientRect());
        g.classList.add("disappearing");
    });

    const ids = people.map(p => p.giftId);
    const shuffledIds = derangedShuffle(ids);
    people.forEach((p, i) => (p.giftId = shuffledIds[i]));

    setTimeout(() => {
        render(people, true);
    }, 250);
    button.disabled = false;

    setTimeout(() => {
        const gifts = [...document.querySelectorAll(".gift-cell")];
        gifts.forEach(g => {
            g.classList.remove("disappearing");
        });
    }, 1500);
});

render(people, false);
