#!/bin/sh

# Put this in the directory in which you extracted the STANFORD NER package.

# Configure classifiers and port to your need

# java -mx1000m -cp "*" edu.stanford.nlp.ie.NERServer  -loadClassifier ./classifiers/english.muc.7class.distsim.crf.ser.gz -port 3000 -outputFormat inlineXML

# java -cp "*" edu.stanford.nlp.ie.NERServer -port 9191 -loadClassifier ./classifiers/english.muc.7class.distsim.crf.ser.gz  -tokenizerFactory edu.stanford.nlp.process.WhitespaceTokenizer -tokenizerOptions tokenizeNLs=false -outputFormat slashTags
# use custom trained model instead
java -cp "*" edu.stanford.nlp.ie.NERServer -port 9191 -loadClassifier ner-model.ser.gz -tokenizerFactory edu.stanford.nlp.process.WhitespaceTokenizer -tokenizerOptions tokenizeNLs=false -outputFormat slashTags
