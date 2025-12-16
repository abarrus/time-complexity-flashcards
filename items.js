export const O = {
    CONSTANT: "1",
    LINEAR: "n",
    LOGARITHMIC: "log(n)",
    QUADRATIC: "n^2",
    LINEARITHMIC: "n log(n)"
}

export const Type = {
    COLLECTION: 0,
    SORT: 1
}

export class Collection {
    constructor(insert, remove=insert, access=insert, search=insert) {
        this.insert = insert;
        this.remove = remove;
        this.access = access;
        this.search = search;
    }

    getInsert() {
        return this.insert;
    }

    getRemove() {
        return this.remove;
    }

    getAccess() {
        return this.access;
    }

    getSearch() {
        return this.search;
    }

    getLabels() {
        return ["Insert", "Remove", "Access", "Search"];
    }
}

export class SortAlgorithm {
    constructor(best, worst=best, average=best) {
        this.best = best;
        this.worst = worst;
        this.average = average;
    }

    getBest() {
        return this.best;
    }

    getWorst() {
        return this.worst;
    }

    getAverage() {
        return this.average;
    }

    getLabels() {
        return ["Best", "Worst", "Average"];
    }
}

export class Item {
    constructor(name, type, complexity) {
        this.name = name;
        this.type = type;
        // complexity is either a Collection or SearchAlgorithm
        this.complexity = complexity;
    }

    /**
     * 
     * @param {string[]} labels 
     * @returns {string[]} values
     */
    makeTableRow(labels) {
        const items = [this.name];
        labels.forEach(label => {
            const value = this.complexity["get"+label]();
            items.push(value);
        });
        return items;
    }
}