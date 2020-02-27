'use strict';

const fetch = require('node-fetch')
const fs = require('fs');
var parsed = {}

const queryTerm = process.argv[2]
const order = process.argv[3]

function parseByInstitution(theses) {
    var parsed = {};

    theses.forEach(these => {
        these.etablissement.forEach(etab => {
            if(etab != "") {
                if(!parsed[etab]) {
                    parsed[etab] = {
                        discipline: {},
                        count: 0
                    }
                }
    
                parsed[etab].count++;
            
                if(!parsed[etab].discipline[these.discipline]) {
                    parsed[etab].discipline[these.discipline] = {
                        directeursTheses: {},
                        count: 0
                    }
                }
    
                parsed[etab].discipline[these.discipline].count++;
            
                these.directeurThese.forEach(directeur => {
                    if(!parsed[etab].discipline[these.discipline].directeursTheses[directeur]) {
                        parsed[etab].discipline[these.discipline].directeursTheses[directeur] = {
                            doctorants: []
                        }
                    }
            
                    parsed[etab].discipline[these.discipline].directeursTheses[directeur].doctorants.push(these.auteur) 
                })
            }
        })
    })

    return parsed;
}

function parseByDiscipline(theses) {
    var parsed = {};

    theses.forEach(these => {
        if(!parsed[these.discipline]) {
            parsed[these.discipline] = {
                etabSoutenance: {},
                count: 0
            }
        }

        parsed[these.discipline].count++;
    
        these.etablissement.forEach(etab => {
            if(etab != "") {
                if(!parsed[these.discipline].etabSoutenance[etab]) {
                    parsed[these.discipline].etabSoutenance[etab] = {
                        directeursTheses: {},
                        count: 0
                    }
                }
    
                parsed[these.discipline].etabSoutenance[etab].count++;
    
                these.directeurThese.forEach(directeur => {
                    if(!parsed[these.discipline].etabSoutenance[etab].directeursTheses[directeur]) {
                        parsed[these.discipline].etabSoutenance[etab].directeursTheses[directeur] = {
                            doctorants: []
                        }
                    }
            
                    parsed[these.discipline].etabSoutenance[etab].directeursTheses[directeur].doctorants.push(these.auteur) 
                })
            }
        })
    })

    return parsed;
}

if(!queryTerm) {
    console.error('A query term must be given as an input.');
    return;
}

const url = 'http://theses.fr/?q=' + queryTerm + '&lng=fr/&checkedfacets=&format=json';

try {
    let settings = { method: "Get" };

    fetch(url, settings)
        .then(res => res.json())
        .then((json) => {
            var theses = json.response.docs

            switch(order) {
                case "institution":
                    parsed = parseByInstitution(theses);
                    break;
            
                case "discipline":
                    parsed = parseByDiscipline(theses);
                    break;

                default:
                    parsed = parseByInstitution(theses);
                    break;
            }
            
            console.log('Results parsed in the parsed-theses.json file for the query \'' + queryTerm + '\'.')
            fs.writeFileSync('parsed-theses.json', JSON.stringify(parsed));
    });
}
catch(e) {
    console.error(e);
}
