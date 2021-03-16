/* Utils */

function getTimelineVars (subjectNo, blockNo, repeats, asJSON) 
{
  // Build audio stimulus list from scratch.
  let out = [];
  
  let types = [
    'BASIC',
    'CONTROL',
    'FROZEN',
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