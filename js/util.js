/* Utils */

// Build audio stimulus list from scratch.
function getTimelineVars (subjectNo, blockNo, repeats, asJSON) 
{
  let out = [];
  
  let types = [
    'BASIC',
    'CONTROL',
    'FM_ONLY',
    'FROZEN',
    'PAM',
    'RAG',
    'RAG_RAF',
    'SHUFFLE',
    'SHUFFLE_RAF',
    'SIMPLE',
    'SIMPLE_RAF'
  ];
  
  for (let r = 0; r < repeats; r++)
  {
    out = out.concat(types.map(x => `${x}_${r}.wav`));
  }
  
  out = out.map(x => `audio/subject_${subjectNo}/block_${blockNo}/${x}`);

  if (asJSON === true) {
    out = out.map(x => JSON.parse(`{"stimulus": "${x}"}`));
  }
  
  return out; 
}


// Checking consent from consent form.
function check_consent(elem) {
  if (document.getElementById('consent_checkbox').checked) {
    return true;
  }
  else {
    alert("If you wish to participate, you must check the box next to the statement 'I agree to participate in this study.'");
    return false;
  }
  return false;
};

