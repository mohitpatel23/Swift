# categorize the words 'the' and 'and' in health as unlabeled
# place a space between every line of file to train each word as a document
import re
with open('test2.tsv') as fin, open('test3.tsv', 'w') as fout:
    for line in fin:
        changed_line = line
        if (line == 'and\tHEALTH\n'):
            changed_line = 'and\tO\n'
        if (line == 'the\tHEALTH\n'):
            changed_line = 'the\tO\n'
        fout.write(changed_line)