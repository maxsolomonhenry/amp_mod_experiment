
// Connect socket. This version seems to adapt to new ports specified in `app.js``
let socket = io();

/*  
    TODO Get participant number from Prolific somehow.
    Check for unique participant ID, and increment.
    At the end, mark as "complete?" Or cycle back again.
*/


let subjectNo;
let audio = [];
let preload;

socket.emit('requestSubjectNo', null, (count) => {
  subjectNo = count;

  /*
    Preload all blocks of audio.
    getTimelineVars (subjectNo, blockNo, repeats, asJSON) 
  */




  // Load subject-specific files.
  audio = audio.concat(getTimelineVars(subjectNo, 0, 4, false));
  audio = audio.concat(getTimelineVars(subjectNo, 1, 4, false));

  // Load MISC files for volume and training.
  audio = audio.concat([
    "audio/MISC/vol1.wav",
    "audio/MISC/vol2.wav", 
    "audio/MISC/vol3.wav", 
    "audio/MISC/vol4.wav", 
    "audio/MISC/vol5.wav", 
    "audio/MISC/vol6.wav",
    "audio/MISC/train1.wav", 
    "audio/MISC/train2.wav",
  ]);

  console.log(audio);

  var preload = {
      type: 'preload',
      audio: audio,
  };


  /*
    =============================
        TRIALS and TIMELINE.
    =============================
  */


  var timeline = [];

  var welcome = {
    type: "instructions",
    pages: [
      '<h3>Welcome!</h3> ' +
      'We are investigating the perception of musical vibrato. ' +
      'Before we begin, we need to know if you are the right participant for this experiment.',
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
  };
  timeline.push(welcome);


  var consent = {
    type:'external-html',
    url: "consent.html",
    cont_btn: "start",
    check_fn: check_consent
  };
  timeline.push(consent);


  var volumeInstructions = {
    type: "instructions",
    pages: [
      '<h3>Setting your system volume</h3>' +
      'You will now here six sounds that are typical of the sounds you will here in this experiment. ' +
      'They have been pre-adjusted to be approximately the same volume.',
      'As you listen to the sounds, adjust your system volume so that they are playing back to you at a comfortable level.',
      'After you have set your volume, please <b> do not adjust your system volume for the rest of the experiment </b>.',
      'Click Next to start listening.'
    ],
    show_clickable_nav: true
  };
  timeline.push(volumeInstructions);


  var volumeBlock = {
    type: 'audio-button-response',
    choices: ['Continue'],
    timeline: [
      {stimulus: 'audio/MISC/vol1.wav', prompt: '<p><b>Playing sound 1/6.</b> Please adjust your volume as needed.</p>'},
      {stimulus: 'audio/MISC/vol2.wav', prompt: '<p><b>Playing sound 2/6.</b> Please adjust your volume as needed.</p>'},
      {stimulus: 'audio/MISC/vol3.wav', prompt: '<p><b>Playing sound 3/6.</b> Please adjust your volume as needed.</p>'},
      {stimulus: 'audio/MISC/vol4.wav', prompt: '<p><b>Playing sound 4/6.</b> Please adjust your volume as needed.</p>'},
      {stimulus: 'audio/MISC/vol5.wav', prompt: '<p><b>Playing sound 5/6.</b> Please adjust your volume as needed.</p>'},
      {stimulus: 'audio/MISC/vol6.wav', prompt: '<p><b>Playing sound 6/6.</b> Please adjust your volume as needed.</p>'},
    ]
  };
  timeline.push(volumeBlock);


  var instructions = {
    type: "instructions",
    pages: ["Thank you.",
            "In this experiment you will rate a series of short sounds, one at a time. " +
            "You will rate each sound on a scale from <b>less fused</b> to <b>more fused</b>.",
            "<h3>What does fused mean?</h3>" +
            "All sound is made up of many simple components. Oftentimes they seem to be 'fused' together. ",
            "<p>Components that are <b>fused</b> make a sound that we hear as coming from one source.</p> " +
            "<p>For example, the sound of a violin is made up of many <b>fused</b> components, but we hear it as one source.</p>",
            "Components that are <b>not fused</b> make a sound that seems cloudy, or coming from multiple sources at once.",
            "To help remind you of their meaning, the scale has additional labels in brackets: " +
            "<b>less fused (more sources)</b> and <b>more fused (less sources)</b>.",
            "This short experiment takes place over two blocks. In each block you will hear and then rate 44 short sounds. ",
            "Drag the slider to indicate your desired response. It can be placed at any point between the two extremes. ",
            "You must click on the slider at least once to record your answer. When you are done, click 'Continue' to move on to the next trial.",
            "We will now proceed to the practice block.",
    ],
    show_clickable_nav: true
  };
  timeline.push(instructions);


  var practiceBlock = {    
    type: "audio-slider-response",
    labels: ["less fused (more sources)", "more fused (less sources)"],
    min: 0,
    max: Number.MAX_SAFE_INTEGER,
    slider_start: Math.floor( Number.MAX_SAFE_INTEGER / 2 ),
    step: 1,
    slider_width: 500,       // (in pixels).
    require_movement: true,
    prompt: "<p>How fused is this sound?</p>",
    timeline: [
      {stimulus: 'audio/MISC/train1.wav'},
      {stimulus: 'audio/MISC/train2.wav'}
    ]
  };
  timeline.push(practiceBlock);


  var preMain = {
    type: "instructions",
    pages: [
      "Thank you. We will now proceed to the main experiment.",
      "At the end of the last block, you will be redirected to Prolific.",
      "Thank you for your participation."
    ],
    show_clickable_nav: true
  };
  timeline.push(preMain);


  var captionBlock0 = {
    type: 'instructions',
    pages: ['<b>Block 1/2.</b>'],
    show_clickable_nav: true,
  };
  timeline.push(captionBlock0);


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
        slider_width: 500,
        require_movement: true,
        prompt: "<p>How fused is this sound?</p>",
      }
    ],
    timeline_variables: getTimelineVars(subjectNo, 0, 2, true),
    randomize_order: true,
  };
  timeline.push(block0);


  var captionBreak = {
    type: 'instructions',
    pages: ['<p><b>Halfway complete</b>.</p> <p>You may take a two-minute break here if you wish. Click on the button to continue.</p>'],
    show_clickable_nav: true,
  };
  timeline.push(captionBreak);


  var captionBlock1 = {
    type: 'instructions',
    pages: ['<b>Block 2/2</b>.'],
    show_clickable_nav: true,
  };
  timeline.push(captionBlock1);


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
  timeline.push(block1);


  var debriefing = {
    type: 'instructions',
    pages: [
      'Thank you, the experiment is now complete. You will now be returned to Prolific.',
    ],
    show_clickable_nav: true,
  };
  timeline.push(debriefing);

  /*
    =============================
                MAIN
    =============================
  */

  jsPsych.init({
    timeline: timeline,
      on_finish: function () {
          // Send over sockets.       
          var filename = `subject_${subjectNo}.csv`;


          // TODO data cleaning/formatting. e.g.:
          // var expData = jsPsych.data.get().ignore(['view_history', 'responses', 'internal_node_id', 'key_press', 'accuracy', 'event']).csv();


          var expData = jsPsych.data.get().csv();


          // Send to server, and download data.
          socket.emit('csv', {filename: filename, expData: expData}, function(confirmation){ 
            console.log(confirmation);
            window.location = "https://app.prolific.co/submissions/complete?cc=6AD744E4"; // TODO
          });


      }
    // on_finish: function() {
    // jsPsych.data.displayData();
    // }
  });
});