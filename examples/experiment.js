let seaduck = require("../seaduck.js")

let model  = new seaduck.Narrative({
    "nouns": [
        {
            "name": "Alois",
            "properties": {
                "happy": true,
                "alive": true,
                "pLove": Math.random()
            },
            "tags": ["person"]
        },
        {
            "name": "Bianca",
            "properties": {
                "happy": true,
                "alive": true,
                "pLove": Math.random()
            },
            "tags": ["person"]
        },
        {
            "name": "Charles",
            "properties": {
                "happy": true,
                "alive": true,
                "pLove": Math.random()
            },
            "tags": ["person"]
        }

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
                yield(new seaduck.StoryEvent("meet", a, b));
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

        }

    ],
    
    "traceryDiscourse": {
        "meet": ["#nounA# meets #nounB# #place#."],
        "fall in love": ["#nounA# falls in love with #nounB#"],
        "kiss": ["#nounA# and #nounB# embrace and kiss!"],
        "pines for": ["#nounA# pines for #nounB# from afar."],
        "place": ["at a garden party", "at the racetrack", "at the opera", 
                  "at the market", "on the street"]

    }
});

for (i=0; i<5; i++) {
    let storyEvents = model.stepAndRender(1);
    if (storyEvents.length > 0) {
        for (let event of storyEvents) {
            console.log(event);
        }
        console.log("");
    }
    else {break;}
}