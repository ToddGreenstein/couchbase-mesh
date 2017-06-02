#!/bin/bash
##################################################
##  Curl script to generate 10,000 sales activities using the
##   'setrack' GO application
##   Requires docker environment 
##################################################

###############
## Generate Activities
###############
curl -X POST http://localhost:8000/api/activity/gen/5/10000
