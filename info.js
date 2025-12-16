import { O, Type, Collection, SortAlgorithm, Item } from "./items.js"

export const collections = [
    new Item("HashMap", Type.COLLECTION, new Collection(
        O.CONSTANT
    )),
    new Item("set()", Type.COLLECTION, new Collection(
        O.CONSTANT
    )),
    new Item("dict()", Type.COLLECTION, new Collection(
        O.CONSTANT
    )),
    new Item("ArrayList", Type.COLLECTION, new Collection(
        O.LINEAR, O.LINEAR, O.CONSTANT, O.LINEAR
    )),
    new Item("TreeSet", Type.COLLECTION, new Collection(
        O.LOGARITHMIC
    )),
    new Item("Binary Search Tree", Type.COLLECTION, new Collection(
        O.LOGARITHMIC
    )),
    new Item("Heap", Type.COLLECTION, new Collection(
        O.LOGARITHMIC, O.LINEAR, O.LINEAR, O.LINEAR
    )),
    new Item("Queue", Type.COLLECTION, new Collection(
        O.CONSTANT, O.CONSTANT, O.CONSTANT, O.LINEAR
    ))
]

export const sortingAlgorithms = [
    new Item("Selection Sort", Type.SORT, new SortAlgorithm(
        O.QUADRATIC
    )),
    new Item("Insertion Sort", Type.SORT, new SortAlgorithm(
        O.QUADRATIC, O.LINEAR, O.QUADRATIC
    )),
    new Item("Merge Sort", Type.SORT, new SortAlgorithm(
        O.LINEARITHMIC
    )),
    new Item("Quicksort", Type.SORT, new SortAlgorithm(
        O.QUADRATIC, O.LINEARITHMIC, O.LINEARITHMIC
    )),
]