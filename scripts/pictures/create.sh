#!/bin/bash

API="http://localhost:4741"
URL_PATH="/pictures"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "picture": {
      "title":"'"${TITLE}"'",
      "comments":"'"${COMMENTS}"'"
    }
  }'

echo
