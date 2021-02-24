# include unrelated dictionary words in train tsv file

import re

with open('train4-remove-labels.tsv') as f, open('train4-remove-labels-2.tsv', 'w') as fout:
    for line in f:
        changed_line = line.strip()
        fout.write(changed_line + '\n')

with open('train4-remove-labels-2.tsv') as file:
    contents = file.read()

# words-alpha.txt contains a dictionary of words
with open('words_alpha.txt') as fin, open('train-out.tsv', 'w') as fout:
    for line in fin:
        changed_line = line
        if not (changed_line in contents):
            fout.write(changed_line)

with open('train-out.tsv') as fin, open('train-out-space.tsv', 'w') as fout:
    for line in fin:
        line = line.replace('\n', '')
        changed_line = line + '\tO\n'
        fout.write(changed_line + '\n')