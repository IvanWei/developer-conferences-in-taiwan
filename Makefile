refresh-conference-data:
	@echo "Download conference data from google sheet..."
	curl -o "./data/conference-data.json" -L "$(CONFERENCE_SOURCE_URL)"

	@echo "Update json file of conference data"
	git add ./data/conference-data.json
	if git commit -m "Update conference data at `date +%Y-%m-%d-T%H\:%M\:%S%z`"; then \
		echo "Update json file"; \
	else \
		echo "No new data"; \
	fi

	@echo "Done!!!"

refresh-README-file:
	@echo "Update README.md"
	npm run update:readme

	git add README.md
	if git commit -m "Update README.md at `date +%Y-%m-%d-T%H\:%M\:%S%z`"; then \
		echo "README.md changed."; \
	else \
		echo "README.md doesn't change."; \
	fi

	@echo "Done!!!"

refresh-html-file:
	@echo "Update html file"
	npm run update:ghPage

	git add docs
	if git commit -m "Update docs folder at `date +%Y-%m-%d-T%H\:%M\:%S%z`"; then \
		echo "Docs folder changed."; \
	else \
		echo "Docs folder doesn't change."; \
	fi

	@echo "Done!!!"

deployment:
	@echo "README.md and HTML content, Deployment!!!"

	git push -f

	@echo "Done!!!"

refresh-and-deployment:
	make refresh-conference-data
	make refresh-README-file
	make refresh-html-file
	make readme-deployment
