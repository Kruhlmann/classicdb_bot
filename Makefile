SRC=src
TST=test
DIST=dist
ENTRYPOINT=$(DIST)/index.js

TSC=./node_modules/.bin/tsc
TSC_WATCH=./node_modules/.bin/tsc-watch
ESLINT=./node_modules/.bin/eslint
JEST=./node_modules/.bin/jest

TSC_FLAGS=--skipLibCheck
INSTALL_FLAGS=--frozen-lockfile
TSC_WATCH_FLAGS=$(TSC_FLAGS) --onSuccess "node $(ENTRYPOINT)"
JEST_FLAGS=--verbose \
		   --coverage \
		   --config jest.config.js \
		   --reporters=default \
		   --reporters=jest-junit

TS_SOURCES=$(wildcard $(SRC)/**/*.ts)
TEST_SOURCES=$(wildcard $(TST)/**/*.ts)

all: $(ENTRYPOINT)

$(ENTRYPOINT): $(TS_SOURCES) node_modules data.json
	$(TSC) $(TSC_FLAGS)

data.json:
	wget https://raw.githubusercontent.com/nexus-devs/wow-classic-items/master/data/json/data.json

node_modules: package.json pnpm-lock.yaml
	pnpm install $(INSTALL_FLAGS)

lint: node_modules
	$(ESLINT) $(TS_SOURCES) $(TEST_SOURCES)

fix: node_modules
	$(ESLINT) --fix $(TS_SOURCES) $(TEST_SOURCES)

dev: node_modules data.json
	$(TSC_WATCH) $(TSC_WATCH_FLAGS)

junit.xml: node_modules $(TS_SOURCES) $(TEST_SOURCES)
	$(JEST) $(JEST_FLAGS)

test: junit.xml

clean:
	git clean

.PHONY: dev lint fix test clean all
