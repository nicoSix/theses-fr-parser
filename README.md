# French academics searcher

This node program is capable of retrieving the results from multiple academics websites and aggregating them to give an overview of the theses and papers being prepared and completed by institution and by thesis director. Consequently, it allows to roughly see the institution and academics working on a given subject.

To use it, follow those commands:

```
npm install
node search.js 
```

Arguments:
- --query (required): researched subject inside thesis database
- --allintitle: will only be parsed theses with the query term inside the title
- --order: specified order will come first in the generated arborescence of the theses list.
  - institution
  - discipline

Order can be substituted with 'institution' or 'discipline', depending if you prefer to group results by institution or discipline. Results can be pretty-viewed using an online JSON viewer, available on the net.