import random
import nltk
import json
import numpy as num
from nltk.stem import WordNetLemmatizer
import pickle
import tensorflow as tf


newWords = pickle.load(open("chatbot/new_words.pkl", "rb"))
ourClasses = pickle.load(open("chatbot/our_classes.pkl", "rb"))
lm = WordNetLemmatizer()

with open('chatbot/intents.json') as f:
    data = json.load(f)


def ourText(text):
    newtkns = nltk.word_tokenize(text)
    newtkns = [lm.lemmatize(word) for word in newtkns]
    return newtkns


def wordBag(text, vocab):
    newtkns = ourText(text)
    bagOwords = [0] * len(vocab)
    for w in newtkns:
        for idx, word in enumerate(vocab):
            if word == w:
                bagOwords[idx] = 1
    return num.array(bagOwords)


def Pclass(text, vocab, labels):
    bagOwords = wordBag(text, vocab)
    model = tf.keras.models.load_model('chatbot/model.h5')
    ourResult = model.predict(num.array([bagOwords]))[0]
    newThresh = 0.8
    yp = [[idx, res] for idx, res in enumerate(ourResult) if res > newThresh]

    yp.sort(key=lambda x: x[1], reverse=True)
    newList = []
    for r in yp:
        newList.append(labels[r[0]])
    return newList


def getRes(firstlist, fJson):
    tag = firstlist[0]
    listOfIntents = fJson["intents"]
    for i in listOfIntents:
        if i["tag"] == tag:
            ourResult = random.choice(i["responses"])
            break
    return ourResult


def send_response(receive_message):
    intents = Pclass(receive_message, newWords, ourClasses)
    our_result = getRes(intents, data)
    return our_result
