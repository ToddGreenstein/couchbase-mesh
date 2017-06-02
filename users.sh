#!/bin/bash
##################################################
##  Curl script to gerate  10 user profiles using the
##   'setrack' GO application
##   Requires docker environment 
##################################################

###############
## Generate  Profiles
###############
curl -X POST http://localhost:8000/api/users/gen
