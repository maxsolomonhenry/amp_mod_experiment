

audio = getTimelineVars(0, 0, 2, false);
console.log(getTimelineVars(0, 0, 2, true));

var preload = {
    type: 'preload',
    audio: audio,
};

// Define welcome message trial.
var welcome = {
  type: "instructions",
  pages: ["Welcome to the experiment. Press any key to begin."],
  show_clickable_nav: true
};

var ratingProcedure = {
  timeline: [
    {
      type: "audio-slider-response",
      labels: ["less fused", "more fused"],
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
  timeline_variables: getTimelineVars(0, 0, 2, true),
  randomize_order: true,
}

var timeline = [];
timeline.push(preload);
timeline.push(welcome);
timeline.push(ratingProcedure);


// Function that runs the experiment.
function startExp(){
  jsPsych.init({
    timeline: timeline,
    on_finish: function() {
    jsPsych.data.displayData();
    }
  });
}