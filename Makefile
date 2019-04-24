run-refresh-shell:
	@echo "Download refresh shell..."
	curl -O $(SHELL_URL)

	@echo "Run refresh shell...\t"
	$(SHELL) refresh-json.sh

	@echo "Done!!!"
