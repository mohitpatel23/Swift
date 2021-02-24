# place a space between every line of file to train each word as a document
import re
with open('test-it.tsv') as fin, open('test-it-space.tsv', 'w') as fout:
    for line in fin:
        # change to lowercase if necessary and add newline
        # changed_line = line.lower() + '\n'
        changed_line = line + '\n'
        fout.write(changed_line)