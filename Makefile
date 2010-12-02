BINDIR = .
MAILDIR_THINKPADS = $(HOME)/Maildir/craigslist-nyc-thinkpads
MAILDIR_MACBOOKS = $(HOME)/Maildir/craigslist-nyc-macbooks


all : split-by-model normalize-price-data data/models.txt 

split-by-model : data/thinkpads-all.txt data/macbooks-all.txt
	sort -k2 -t' ' $^ | $(BINDIR)/split_by_model data/by-model

normalize-price-data :
	$(BINDIR)/normalize_price_data

data/thinkpads-all.txt :
	find $(MAILDIR_THINKPADS) -type f | xargs ./parse_mail --thinkpad --utc > data/thinkpads-all.txt

data/macbooks-all.txt :
	find $(MAILDIR_MACBOOKS) -type f | xargs ./parse_mail --macbook --utc > data/macbooks-all.txt

data/models.txt : data/thinkpads-all.txt data/macbooks-all.txt
	cut -f2 -d' ' $^ | sort | uniq -c | awk '{ print $$2, $$1 }' > $@

