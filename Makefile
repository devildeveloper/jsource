########################
# JSource
########################

# JSDoc Files
DOCDIR = docs
SRCDIR = src

jsdocs:
	mkdir -p $(DOCDIR)
	rm -rf $(DOCDIR)/*
	node_modules/jsdoc/jsdoc -r $(SRCDIR) -d $(DOCDIR)