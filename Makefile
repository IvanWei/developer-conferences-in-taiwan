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
	npm run build

	git add README.md
	if git commit -m "Update README.md at `date +%Y-%m-%d-T%H\:%M\:%S%z`"; then \
		echo "README.md changed."; \
	else \
		echo "README.md doesn't change."; \
	fi

	@echo "Done!!!"

manual-deployment:
	@echo "Deployment!!!"
	git push

	@echo "Done!!!"

refresh-and-deployment:
	make refresh-conference-data
	make refresh-README-file
	make manual-deployment
