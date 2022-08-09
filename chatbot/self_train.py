import json
import string
import random
import nltk
import numpy as num
from nltk.stem import WordNetLemmatizer
import tensorflow as tf
from tensorflow.keras import Sequential
from tensorflow.keras.layers import Dense, Dropout
import pickle

# nltk.download("all")

lm = WordNetLemmatizer()

ourClasses = []
newWords = []
documentX = []
documentY = []

with open('intents.json') as f:
    data = json.load(f)

for intent in data["intents"]:
    for pattern in intent["patterns"]:
        ournewTkns = nltk.word_tokenize(pattern)
        newWords.extend(ournewTkns)
        documentX.append(pattern)
        documentY.append(intent["tag"])

    if intent["tag"] not in ourClasses:
        ourClasses.append(intent["tag"])

newWords = [lm.lemmatize(word.lower()) for word in newWords if
            word not in string.punctuation]
newWords = sorted(set(newWords))
ourClasses = sorted(set(ourClasses))

pickle.dump(newWords, open("new_words.pkl", "wb"))
pickle.dump(ourClasses, open("our_classes.pkl", "wb"))

trainingData = []
outEmpty = [0] * len(ourClasses)

for idx, doc in enumerate(documentX):
    bagOfwords = []
    text = lm.lemmatize(doc.lower())
    for word in newWords:
        bagOfwords.append(1) if word in text else bagOfwords.append(0)

    outputRow = list(outEmpty)
    outputRow[ourClasses.index(documentY[idx])] = 1
    trainingData.append([bagOfwords, outputRow])

random.shuffle(trainingData)
trainingData = num.array(trainingData, dtype=object)

x = num.array(list(trainingData[:, 0]))
y = num.array(list(trainingData[:, 1]))

iShape = (len(x[0]),)
oShape = len(y[0])

model = Sequential()

model.add(Dense(128, input_shape=iShape, activation="relu"))
model.add(Dropout(0.5))

model.add(Dense(64, activation="relu"))
model.add(Dropout(0.3))
model.add(Dense(oShape, activation="softmax"))

md = tf.keras.optimizers.Adam(learning_rate=0.01, decay=1e-6)

model.compile(loss='categorical_crossentropy',
                    optimizer=md,
                    metrics=["accuracy"])

print(model.summary())

model.fit(x, y, epochs=200, verbose=1)

model.save('model.h5')

