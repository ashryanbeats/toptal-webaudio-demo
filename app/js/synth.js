////////
// This sample is published as part of the blog article at www.toptal.com/blog
// Visit www.toptal.com/blog and subscribe to our newsletter to read great posts
////////

angular
    .module('Synth', ['Tone-Synth', 'WebAnalyser'])
    .factory('DSP', ['SynthEngine', 'Analyser', function(Engine, Analyser) {
        var self = this;
        self.device = null;
        self.analyser = null;

        //Engine.init();

        function _unplug() {
            self.device.onmidimessage = null;
            self.device = null;
        }

        function _plug(device) {
            if(device) {
                // unplug any already connected device
                if(self.device) {
                    _unplug();
                }

                self.device = device;
                self.device.onmidimessage = _onmidimessage;
            }
        }

        function _createAnalyser(canvas) {
            self.analyser = new Analyser(canvas);
            //Engine.wire(self.analyser);

            return self.analyser;
        }

        function _onmidimessage(e) {
            //console.log(e);
            /**
            * e.data is an array
            * e.data[0] = on (144) / off (128) / detune (224)
            * e.data[1] = midi note
            * e.data[2] = velocity || detune
            */

            var note = midiToNote(e.data[1]);
            var velocity = midiToVelocity(e.data[2]);

            switch(e.data[0]) {
                case 144:
                    Engine.noteOn(note, null, velocity);
                break;
                case 128:
                    Engine.noteOff(note);
                break;
                // case 224:
                //     Engine.detune(e.data[2]);
                // break;
            }

        }

        function midiToNote(midiNoteNum){
            var noteIndexToNote = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
            var octave = Math.floor(midiNoteNum / 12) - 2;
            var note = midiNoteNum % 12;
            return noteIndexToNote[note] + octave;
        }

        function midiToVelocity(midiVelocity) {
            return midiVelocity / 127;
        }

        function _enableFilter(enable) {
            if(enable !== undefined) {
                if(enable) {
                    //Engine.filter.connect();
                } else {
                    //Engine.filter.disconnect();
                }
            }
        }

        return {
            plug: _plug,
            createAnalyser: _createAnalyser,
            //setOscType: Engine.osc.setType,
            //setFilterType: Engine.filter.setType,
            //setAttack: Engine.setAttack,
            //setRelease: Engine.setRelease,
            //setFilterFrequency: Engine.filter.setFrequency,
            //setFilterResonance: Engine.filter.setResonance,
            enableFilter: _enableFilter
        };
    }]);
