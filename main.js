import { collections, sortingAlgorithms } from "./info.js";

let headersCollections;
let headersSort;

// for flashcards
let showingBack;
let deck = [];

// --------------------------
// --------- MAIN
// --------------------------

function main() {
    const collectionsButtons = document.getElementById("collections-buttons")
    const sortAlgorithmButtons = document.getElementById("sort-algorithm-buttons");

    collectionsButtons.addEventListener("click", updateCollections);
    sortAlgorithmButtons.addEventListener("click", updateSortAlgorithms);

    addButtons(collectionsButtons, collections);
    addButtons(sortAlgorithmButtons, sortingAlgorithms);

    updateCollections();
    updateSortAlgorithms();

    document.getElementById("study-btn").addEventListener("click", study);
}

window.addEventListener("DOMContentLoaded", main);

function study() {
    blockFillTable();

    // reset deck
    deck = [];

    let studyDiv = document.getElementById("study-area");
    if (!studyDiv) {
        studyDiv = document.createElement("div");
        studyDiv.id = "study-area";
        document.body.appendChild(studyDiv);
    }

    studyDiv.innerHTML = "<h3>Flashcards</h3>";

    makeCollectionsCards();
    makeSortingCards();

    // shuffle deck
    deck = deck.sort(() => Math.random() - 0.5);

    if (deck.length === 0) {
        studyDiv.innerHTML += "<p>No cards selected.</p>";
        return;
    }

    // UI
    const card = document.createElement("div");
    card.id = "flashcard";

    const text = document.createElement("div");
    card.appendChild(text);

    const yesBtn = document.createElement("button");
    yesBtn.textContent = "Got it";
    yesBtn.classList.add("btn", "btn-success");

    const noBtn = document.createElement("button");
    noBtn.textContent = "Missed it";
    noBtn.classList.add("btn", "btn-danger");

    studyDiv.appendChild(card);
    studyDiv.appendChild(yesBtn);
    studyDiv.appendChild(noBtn);

    showingBack = true;

    function render() {
        if (deck.length === 0) {
            text.textContent = "Done 🎉";
            yesBtn.disabled = true;
            noBtn.disabled = true;
            return;
        }

        showingBack = true;
        text.textContent = deck[0].front;
    }

    function flip() {
        updateFlashcardText()
        showingBack = !showingBack;
    }
    card.onclick = flip;

    yesBtn.onclick = () => {
        const cellElem = document.getElementById(deck[0].id);
        cellElem.classList.remove("blacked-out");
        cellElem.classList.remove("got-wrong");
        deck.shift(); // remove card
        render();
    };

    noBtn.onclick = () => {
        const cellElem = document.getElementById(deck[0].id);
        cellElem.classList.add("got-wrong");
        const card = deck.shift();
        const index = Math.min(2, deck.length);
        deck.splice(index, 0, card);
        render();
    };

    render();
}

function makeCollectionsCards() {
    collections.forEach(item => {
        if (!document.getElementById(item.name)?.checked) return;

        headersCollections.forEach(label => {
            if (label == "Name") return;
            deck.push({
                front: `${item.name} ${label}`,
                back: item.complexity["get"+label](),
                id: `${item.name}-${label}`
            });
        });
    });
}

function makeSortingCards() {
    sortingAlgorithms.forEach(item => {
        if (!document.getElementById(item.name)?.checked) return;

        headersSort.forEach(label => {
            if (label == "Name") return;

            deck.push({
                front: `${item.name} ${label}`,
                back: item.complexity["get"+label](),
                id: `${item.name}-${label}`
            });
        });
    });
}

function updateFlashcardText() {
    const front = document.createElement("p");
    const frontText = document.createTextNode(deck[0].front);
    front.appendChild(frontText);

    const card = document.getElementById("flashcard");
    card.innerHTML = "";
    card.appendChild(front)

    if (showingBack) {
        const divider = document.createElement("hr");

        const back = document.createElement("p");
        const backText = document.createTextNode(deck[0].back);
        back.appendChild(backText);

        card.appendChild(divider);
        card.appendChild(back);
    }
}

/**
 * 
 * @param {HTMLElement} elem 
 * @param {Item[]} list 
 */
function addButtons(elem, list) {
    list.forEach(item => {
        const name = item.name;
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("btn-check")
        checkbox.id = name;
        checkbox.checked = true;

        const label = document.createElement("label");
        label.classList.add("btn");
        label.classList.add("btn-outline-dark");
        label.htmlFor = name;
        const text = document.createTextNode(name);
        label.appendChild(text);

        elem.appendChild(checkbox);
        elem.appendChild(label);
        elem.appendChild(document.createElement("br"));
    })
}

// --------------------------
// ------ BLOCK FILL TABLE
// --------------------------

function blockFillTable() {
    collections.forEach(item => {
        if (!document.getElementById(item.name).checked) return;
        headersCollections.forEach(header => {
            if (header == "Name") return;
            const id = item.name + "-" + header;
            const elem = document.getElementById(id);
            elem.classList.add("blacked-out");
        })
    });

    sortingAlgorithms.forEach(item => {
        if (!document.getElementById(item.name).checked) return;
        headersSort.forEach(header => {
            if (header == "Name") return;
            const id = item.name + "-" + header;
            const elem = document.getElementById(id);
            elem.classList.add("blacked-out");
        })
    })
}

// --------------------------
// ------ UPDATE & MAKE TABLE
// --------------------------

function updateCollections() {
    update(
        "collections",
        collections,
        ["Insert", "Remove", "Access", "Search"]
    );
}

function updateSortAlgorithms() {
    update(
        "sorting-algorithms",
        sortingAlgorithms,
        ["Best", "Worst", "Average"],
    );
}

function update(id, list, labels) {
    const div = document.getElementById(id);
    div.innerHTML = ''; // clear previous tables
    const table = makeTable(list, labels, id);
    div.appendChild(table);
}

function makeTable(items, labels, type) {
    const enabled = {};
    const headers = ["Name"];

    labels.forEach(key => {
        enabled[key] = document.getElementById(key).checked;
        if (enabled[key]) headers.push(key);
    });

    if (type === "collections") {
        headersCollections = headers;
    } else {
        headersSort = headers;
    }

    items = items.filter(item => document.getElementById(item.name)?.checked);

    const itemsText = items.map(item =>
        item.makeTableRow(labels.filter(k => enabled[k]))
    );

    return makeTableFromText(headers, itemsText);
}

/**
 * @param {string[]} headersText 
 * @param {string[][]} items 
 * @returns HTML DOM element for the table
 */
function makeTableFromText(headersText, items) {
    const table = document.createElement("table");
    // make headers
    const headers = makeRow("th", headersText, headersText);
    table.appendChild(headers);

    // make table content
    items.forEach(item => {
        table.appendChild(makeRow("td", item, headersText));
    });

    return table;
}

/**
 * 
 * @param {string} type "th" or "td"
 * @param {string[]} items 
 * @param {string} id
 * @returns HTML DOM element for the row
 */
function makeRow(type, items, labels) {
    const container = document.createElement("tr");
    for (let i = 0; i < items.length; i++) {
        const text = items[i];
        const elem = document.createElement(type);
        elem.id = items[0]+'-'+labels[i];
        const textNode = document.createTextNode(text);
        elem.appendChild(textNode);
        container.appendChild(elem);
    }
    items.forEach(text => {
    });
    return container;
}