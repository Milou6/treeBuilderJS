class Queue:
    def __init__(self):
        self.items = []

    # def is_empty(self):
    def est_vide(self):
        return self.items == []

    def enqueue(self, item):
        self.items.insert(0, item)

    def dequeue(self):
        return self.items.pop()

    def size(self):
        return len(self.items)

    # def pop(self, item):
    #     stock = []
    #     while self.est_vide() == False:
    #         stock.insert(len(stock) - 1, self.dequeue())
    #     elem = stock.pop()
    #     while elem != item:
    #         self.items.insert(0, elem)
    #         elem = stock.pop()
    #     while stock != []:
    #         self.items.insert(0, stock.pop())
    #     return item

    # sophia C
    def pop(self, item):
        for i in range(0, self.size()):
            if self.items[-1] == item:
                self.dequeue()
                return item
            else:
                self.enqueue(self.dequeue())
            # i += 1
            # return item


myQueue = Queue()
myQueue.enqueue(1)
myQueue.enqueue(2)
myQueue.enqueue(3)

print(myQueue.items)
print(myQueue.pop(2))
print(myQueue.items)


def recurse_counter(iterations):
    counter = 0
    counter += 1
    print('counter: ' + str(counter))
    if(iterations > 0):
        recurse_counter(iterations-1)


# recurse_counter(10)


class Tree:
    def __init__(self, data):
        self.data = data
        self.leftChild = None
        self.rightChild = None

    def search(self, tree, count=0):
        if tree.leftChild == None and tree.rightChild == None:
            count = count + 1
        elif tree.leftChild != None:
            self.search(tree.leftChild, count)
        elif tree.rightChild != None:
            self.search(tree.rightChild, count)
        print(count)
        return count


myTree = Tree(1)
a = Tree(2)
b = Tree(3)
c = Tree(4)
d = Tree(5)

myTree.leftChild = a
myTree.rightChild = b

a.leftChild = c
a.rightChild = d

# print(myTree.search(myTree, 0))


class Node:
    def __init__(self, data):
        self.data = data
        self.left = None
        self.right = None


def getLeafCount(node):
    if node is None:
        return 0
    if(node.left is None and node.right is None):
        return 1
    else:
        return getLeafCount(node.left) + getLeafCount(node.right)


root = Node(1)
root.left = Node(2)
root.right = Node(3)
root.left.left = Node(4)
root.left.right = Node(5)
root.left.left.left = Node(6)
root.left.left.right = Node(7)
root.left.right = Node(8)
root.right.left = Node(9)
root.right.right = Node(10)
root.right.right.right = Node(11)
print("Leaf count of the tree is %d" % (getLeafCount(root)))


# Francois
def calcul_feuille(arbre):
    count = 0
    while arbre.leftChild != None and arbre.rightChild != None:
        if arbre.leftChild:
            calcul_feuille(arbre.leftChild)
        if arbre.rightChild:
            calcul_feuille(arbre.rightChild)
        count += 1
    return count


print(calcul_feuille(myTree))
