########################
# JSource
########################

# JSDoc Files
DOCDIR = docs
SRCDIR = src

jsdocs:
	git submodule init
	git submodule update
	mkdir -p $(DOCDIR)
	rm -rf $(DOCDIR)/*
	dependencies/jsdoc/jsdoc -r $(SRCDIR) -d $(DOCDIR)