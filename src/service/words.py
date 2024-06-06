# words =  [
#     'Saphnelo'
# ]
import os
import unicodedata
import re

dicionario = {
    'a': [],
    'b': [],
    'c': [],
    'd': [],
    'e': [],
    'f': [],
    'g': [],
    'h': [],
    'i': [],
    'j': [],
    'k': [],
    'l': [],
    'm': [],
    'n': [],
    'o': [],
    'p': [],
    'q': [],
    'r': [],
    's': [],
    't': [],
    'u': [],
    'v': [],
    'w': [],
    'x': [],
    'y': [],
    'z': []
}


file = os.path.join(os.path.dirname(__file__), 'palavras.txt')
words = []


def sanitize(word):
    word = word.lower().strip()

    word = unicodedata.normalize('NFD', word)
    word = word.encode('ascii', 'ignore').decode('utf-8')
    
    word = re.sub(r'[^a-z0-9\s]', '', word)
    
    return word


with open(file, 'r', encoding='utf-8') as f:
    for line in f:
        sanitized_line = sanitize(line)
        words.append(sanitized_line)

        first_char = sanitize(line[0])
        dicionario[first_char].append(sanitized_line)

def getWords():
    return words


def getWordsFromLetter(letter):
    return dicionario[letter] if letter in dicionario else []


def getWordsFromTwoLetters(letter1, letter2):
    return dicionario[letter1] + dicionario[letter2] if letter1 in dicionario and letter2 in dicionario else []