D3SRC = node_modules/d3/src
BROWSERIFY = node_modules/.bin/browserify
UGLIFY = node_modules/.bin/uglifyjs

D3_LIBRARY_FILES = \
	$(D3SRC)/start.js \
	$(D3SRC)/compat/index.js \
	$(D3SRC)/selection/selection.js \
	$(D3SRC)/arrays/range.js \
	$(D3SRC)/transition/index.js \
	$(D3SRC)/event/mouse.js \
	$(D3SRC)/end.js

smash: $(D3_LIBRARY_FILES)
	node_modules/.bin/smash $(D3_LIBRARY_FILES) | \
	$(UGLIFY) -c -m -o lib/d3-small.js

smash-debug: $(D3_LIBRARY_FILES)
	node_modules/.bin/smash $(D3_LIBRARY_FILES) > lib/d3-small.js

run:
	wzrd index.js -- \
		-d \
		-x idmaker \
		-x probable \
		-x seedrandom \
		-x lodash \
		-x async

pch: smash # smash-debug
	$(BROWSERIFY) \
		lib/d3-small.js \
		-r probable \
		-r seedrandom \
		-r idmaker \
		-r lodash \
		-r async \
		-o pch.js

build: smash
	$(BROWSERIFY) index.js | $(UGLIFY) -c -m -o mote.js

test:
	node tests/griddler-tests.js
	node tests/actions/move-tests.js
	node tests/actions/take-tests.js
	node tests/clock-tests.js
