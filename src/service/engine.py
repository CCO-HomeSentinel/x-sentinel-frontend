from .words import getWords, getWordsFromLetter

def levenshtein_distance(s1, s2):
    size_x = len(s1) + 1
    size_y = len(s2) + 1
    matrix = [[0] * size_y for _ in range(size_x)]
    for x in range(size_x):
        matrix [x][0] = x
    for y in range(size_y):
        matrix [0][y] = y

    for x in range(1, size_x):
        for y in range(1, size_y):
            if s1[x-1] == s2[y-1]:
                matrix [x][y] = min(
                    matrix[x-1][y] + 1,
                    matrix[x-1][y-1],
                    matrix[x][y-1] + 1
                )
            else:
                matrix [x][y] = min(
                    matrix[x-1][y] + 1,
                    matrix[x-1][y-1] + 1,
                    matrix[x][y-1] + 1
                )
    return matrix[size_x - 1][size_y - 1]

def calculate(s1): 
    words = getWordsFromLetter(s1[0])
    results = []
    is_zero = False

    for word in words:
        if abs(len(s1) - len(word)) <= 3:
            distance = levenshtein_distance(s1, word)
            if distance == 0:
                results.append(word)
                is_zero = True
            if distance == 1:
                results.append(word)

    return results, is_zero