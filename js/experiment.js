// Connect socket.
let socket = io.connect('http://localhost:70'); // TODO

// Get participant number from Prolific somehow.
let subjectNo = 0;

// Preload all blocks of audio.
audio = []
audio = audio.concat(getTimelineVars(subjectNo, 0, 2, false));
audio = audio.concat(getTimelineVars(subjectNo, 1, 2, false));
audio = audio.concat(getTimelineVars(subjectNo, 2, 2, false));
audio = audio.concat(getTimelineVars(subjectNo, 3, 2, false));


var preload = {
    type: 'preload',
    audio: audio,
};

// Define welcome message trial.
var introduction = {
  type: "instructions",
  pages: [
    '<h3>Welcome!</h3> ' +
    'We are investigating the perceptual fusion of partials in simple musical sounds.',
    'The sounds may seem to be coming from one source, or from many sources at once.',
    'More detail will follow in the instructions. First, we need to know if you are the right participant for this experiment.',
    '<h3>Are you the right participant for us?</h3>' +
    'Anyone can participate in this experiment so long as they have normal hearing.',
    '<h3>Please ensure you have the following before participating:</h3>' +
    '<ul><li>You are currently using a laptop or desktop computer and not using a mobile device.</li>'+
    '<li>You are using a current web browser with Javascript enabled (Chrome/Firefox are preferred).</li>'+
    '<li>You have a set of headphones to use during the experiment (do not use your speakers).</li>'+
    '<li>You are participating in a quiet environment with very little background noise.</li></ul><br><br>' +
    'If you have ensured the above and would like to participate in the study, please proceed to the informed consent form.'
  ],
  show_clickable_nav: true
}

var informedConsent = {
  type: "external-html",
  url: "consent.html",
  cont_btn: "start",
  check_fcn: check_consent
}


var welcome = {
  type: "instructions",
  pages: ["Welcome to the experiment.",
          "In this experiment you will rate a series of short sounds, one at a time.",
          "Each sound will be rated on a scale from 'less fused' to 'more fused.' Here's what that means:",
          "All sound is made up of many simple components. Oftentimes they seem to be 'fused' together.",
          "Components that are 'fused' make a sound that we hear as coming from one source. For example, the sound of a violin is made up of many 'fused' components, but we hear it as one source.",
          "Components that are 'not fused' make a sound that seems cloudy, or coming from multiple sources at once. It seems to break apart.",
          "To help remind you of their meaning, the scale has additional labels in brackets: 'less fused (<em>more sources</em>)' and 'more fused (<em>less sources</em>).'",
          "This short experiment takes place over four blocks. In each block you will hear and then rate 18 sounds.",
          "Drag the slider to indicate your desired response, then click 'Continue' to move on to the next trial.",
          "At the end of the last block, you will be redirected to Prolific.",
          "Thank you for your participation.",
  ],
  show_clickable_nav: true
};

// TODO volume block.
// TODO practice block.

var captionBlock0 = {
  type: 'instructions',
  pages: ['<b>Starting block 1/4.</b>'],
  show_clickable_nav: true,
}

var block0 = {
  timeline: [
    {
      type: "audio-slider-response",
      labels: ["less fused (more sources)", "more fused (less sources)"],
      stimulus: jsPsych.timelineVariable('stimulus'),
      min: 0,
      max: Number.MAX_SAFE_INTEGER,
      slider_start: Math.floor( Number.MAX_SAFE_INTEGER / 2 ),
      step: 1,
      slider_width: 500,       // (in pixels).
      require_movement: true,
      prompt: "<p>How fused is this sound?</p>",
    }
  ],
  timeline_variables: getTimelineVars(subjectNo, 0, 2, true),
  randomize_order: true,
}

var captionBlock1 = {
  type: 'instructions',
  pages: ['<b>Starting block 2/4</b>.'],
  show_clickable_nav: true,
}

var block1 = {
  timeline: [
    {
      type: "audio-slider-response",
      labels: ["less fused (more sources)", "more fused (less sources)"],
      stimulus: jsPsych.timelineVariable('stimulus'),
      min: 0,
      max: Number.MAX_SAFE_INTEGER,
      slider_start: Math.floor( Number.MAX_SAFE_INTEGER / 2 ),
      step: 1,
      slider_width: 500,       // (in pixels).
      require_movement: true,
      prompt: "<p>How fused is this sound?</p>",
    }
  ],
  timeline_variables: getTimelineVars(subjectNo, 1, 2, true),
  randomize_order: true,
}

var captionBlock2 = {
  type: 'instructions',
  pages: ['<b>Starting block 3/4.</b> You may take a two-minute break here if you wish. Click Next when you are ready to continue.'],
  show_clickable_nav: true,
}

var block2 = {
  timeline: [
    {
      type: "audio-slider-response",
      labels: ["less fused (more sources)", "more fused (less sources)"],
      stimulus: jsPsych.timelineVariable('stimulus'),
      min: 0,
      max: Number.MAX_SAFE_INTEGER,
      slider_start: Math.floor( Number.MAX_SAFE_INTEGER / 2 ),
      step: 1,
      slider_width: 500,       // (in pixels).
      require_movement: true,
      prompt: "<p>How fused is this sound?</p>",
    }
  ],
  timeline_variables: getTimelineVars(subjectNo, 2, 2, true),
  randomize_order: true,
}

var captionBlock3 = {
  type: 'instructions',
  pages: ['<b>Starting block 4/4.</b>'],
  show_clickable_nav: true,
}

var block3 = {
  timeline: [
    {
      type: "audio-slider-response",
      labels: ["less fused (more sources)", "more fused (less sources)"],
      stimulus: jsPsych.timelineVariable('stimulus'),
      min: 0,
      max: Number.MAX_SAFE_INTEGER,
      slider_start: Math.floor( Number.MAX_SAFE_INTEGER / 2 ),
      step: 1,
      slider_width: 500,       // (in pixels).
      require_movement: true,
      prompt: "<p>How fused is this sound?</p>",
    }
  ],
  timeline_variables: getTimelineVars(subjectNo, 3, 2, true),
  randomize_order: true,
}

// Build up timeline from components.
var timeline = [];
timeline.push(preload);
timeline.push(introduction);
// timeline.push(informedConsent);
// timeline.push(welcome);

timeline.push(captionBlock0);
timeline.push(block0);
// timeline.push(captionBlock1);
// timeline.push(block1);
// timeline.push(captionBlock2);
// timeline.push(block2);
// timeline.push(captionBlock3);
// timeline.push(block3);


// Function that runs the experiment.
function startExp(){
  jsPsych.init({
    timeline: timeline,
      on_finish: function () {
          // Send over sockets.       
          var filename = `subject_${subjectNo}.csv`;
          // var expData = jsPsych.data.get().ignore(['view_history', 'responses', 'internal_node_id', 'key_press', 'accuracy', 'event']).csv();
          var expData = jsPsych.data.get().csv();

          // Send to server, and download data.
          socket.emit('csv', {filename: filename, expData: expData}, function(confirmation){ 
            console.log(confirmation);
            window.location = "https://www.google.com"; // TODO
          });


      }
    // on_finish: function() {
    // jsPsych.data.displayData();
    // }
  });
}