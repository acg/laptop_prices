#!/usr/bin/env python

# filter out all points with y-coordinate more than
# stdbound standard deviations from the mean

import sys
import numpy
import scipy
import getopt

stdbound = 2
passes = 2
meanbound = 3

optlist, args = getopt.getopt(sys.argv[1:], 's:c:m:')
for opt, value in optlist:
  if opt == '-s':
    stdbound = int(value)
  elif opt == '-m':
    meanbound = int(value)
  elif opt == '-c':
    passes = int(value)

f = file(args[0]) if len(args) else sys.stdin
a = [ line.strip().split(' ', 2) for line in f ]
a = [ [ int(p[0]), int(p[1]), p[2] ] for p in a ]

for n in range(passes):
  y = [ p[1] for p in a ]
  m = numpy.mean(y)
  s = numpy.std(y)
  print >> sys.stderr, "m = %f, s = %f" % (m,s)
  a = filter( lambda p: (abs(p[1] - m) < stdbound*s) and (p[1] < meanbound*m) and (p[1] > meanbound/m), a )

for p in a:
  print "%d %d %s" % tuple(p)

