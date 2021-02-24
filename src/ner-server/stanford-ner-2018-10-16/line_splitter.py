# split HEALTH fields into separate words, 1 word per line

with open('test-health-space.tsv') as fin, open('test-health2.tsv', 'w') as fout:
    for line in fin:
        # convert to lowercase
        changed_line = line
        if (' ' in line):
            # change field of 2 words into 2 separate fields
            separate_line = line.replace(' ', '\tHEALTH\n\n')
            changed_line = separate_line
        fout.write(changed_line)

# don't include lines that are only tab + HEALTH
with open('test-health2.tsv') as fin, open('test-health3.tsv', 'w') as fout:
    for line in fin:
        if (line != '\tHEALTH\n'):
            fout.write(line)