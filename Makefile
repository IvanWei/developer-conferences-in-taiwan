run-refresh-shell:
	@echo "Download refresh shell..."
	curl -O $(SHELL_URL)

	@echo "Run refresh shell..."
	$(SHELL) refresh-json.sh

	@echo "Commit conference data"
	git add ./data/conference-data.json
	git commit -m "Update conference data at `date +%Y-%m-%d-T%H\:%M\:%S%z`"

	@echo "Done!!!"

build-README-file:
	@echo "Build README.md"
	npm run build

deploy:
	make run-refresh-shell
	make build-README-file

	git add README.md
	git commit -m "Update README.md at `date +%Y-%m-%d-T%H\:%M\:%S%z`"
