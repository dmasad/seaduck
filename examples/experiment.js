let seaduck = require("../seaduck.js")

let model  = new seaduck.Narrative({
    "nouns": [
        // Will be filled in at init

    ],
    "actions": [
        {
            "name": "meet",
            "match": ["#person", "#person"],
            "when": function(a, b) {
                return a.properties.alive 
                    && b.properties.alive;
            },
            "action": function*(a,b) {
                yield(new seaduck.StoryEvent("meets", a, b));
                // Check if A falls in love with B
                if (!this.isRelated("in love", a, b) && Math.random() < a.properties.pLove) {
                    yield (new seaduck.StoryEvent("fall in love", a, b));
                    this.relate("in love", a, b);
                }
                else if (this.isRelated("in love", a, b) && !this.isRelated("in love", b, a)) {
                    yield (new seaduck.StoryEvent("pines for", a, b));
                    a.properties.happy = false;
                }
                if (this.isRelated("in love", a, b) && this.isRelated("in love", b, a)) {
                    yield (new seaduck.StoryEvent("kiss", a, b));
                    a.properties.happy = true;
                    b.properties.happy = true;
                }
                
                // TODO: Everything else goes here.
            }

        },
        {
            "name": "write love letter",
            "match": ["#person"],
            "when": function(a) {
                return(this.allRelatedByTag("in love", a, "person").length > 0)
            },
            "action": function*(a) {
                let loveInterests = this.allRelatedByTag("in love", a, "person");
                let b = this.choice(loveInterests);
                yield(new seaduck.StoryEvent("write letter", a, b));

            }
        },
        {
            "name": "duel",
            "match": ["#person", "#person"],
            "when": function(a, b) {
                if (this.isRelated("in love", a, b) || this.isRelated("in love", b, a))
                    return(false);

                let aLoves = this.allRelatedByTag("in love", a, "person");
                let bLoves = this.allRelatedByTag("in love", b, "person");
                for (let c of aLoves) {
                    if (bLoves.indexOf(c) > 0) return(true);
                }
                return(false);
            },
            "action": function*(a, b) {
                yield (new seaduck.StoryEvent("duel", a, b))

            }
        }

    ],
    "initialize": function*() {        
        // Instantiate characters
        for (let name of ["Alois", "Bianca", "Charles", "Diane", "Etienne"]) {
            let character = {
                "name": name,
                "properties": {
                    "happy": true,
                    "alive": true,
                    "pLove": Math.random()
                },
                "tags": ["person"]
            };
            this.narrative.nouns.push(character);
        }
        yield(new seaduck.StoryEvent("new story", null, null))
    },
    "traceryDiscourse": {
        "new story": ["----"],
        "meets": ["#nounA# #meet# #nounB# #place#."],
        "meet": ["runs into", "encounters", "chances upon", "spends time with"],
        "fall in love": ["#nounA# falls in love with #nounB#"],
        "kiss": ["#nounA# and #nounB# embrace and kiss!"],
        "pines for": ["#nounA# pines for #nounB# from afar."],
        "write letter": ["#nounA# writes a love letter to #nounB#."],
        "duel": ["#nounA# challenges #nounB# to a duel at dawn #place#."],
        "place": ["at a garden party", "at the racetrack", "at the opera", 
                  "at the market", "on the street"]

    }
});


model.maxUnchangedStates = 10;

for (i=0; i<10; i++) {
    let storyEvents = model.stepAndRender(1);
    if (storyEvents.length > 0) {
        for (let event of storyEvents) {
            console.log(event);
        }
        console.log("");
    }
    else {break;}
}