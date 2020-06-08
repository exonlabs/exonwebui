.PHONY: clean clean-dist clean-dev clean-all setup-dev release


clean:
	@rm -rf build/
	@find . -type d -name '__pycache__' -exec rm -rf {} +
	@find . -type f -name '*.pyc' -exec rm -f {} +

clean-dist:
	@rm -rf dist/

clean-dev: clean
	@rm -rf *.egg-info/ *.dist-info/

clean-all: clean-dev clean-dist

setup-dev: clean-dev
	@bash scripts/setup_dev.sh

release: clean
	@bash scripts/release.sh $(REL)
