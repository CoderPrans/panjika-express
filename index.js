// import astronomy-engine
import { MoonPhase, SearchMoonPhase } from 'astronomy-engine'; 

let tithis = [ "Shukl Prti. (Br 1)", "Shukl Dwit. (Br 2)", "Shukl Trit. (Br 3)", "Shukl Catu. (Br 4)", "Shukl Panch. (Br 5)", "Shukl Sast. (Br 6)", "Shukl Sapt. (Br 7)", "Shukl Asht. (Br 8)", "Shukl Nava. (Br 9)", "Shukl Dasm. (Br 10)", "Shukl Ekad. (Br 11)", "Shukl Dwad. (Br 12)", "Shukl Tryod. (Br 13)", "Shukl Caturd. (Br 14)",
  "Purnima (Full Moon)",
  "Krshn Prti. (Da 1)", "Krshn Dwit. (Da 2)", "Krshn Trit. (Da 3)", "Krshn Catu. (Da 4)", "Krshn Panch. (Da 5)", "Krshn Sast. (Da 6)", "Krshn Sapt. (Da 7)", "Krshn Asht. (Da 8)", "Krshn Nava. (Da 9)", "Krshn Dasm. (Da 10)", "Krshn Ekad. (Da 11)", "Krshn Dwad. (Da 12)", "Krshn Tryod. (Da 13)", "Krshn Caturd. (Da 14)",
  "Amavasya (New Moon)"]

function getTithi(date) {
  let moonFactor = MoonPhase(date) / 12;
  let tithiIndex = Math.floor(moonFactor); 
  let tithiRemaining = moonFactor % 1; 

  return [tithis[tithiIndex], parseFloat(tithiRemaining*100).toFixed(2) + "%"];
}

const lastPurnima = (tm=new Date()) => SearchMoonPhase(180, tm, -30)?.date;

function* tithiTransitions({it, time=new Date().getTime()}) {
  // let time = new Date().getTime(); 
  let interval = 5*60*1000;
  let i = 1;

  let itInterval = 6*60*60*1000;

  let tithi = getTithi(new Date());

  while(true){
    let nextTithi; 
    if(!it) {
      // when not iterating for specific tithi use 10 secs interval
      nextTithi = getTithi(new Date(time + i*interval));
      if(nextTithi[0] !== tithi[0]) {
        yield [nextTithi[0], new Date(time + i*interval)];
        tithi = nextTithi;
      }
    }

    // when iterating for specific tithi use 6 hrs interval
    nextTithi = getTithi(new Date(time + i*itInterval));
    let dtPrev = `${new Date(time + (i-1)*itInterval).getMonth()+1}/${new Date(time + (i-1)*itInterval).getDate()}`;
    let dtNext = `${new Date(time + i*itInterval).getMonth()+1}/${new Date(time + i*itInterval).getDate()}`;
    if(nextTithi[0] === tithis[it] && dtPrev !== dtNext) {
      yield [nextTithi[0], new Date(time + i*itInterval).toString()];
      tithi = nextTithi;
    }
    i+=1;
  } 
}

function next30(time) {
  let list = [];

  let tithiterator = tithiTransitions({time: new Date(time).getTime()}); 

  // get tithi transition times for next 30 tithis. 
  for(let i=0; i<30; i++) {
    list.push(tithiterator.next().value)
  }

  return list;
}

// let tithiterator = tithiTransitions({}); 
// // get tithi transition times for next 30 tithis. 
// for(let i=0; i<30; i++) {
//   console.log(tithiterator.next().value);
// }

// let purnimaiterator = tithiTransitions({it: 14});
// // get tithi purnima times for next 12 purnimas. 
// for(let i=0; i<12; i++) {
//   console.log(purnimaiterator.next().value);
// } 

// console.log( "last Purnima dateTime, ", lastPurnima());

export default {tithiTransitions, next30, lastPurnima};
