
// Connect socket. This version seems to adapt to new ports specified in `app.js``
let socket = io();
let audio = [];


async function init() {
  /* 
    Parse URL parameters.

    Prolific ID: PROLIFIC_PID
    Study ID: STUDY_ID
    Session ID: SESSION_ID
  */

  const myQueryString = window.location.search;
  const urlParams = new URLSearchParams(myQueryString);

  // StudyType: 0 is fusion, 1 is realism.
  var studyType = urlParams.get('TYPE');

  var prolificID = urlParams.get('PROLIFIC_PID');
  var studyID = urlParams.get('STUDY_ID');
  var sessionID = urlParams.get('SESSION_ID');

  jsPsych.data.addProperties({
    prolificID: prolificID,
    studyID: studyID,
    sessionID: sessionID,
    studyType: studyType,
  });

  return studyType;
};


// Start here.
init().then((studyType) => {

  var trialPrompts = [
    ["<p>How fused is this sound?</p>"],
    ["<p>How realistic is this vibrato?</p>"],
  ];

  var trialLabels = [
    ["greater multiplicity (more sources)", "greater unity (less sources)"],
    ["not realistic at all", "very realistic"],
  ];

  socket.emit('requestSubjectNo', null, (count) => {

    /*
      Preload subject-dependent blocks of audio.
      getTimelineVars (subjectNo, blockNo, repeats, asJSON) 
    */

    subjectNo = count;

	/*
		if (subjectNo > 99) {
		  document.getElementById("prompt").innerHTML = "Maximum number of participants reached. Please check back later.";
		  return;
		}
	*/


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
        '<p>To navigate these text prompts, you may click the "Next" and "Previous" buttons below.</p>' +
        '<p>Alternately, you can use your keyboard left-arrow and right-arrow to step through the prompts.</p>',
        '<p> We are investigating the perception of musical vibrato. ' +
        'Before we begin, we need to know if you are the right participant for this experiment. </p><br>' + 
        '<h3>Are you the right participant for us?</h3>' +
        '<p>Anyone can participate in this experiment so long as they have normal hearing.</p><br>' + 
        '<h3>Please ensure you have the following before participating:</h3>' +
        '<ul><li>You are currently using a laptop or desktop computer and not using a mobile device.</li>'+
        '<li>You are using a current web browser with Javascript enabled (Chrome/Firefox are preferred).</li>'+
        '<li>You have a set of headphones to use during the experiment (do not use your speakers).</li>'+
        '<li>You are participating in a quiet environment with very little background noise.</li></ul><br>' +
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
        '<p>You will now hear six sounds that are typical of the sounds in this experiment. </p>' +
        '<p>They have been pre-adjusted to be approximately the same loudness.</p>',
        '<p>As you listen to the sounds, adjust your system volume so that they are playing back to you at a comfortable level.</p>' +
        '<p>After you have set your volume, please <b> do not adjust your system volume for the rest of the experiment </b>.</p>' +
        '<p>Click Next to start listening.</p>'
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


    if (studyType == 0) {
      // FUSION EXPERIMENT.
      var instructions = {
        type: "instructions",
        pages: [
          "<p>Thank you.</p>" +
          "<p>In this experiment you will rate a series of short sounds, one at a time. </p>" +
          "You will rate each sound by how <b>fused</b> it is, on a scale from <b>greater multiplicity</b> to <b>greater unity</b>.",
          "<h3>What does fused mean?</h3>" +
          "<p>All sound is made up of many simple components. Oftentimes they seem to be 'fused' together.</p>" +
          "<p>Components that are fused make a sound that we hear as coming from one source, or having a sense of <b>unity</b>.</p> " +
          "<p>For example, the sound of a violin is made up of many fused components, but we hear it as one source.</p>",
          "<p>Components that are not fused make a sound that seems cloudy, or coming from multiple sources at once. Such sounds have a sense of <b>multiplicity</b>.</p>" +
          "<p>To help remind you of their meaning, the scale has additional labels in brackets: </p>" +
          "<p><b>greater multiplicity (more sources)</b> and <b>greater unity (less sources)</b>.</p>",
          "<p>This short experiment takes place over two blocks. In each block you will hear and then rate 44 short sounds.</p>" +
          "<p>Drag the slider to indicate your desired response. It can be placed at any point between the two extremes.</p>" +
          "<p>You must click on the slider at least once to record your answer. When you are done, click 'Continue' to move on to the next trial.</p>",
          "We will now proceed to the practice block.",
        ],
        show_clickable_nav: true
      };
    } else if (studyType ==1 ) {
      // REALISM EXPERIMENT.
      var instructions = {
        type: "instructions",
        pages: [
          "Thank you.",
          "<p>In this experiment you will rate a series of short sounds, one at a time. </p>" +
          "<p>For each sound you will rate the perceived vibrato on a scale from <b>not realistic at all</b> to <b>very realistic</b>.</p><br>" +
          "<h3>What is vibrato?</h3>" +
          "<p>Vibrato is a smooth, cyclic variation of sound that performers use to add expression to musical notes. </p>" +
          "<p>Opera singers are well-known for their wide pitch vibrato.</p> " +
          "<p>However, vibrato does not have to be a variation of pitch. Some kinds of instrument vibrato have very little change in pitch at all.</p>",
          "<p>You are about to hear sounds that have varying kinds of 'cyclic change.'</p>" +
          "<p>We want to know which kinds of change sound like vibrato to you.</p><br>" +
          "<p>To help remind you of the task, the scale has the following labels: </p>" +
          "<p><b>not realistic at all</b> to <b>very realistic</b>.</p>" +
          "<p>Drag the slider to indicate your desired response. It can be placed at any point between the two extremes.</p>",
          "<p>You must click on the slider at least once to record your answer. When you are done, click 'Continue' to move on to the next trial.</p>" +
          "<p>This short experiment takes place over two blocks. In each block you will hear and then rate 44 short sounds. </p>",
          "We will now proceed to the practice block.",
        ],
        show_clickable_nav: true
      };
    }
    
    timeline.push(instructions);


    var practiceBlock = {    
      type: "audio-slider-response",
      labels: trialLabels[studyType],
      min: 0,
      max: Number.MAX_SAFE_INTEGER,
      slider_start: Math.floor( Number.MAX_SAFE_INTEGER / 2 ),
      step: 1,
      slider_width: 500,       // (in pixels).
      require_movement: true,
      prompt: trialPrompts[studyType],
      timeline: [
        {stimulus: 'audio/MISC/train1.wav'},
        {stimulus: 'audio/MISC/train2.wav'}
      ]
    };
    timeline.push(practiceBlock);


    var preMain = {
      type: "instructions",
      pages: [
        "<p>We will now proceed to the main experiment.</p>" +
        "<p>At the end of the last block, you will be redirected to Prolific.</p>" +
        "<p>Thank you for your participation.</p>"
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
          labels: trialLabels[studyType],
          stimulus: jsPsych.timelineVariable('stimulus'),
          min: 0,
          max: Number.MAX_SAFE_INTEGER,
          slider_start: Math.floor( Number.MAX_SAFE_INTEGER / 2 ),
          step: 1,
          slider_width: 500,
          require_movement: true,
          prompt: trialPrompts[studyType],
        }
      ],
      timeline_variables: getTimelineVars(subjectNo, 0, 4, true),
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
          labels: trialLabels[studyType],
          stimulus: jsPsych.timelineVariable('stimulus'),
          min: 0,
          max: Number.MAX_SAFE_INTEGER,
          slider_start: Math.floor( Number.MAX_SAFE_INTEGER / 2 ),
          step: 1,
          slider_width: 500,       // (in pixels).
          require_movement: true,
          prompt: trialPrompts[studyType],
        }
      ],
      timeline_variables: getTimelineVars(subjectNo, 1, 4, true),
      randomize_order: true,
    }
    timeline.push(block1);


    var debriefing = {
      type: 'instructions',
      pages: [
        '<p>Thank you, the experiment is now complete.</p><br>' + 
        '<h3>What are we studying?</h3>' +
        '<p>We are studying vibrato, and what conditions are necessary to hear it in simple synthetic stimuli.</p>' + 
        '<p>The sounds that you just heard are based on a real sample of cello vibrato.</p>' +
        '<p>Each kind of stimulus is degraded in a particular way.</p>',
        '<p>We are trying to see which particular degredations destroy the effect of vibrato.</p>' +
        '<p>From our preliminary explorations, it seems like vibrato comes through when the partials of the signal have a common "amplitude modulation rate."</p>' +
        '<p>That means that when all of the sound components are moving together in volume, you may be more likely to hear a fused vibrato sound.</p>' +
        '<p>If you are interested in this subject, you are welcome to contact us <a href="mailto:max.henry@mail.mcgill.ca">here</a> with questions. </p>',
        'This concludes the study. Thank you. You will now be returned to Prolific.',
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
              window.location = "https://app.prolific.co/submissions/complete?cc=483CA773"; // TYPE=0 experiment.
            });


        }
      // on_finish: function() {
      // jsPsych.data.displayData();
      // }
    });


  });
});
