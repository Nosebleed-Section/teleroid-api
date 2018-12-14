#!/bin/bash

API="http://localhost:4741"
URL_PATH="/pictures"

curl "${API}${URL_PATH}" \
  --include \
  --header "Authorization: Bearer ${TOKEN}" \
  --form image="${IMAGE_PATH}" \
  --form title="${TITLE}" \

echo
