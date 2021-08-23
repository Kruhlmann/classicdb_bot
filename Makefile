SRC=src
TST=test
DIST=dist
ENTRYPOINT=$(DIST)/$(SRC)/index.js

TS_SOURCES=$(wildcard $(SRC)/**/*.ts)
JS_SOURCES=$(patsubst %.ts, %.js, $(TS_SOURCES))
JS_ARTIFACTS_DIRTY=$(addprefix $(DIST)/, $(JS_SOURCES))
JS_ARTIFACTS=$(filter-out $(ENTRYPOINT), $(JS_ARTIFACTS_DIRTY))


$(DIST):
	mkdir $(DIST)

$(DIST)/$(SRC)%.js: $(SRC)%.ts $(DIST)

yarn.lock:
	yarn install

$(JS_ARTIFACTS): node_modules
	yarn tsc

$(ENTRYPOINT): $(JS_ARTIFACTS)

node_modules: package.json yarn.lock
	yarn install

build: $(ENTRYPOINT) Makefile

run: build
	cp ./override_client_data_manager.js node_modules/discord.js/src/client/ClientDataManager.js
	node $(ENTRYPOINT)

lint: node_modules
	yarn eslint $(SRC)/**/*.ts $(TST)/**/*.ts

fix: node_modules
	yarn eslint $(SRC)/**/*.ts $(TST)/**/*.ts --fix

dev: node_modules
	yarn tsc-watch --onSuccess "node $(ENTRYPOINT)"

test: node_modules
	yarn jest --verbose --config jest.config.js

coverage: node_modules
	yarn nyc --reporter=lcov make test

loc:
	cat $(TS_SOURCES) | wc -l

.PHONY: dev test coverage run
