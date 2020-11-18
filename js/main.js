//*init speech synthesis api
const synth = window.speechSynthesis;

const body = document.querySelector('body');
const textForm = document.querySelector('form');
const textInput = document.querySelector('#text-input');
const voiceSelect = document.querySelector('#voice-select');
const pitch = document.querySelector('#pitch');
const pitchValue = document.querySelector('#pitch-value');
const rate = document.querySelector('#rate');
const rateValue = document.querySelector('#rate-value');

//*init voices array

let voices = [];

const getVoices = ()=>{
    voices = synth.getVoices();
    
    //*loop through voices
    voices.forEach((voice)=>{
        //create option element
        const option = document.createElement('option');
        //fill option with voices and lang
        option.textContent = `${voice.name}(${voice.lang})`;
        //set needed option attributes
        option.setAttribute('data-lang', voice.lang);
        option.setAttribute('data-name', voice.name);
        voiceSelect.appendChild(option);
    });
}

if(synth.onvoiceschanged !== undefined){
    
    //!if we do not do this, we will get empty voices array
    synth.onvoiceschanged = getVoices();
}


const speak = ()=>{
    //check if speaking
    if(synth.speaking){
        console.error('Already speaking...');
        return;
    }

    if(textInput.value!== ''){
        body.style.background = 'white url(img/wave.gif)';
        body.style.backgroundRepeat = 'repeat-x';
        body.style.backgroundSize = '100% 100%';
        //get speak text
        const speakText = new SpeechSynthesisUtterance(textInput.value);
        
        //speak end
        speakText.onend = e=>{
            body.style.background = 'white';
            console.log('Done speaking...');
        }

        //speak error
        speakText.onerror = e=>{
            console.error('Something went wrong...');
        }

        //selected voice
        const selectedVoice = voiceSelect.selectedOptions[0].getAttribute('data-name');
        
        //loop through voices
        voices.forEach((voice)=>{
            if(voice.name === selectedVoice){
                speakText.voice = voice;
            }
        });

        //set pitch and rate
        speakText.rate = rate.value;
        speakText.pitch = pitch.value;

        //speak
        synth.speak(speakText);
    }
};


//*Event Listeners

//text form submit
textForm.addEventListener('submit', (e)=>{
   
    e.preventDefault();
    speak();

    textInput.blur();
});

//rate value change

rate.addEventListener('change',(e)=> rateValue.textContent = rate.value);
pitch.addEventListener('change', (e)=> pitchValue.textContent = pitch.value);

//voice select change
voiceSelect.addEventListener('change', (e)=>speak());
