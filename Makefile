refresh-conference-data:
  @echo "Download conference data from google sheet..."
  curl -o "./data/conference-data.json" -L "$(secret.conferenceSourceUrl)"

  @echo "Update json file of conference data"
  git add ./data/conference-data.json
  git commit -m "Update conference data at `date +%Y-%m-%d-T%H\:%M\:%S%z`"

  @echo "Done!!!"

refresh-README-file:
  @echo "Update README.md"
  npm run build

  git add README.md
  git commit -m "Update README.md at `date +%Y-%m-%d-T%H\:%M\:%S%z`"

  @echo "Done!!!"

deployment:
  make refresh-conference-data
  make refresh-README-file

  @echo "Deployment!!!"
  git push

  @echo "Done!!!"
