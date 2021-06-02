#!/usr/bin/python
import re
import sys

html = []
title = ''
for line in sys.stdin:
  line = re.sub('Generated.*by ', 'Generated by ', line)
  line = re.sub('"_timestamp":\d+, *', '', line)
  html.append(line)
  if re.search('</html>', line):
    filename = title.lower().replace(' ', '-') + '.html'
    print 'Writing ' + filename
    with open(filename, 'w') as f:
      f.writelines(html)
    html = []
  elif '<title>' in line:
    title = re.search('<title>([^<]*)', line).group(1)
