
ENVIRONMENTS = development test integration staging production


check: test lint

lint: 
	@echo -n 'Checking code style... '
	@$(CURDIR)/node_modules/.bin/jshint $(CURDIR)/lib/*
	@$(CURDIR)/node_modules/.bin/jshint $(CURDIR)/test/*
	@echo "\033[0;32m[OK]\033[0m"

test: test-environments

test-environments:
	@for env in $(ENVIRONMENTS); do \
		echo -n "Testing with NODE_ENV set to $$env..."; \
		NODE_ENV="$$env" "$(CURDIR)/node_modules/.bin/mocha" \
			--reporter dot \
			--check-leaks \
			--ui bdd; \
	done


.PHONY: test
