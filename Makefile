D3SRC = node_modules/d3/src

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
	node_modules/.bin/uglifyjs - -c -m -o lib/d3-small.js

smash-debug: $(D3_LIBRARY_FILES)
	node_modules/.bin/smash $(D3_LIBRARY_FILES) > lib/d3-small.js

run:
	wzrd index.js -- \
		-d \
		-x idmaker \
		-x probable \
		-x seedrandom \

pch: smash-debug # smash
	node_modules/.bin/browserify \
		lib/d3-small.js \
		-r probable \
		-r seedrandom \
		-r idmaker \
		-o pch.js

test:
	node tests/griddler-tests.js
