run-refresh-shell:
	@echo "Download refresh shell..."
	curl -O $(SHELL_URL)

	@echo "Run refresh shell..."
	$(SHELL) refresh-json.sh

	@echo "Commit conference data"
	git add ./data/conference-data.json
	git commit -m "Update conference data at $(`date +'%Y-%m-%d %H:%M:%S%z'`)"

	@echo "Done!!!"

build-conference-page:
	@echo "Update README.md and Pages"
	npm run build-all

deploy:
	make run-refresh-shell
	make build-conference-page

	git add .
	git commit -m "Update README.md and Pages at $(`date +'%Y-%m-%d %H:%M:%S%z'`)"
